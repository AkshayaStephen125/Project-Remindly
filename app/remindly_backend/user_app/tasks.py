from celery import shared_task
from datetime import datetime, timedelta
from user_app.models import Task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


@shared_task
def check_reminders():
    now = datetime.now().replace(second=0, microsecond=0)
    next_minute = now + timedelta(minutes=1)

    print(f"🔍 Checking reminders between: {now} AND {next_minute}")

    reminders = Task.objects(
        remind_at__gte=now,
        remind_at__lt=next_minute
    )

    if reminders:
        channel_layer = get_channel_layer()

        for reminder in reminders:
            print(f"⏰ Reminder Triggered: {reminder.task}")

            async_to_sync(channel_layer.group_send)(
                "reminders_group",  # ✅ MUST MATCH consumer
                {
                    "type": "reminder_message",
                    "message": reminder.task,
                    "id": str(reminder.id),
                }
            )

            print("📤 WebSocket event dispatched to CHANNEL LAYER ✅")
    else:
        print("❌ No reminders matching current time.")

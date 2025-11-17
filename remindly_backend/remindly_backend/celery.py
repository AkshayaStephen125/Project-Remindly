# remindly_backend/celery.py

from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Set default Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "remindly_backend.settings")

# Create Celery app instance
app = Celery("remindly_backend")

# Load Django settings with CELERY_ namespace filtering
app.config_from_object("django.conf:settings", namespace="CELERY")

# Auto-discover tasks from all installed apps
app.autodiscover_tasks()

from celery.schedules import crontab
app.conf.beat_schedule = {
    "run-check-reminders-every-minute": {
        "task": "user_app.tasks.check_reminders",
        "schedule": crontab(minute="*/1"),
    },
}


@app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")

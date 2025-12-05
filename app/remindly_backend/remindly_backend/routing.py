from django.urls import re_path
from user_app.consumers import ReminderConsumer

websocket_urlpatterns = [
    re_path(r"ws/reminders/$", ReminderConsumer.as_asgi()),
]

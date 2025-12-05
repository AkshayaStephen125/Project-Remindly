from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ReminderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("reminders_group", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("reminders_group", self.channel_name)

    async def reminder_message(self, event): 
        print("📥 WebSocket received event in consumer ✅", event)
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "id": event["id"]
        }))

from mongoengine import Document, StringField, DateTimeField, IntField, connect
from datetime import datetime

# 1️⃣ Connect to MongoDB
connect(
    db='remindly_db',      # database name
    host='localhost',       # or your MongoDB host
    port=27017              # default MongoDB port
)

# 2️⃣ Define Task Document
class Task(Document):
    user_id = IntField(required=True)
    task = StringField(max_length=150, required=True)
    remind_at = DateTimeField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super(Task, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.id} - {self.task}"

# 3️⃣ Insert a sample task
sample_task = Task(
    user_id=1,
    task="Test Task for MongoDB Compass",
    remind_at=datetime(2025, 10, 26, 7, 0)
)

sample_task.save()
print(f"Task saved! ID: {sample_task.id}")

# 4️⃣ Fetch all tasks to verify
tasks = Task.objects()
for t in tasks:
    print(t.user_id, t.task, t.remind_at)

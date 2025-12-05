from django.db import models
from mongoengine import Document, StringField, DateTimeField, IntField
from django.utils import timezone   

# Create your models here.


class Task(Document):
    user_id = IntField(required=True)
    task = StringField(max_length=150)
    remind_at = DateTimeField()
    created_at = DateTimeField(default=timezone.now)
    updated_at = DateTimeField(default=timezone.now)
    
    def save(self, *args, **kwargs):
        if self.remind_at:
            if timezone.is_aware(self.remind_at):
                pass 
            else:
                self.remind_at = timezone.make_aware(self.remind_at)
            self.updated_at = timezone.now()
            return super(Task, self).save(*args, **kwargs)


    def __str__(self):
        return f"{self.id} - {self.task}"

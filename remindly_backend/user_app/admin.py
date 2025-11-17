# user_app/admin.py
from django_mongoengine import mongo_admin as admin
from .models import Task

class TaskAdmin(admin.DocumentAdmin):
    list_display = ('id', 'task', 'remind_at')
    search_fields = ('task',)

# Register explicitly
admin.site.register(Task, TaskAdmin)

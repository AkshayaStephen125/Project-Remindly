import graphene
import logging
import graphql_jwt
from graphene_django import DjangoObjectType
from user_app import models
from graphql_jwt.decorators import login_required
from django.contrib.auth import get_user_model
from graphene_mongo import MongoengineObjectType

logger = logging.getLogger(__name__)

class TaskType(MongoengineObjectType):
    class Meta:
        model = models.Task
        fields = ('id','user_id','task','remind_at','created_at','updated_at')

class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class UserCreateInput(graphene.InputObjectType):
    username = graphene.String(required=True)
    email = graphene.String(required=True)
    password = graphene.String(required=True)


class TaskCreateInput(graphene.InputObjectType):
    task = graphene.String(required=True)
    remind_at = graphene.DateTime(required=True)



class TaskUpdateInput(graphene.InputObjectType):
    task_id = graphene.ID(required=True)
    task = graphene.String()
    remind_at = graphene.DateTime()





class Query(graphene.ObjectType):
    tasks = graphene.List(TaskType, resolver=lambda root, info: root.resolve_tasks(info))
    task = graphene.Field(TaskType, id=graphene.Int(required=True))

    @login_required
    def resolve_tasks(self, info):
        user = info.context.user
        if user.is_anonymous:
            return []
        tasks = models.Task.objects.filter(user_id=user.id)
        if not tasks:
            logger.info("No tasks found for this user")
        return list(tasks)
    
    def resolve_task(self, info, id):
        user = info.context.user
        if user.is_anonymous:
            return None
        try:
            return models.Task.objects.get(pk=id)
        except models.Task.DoesNotExist:
            return None


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        input = UserCreateInput(required=True)

    def mutate(root, info, input):
        user = get_user_model()(username=input.username, email=input.email)
        user.set_password(input.password)
        user.save()
        return CreateUser(user=user)
    
class CreateTask(graphene.Mutation):
    task = graphene.Field(TaskType)

    class Arguments:
        input = TaskCreateInput(required=True)

    def mutate(root, info, input):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required")
        task = models.Task(
        task  = input.task,
        remind_at = input.remind_at,
        user_id = user.id
        )
        task.save()  
        return CreateTask(task=task)
    

class UpdateTask(graphene.Mutation):
    task = graphene.Field(TaskType)

    class Arguments:
        input = TaskUpdateInput(required=True)

    def mutate(root, info, input):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required")
 
        from bson import ObjectId
        task = models.Task.objects.get(id=ObjectId(input.task_id))
        if input.task:
            task.task  = input.task
        if input.remind_at:
            task.remind_at = input.remind_at
        task.save()  
        return UpdateTask(task=task)
    

class DeleteTask(graphene.Mutation):
    deleted = graphene.Boolean()
    task = graphene.Field(TaskType)

    class Arguments:
        task_id = graphene.ID(required=True)

    def mutate(root, info, task_id):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required")
 
        from bson import ObjectId
        task = models.Task.objects.get(id=ObjectId(task_id))
        task.delete()
        return DeleteTask(deleted=True, task=task)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    delete_task = DeleteTask.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
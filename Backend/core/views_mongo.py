from rest_framework import status, viewsets
from rest_framework.permissions import SAFE_METHODS, BasePermission, IsAuthenticated
from rest_framework.response import Response
from .models_mongo import Project, Story, Task
from .serializers_mongo import ProjectSerializer, StorySerializer, TaskSerializer


class IsNotGuest(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if request.method in SAFE_METHODS:
            return True
        if not user.is_authenticated:
            return False
        if user.role == "guest":
            return False
        return True
    
class ProjectViewSet(viewsets.ViewSet):
    permission_classes = [IsNotGuest]
    
    def list(self, request):
        print("User:", request.user, "is_authenticated:", request.user.is_authenticated)
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            project = Project.objects.get(id=pk)
        except Project.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProjectSerializer(project)
        return Response(serializer.data)

    def create(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            project = Project.objects.get(id=pk)
        except Project.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            project = Project.objects.get(id=pk)
        except Project.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class StoryViewSet(viewsets.ViewSet):
    permission_classes = [IsNotGuest]
    
    def list(self, request):
        stories = Story.objects.all()
        serializer = StorySerializer(stories, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            story = Story.objects.get(id=pk)
        except Story.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = StorySerializer(story)
        return Response(serializer.data)

    def create(self, request):
        serializer = StorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            story = Story.objects.get(id=pk)
        except Story.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = StorySerializer(story, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            story = Story.objects.get(id=pk)
        except Story.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        story.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class TaskViewSet(viewsets.ViewSet):
    permission_classes = [IsNotGuest]
    
    def list(self, request):
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    def create(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


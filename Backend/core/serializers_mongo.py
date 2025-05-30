from rest_framework import serializers
from .models_mongo import Project, Story, Task

class ProjectSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=64)
    name = serializers.CharField(max_length=255)
    description = serializers.CharField()

    def create(self, validated_data):
        return Project(**validated_data).save()

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class StorySerializer(serializers.Serializer):
    id = serializers.CharField(max_length=64)
    name = serializers.CharField(max_length=255)
    description = serializers.CharField()
    priority = serializers.CharField(max_length=16)
    projectId = serializers.CharField(max_length=64)
    createdAt = serializers.DateTimeField()
    status = serializers.CharField(max_length=16)
    ownerId = serializers.CharField(max_length=64)

    def create(self, validated_data):
        return Story(**validated_data).save()

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class TaskSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=64)
    name = serializers.CharField(max_length=255)
    description = serializers.CharField()
    priority = serializers.CharField(max_length=16)
    storyId = serializers.CharField(max_length=64)
    estimatedHours = serializers.FloatField()
    status = serializers.CharField(max_length=16)
    createdAt = serializers.DateTimeField()
    startedAt = serializers.DateTimeField(required=False, allow_null=True)
    finishedAt = serializers.DateTimeField(required=False, allow_null=True)
    assigneeId = serializers.CharField(max_length=64, required=False, allow_null=True, allow_blank=True)
    loggedHours = serializers.FloatField(required=False, allow_null=True)

    def create(self, validated_data):
        return Task(**validated_data).save()

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

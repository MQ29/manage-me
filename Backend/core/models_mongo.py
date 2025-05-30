import mongoengine as me

class Project(me.Document):
    id = me.StringField(primary_key=True, required=True)
    name = me.StringField(required=True)
    description = me.StringField(required=True)

class Story(me.Document):
    id = me.StringField(primary_key=True, required=True)
    name = me.StringField(required=True)
    description = me.StringField(required=True)
    priority = me.StringField(required=True, choices=("niski", "średni", "wysoki"))
    projectId = me.StringField(required=True)
    createdAt = me.DateTimeField(required=True)
    status = me.StringField(required=True, choices=("todo", "doing", "done"))
    ownerId = me.StringField(required=True)

class Task(me.Document):
    id = me.StringField(primary_key=True, required=True)
    name = me.StringField(required=True)
    description = me.StringField(required=True)
    priority = me.StringField(required=True, choices=("niski", "średni", "wysoki"))
    storyId = me.StringField(required=True)
    estimatedHours = me.FloatField(required=True)
    status = me.StringField(required=True, choices=("todo", "doing", "done"))
    createdAt = me.DateTimeField(required=True)
    startedAt = me.DateTimeField()
    finishedAt = me.DateTimeField()
    assigneeId = me.StringField()
    loggedHours = me.FloatField()

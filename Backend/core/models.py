from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('devops', 'DevOps'),
        ('developer', 'Developer'),
        ('guest', 'Guest'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='developer')


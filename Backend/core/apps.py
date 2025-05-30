from django.apps import AppConfig
import mongoengine

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        from django.conf import settings
        mongoengine.connect(
            db=settings.MONGODB_NAME,
            host=settings.MONGODB_HOST
        )

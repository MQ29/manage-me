from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from core.views_mongo import ProjectViewSet, StoryViewSet, TaskViewSet
from core.views import CurrentUserView, GoogleLoginView, RegisterView, user_list

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'stories', StoryViewSet, basename='story')
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("api/register/", RegisterView.as_view(), name="register"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/me/', CurrentUserView.as_view(), name='current_user'),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('accounts/', include('allauth.urls')),
    path('api/google-login/', GoogleLoginView.as_view(), name='google_login'),
    path('api/', include(router.urls)),
    path('api/users/', user_list, name='user-list'),
]

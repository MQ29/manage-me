from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import RegisterSerializer, UserSerializer
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Rejestracja udana"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

User = get_user_model()

class GoogleLoginView(APIView):
    def post(self, request):
        id_token = request.data.get('token')
        if not id_token:
            return Response({'detail': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
            idinfo = google_id_token.verify_oauth2_token(
                id_token, google_requests.Request(), CLIENT_ID
            )
            email = idinfo.get('email')
            name = idinfo.get('name', email.split('@')[0])
            if not email:
                return Response({'detail': 'No email found in token'}, status=status.HTTP_400_BAD_REQUEST)
            user, created = User.objects.get_or_create(email=email, defaults={"username": email, "first_name": name})
            if created:
                user.role = 'guest'
                user.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            })
        except Exception as e:
            return Response({'detail': 'Invalid token', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
def user_list(request):
    users = User.objects.all().values('id', 'first_name', 'last_name', 'role')
    result = [
        {
            "id": str(u["id"]),
            "first_name": u["first_name"],
            "last_name": u["last_name"],
            "role": u["role"]
        }
        for u in users
    ]
    return JsonResponse(result, safe=False)
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

# from .serializers import (
#     RegisterSerializer,
#     LoginSerializer,
#     BlogSerializer,
#     CommentSerializer,
#     SubscriberSerializer,
# )

@api_view(['GET'])
def home_view(request):
    return Response({"message": "Welome to IDS home!"})
import os
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response


from rest_framework.decorators import api_view
@api_view(['GET'])
def home_view(request):
    return Response({"message": "Welome to IDS home!"})


class EventSearchAPIView(APIView):
    print('+'*100)

    def get(self, request):
        query = request.query_params.get('query', '').strip()
        print(f"Query: {query}")
        if not query:
            return Response({"error": "Query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Path to where your xaa, xab, ... files are stored
        events_dir = os.path.join(settings.BASE_DIR, 'events')
        print(events_dir)

        result = []
        for filename in os.listdir(events_dir):
            filepath = os.path.join(events_dir, filename)

            if not os.path.isfile(filepath):
                continue

            try:
                with open(filepath, 'r') as file:
                    for line in file:
                        if query in line:
                            parts = line.strip().split()
                            if len(parts) >= 15:
                                result.append({
                                    "srcaddr": parts[4],
                                    "dstaddr": parts[5],
                                    "action": parts[-2],
                                    "status": parts[-1],
                                    "filename": filename
                                })
            except Exception as e:
                continue

        print('+'*100)
        return Response(result, status=status.HTTP_200_OK)
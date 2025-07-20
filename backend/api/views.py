import os
import time
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .serializers import EventSearchSerializer
from .serializers import FIELD_INDEX_MAP


from rest_framework.decorators import api_view
@api_view(['GET'])
def home_view(request):
    return Response({"message": "Welome to IDS home!"})


class EventSearchAPIView(APIView):
    def get(self, request, *args, **kwargs):

        # Start time measurement
        start_search_time = time.time()  

        serializer = EventSearchSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        query = serializer.validated_data.get('query')
        start_time = serializer.validated_data.get('start_time')
        end_time = serializer.validated_data.get('end_time')

        key, val = None, None
        if query:
            try:
                key, val = query.split('=')
            except ValueError:
                return Response({"error": "Query must be in key=value format."}, status=400)

        results = []
        events_dir = os.path.join(settings.BASE_DIR, 'events')

        for filename in os.listdir(events_dir):
            filepath = os.path.join(events_dir, filename)
            if not os.path.isfile(filepath):
                continue

            try:
                with open(filepath, 'r') as f:
                    for line in f:
                        parts = line.strip().split()

                        if len(parts) < 15:
                            continue

                        try:
                            event_start_time = int(parts[-3])
                            event_end_time = int(parts[-4])
                        except ValueError:
                            continue

                        # Filter by provided start_time and end_time
                        if start_time and event_end_time < start_time:
                            # Event ends before search window
                            continue  

                        if end_time and event_start_time > end_time:
                            # Event starts after search window
                            continue

                        is_matched = True
                        if key and val:
                            try:
                                field_index = FIELD_INDEX_MAP.get(key)
                                if field_index is None:
                                    continue
                                field_data = parts[field_index]
                                if field_data != val:
                                    is_matched = False
                            except Exception as e:
                                continue

                        if is_matched:
                            # End time measurement
                            end_search_time = time.time()
                            duration = round(end_search_time - start_search_time, 2)

                            results.append({
                                "srcaddr": parts[4],
                                "dstaddr": parts[5],
                                "action": parts[-2],
                                "status": parts[-1],
                                "filename": filename,
                                "duration": f'{duration} seconds'
                            })

            except Exception as e:
                continue

        return Response(results, status=status.HTTP_200_OK)
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
        print('+' * 100)
        print(request.query_params)
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

        print("Search Parameters:", query, start_time, end_time)

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
                        print(f"Parts: {parts}")

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
                                print(f"Exception: {e}")
                                continue

                        if is_matched:
                            results.append({
                                "srcaddr": parts[4],
                                "dstaddr": parts[5],
                                "action": parts[-2],
                                "status": parts[-1],
                                "filename": filename,
                                "event_time": event_start_time
                            })
                        break  # break after processing first matching line
                break
            except Exception as e:
                print(f"Error reading file {filename}: {e}")
                continue

        return Response(results, status=status.HTTP_200_OK)
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
    return Response({"message": "Welome to Event Tracker home!"})


class EventSearchAPIView(APIView):
    def get(self, request, *args, **kwargs):
        start_search_time = time.time()
        results = []

        try:
            serializer = EventSearchSerializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)

            query = serializer.validated_data.get('query')
            start_time = serializer.validated_data.get('start_time')
            end_time = serializer.validated_data.get('end_time')

            key, val = None, None
            ip_address = None

            if query:
                query = str(query).strip()

                print(f'View: {query} & type: {type(query)}')

                if '=' in query:
                    try:
                        key, val = query.split('=', 1)
                    except ValueError:
                        # raise ValidationError("Query format is invalid. Use 'key=value'.")
                        return Response({
                                "success": False,
                                "message": "Query format is invalid. Use 'key=value'.",
                                "data": []
                            }, status=status.HTTP_400_BAD_REQUEST)
                else:
                    ip_address = query

            events_dir = os.path.join(settings.BASE_DIR, 'events')

            for filename in os.listdir(events_dir):
                filepath = os.path.join(events_dir, filename)
                if not os.path.isfile(filepath):
                    continue

                try:
                    with open(filepath, 'r') as f:
                        for line in f:
                            print('=>tag-2')
                            parts = line.strip().split()
                            if len(parts) < 15:
                                continue

                            print('=>tag-3')

                            try:
                                event_start_time = int(parts[-3])
                                event_end_time = int(parts[-4])
                            except ValueError:
                                continue

                            if start_time and event_end_time < start_time:
                                continue
                            if end_time and event_start_time > end_time:
                                continue

                            is_matched = True
                            if key and val:
                                print('=>tag-4')
                                field_index = FIELD_INDEX_MAP.get(key)

                                if field_index is None:
                                    continue
                                if parts[field_index] != val:
                                    is_matched = False

                            srcaddr = parts[4]
                            dstaddr = parts[5]
                            action = parts[-2]
                            log_status = parts[-1]
                            if ip_address and ip_address not in [srcaddr, dstaddr]:
                                is_matched = False

                            if is_matched:
                                end_search_time = time.time()
                                duration = round(end_search_time - start_search_time, 2)
                                results.append({
                                    "srcaddr": srcaddr,
                                    "dstaddr": dstaddr,
                                    "action": action,
                                    "status": log_status,
                                    "filename": filename,
                                    "duration": f'{duration} seconds'
                                })
                except Exception as e:
                    continue

            # Success or no result case
            if results:
                return Response({
                    "success": True,
                    "message": "Matching events found.",
                    "data": results
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "success": False,
                    "message": "No matching events found.",
                    "data": []
                }, status=status.HTTP_200_OK)

        # except Exception as e:
        except Exception as e:
            print('-'*100)
            print(e)
            print('-'*100)
            # Check if the exception has a response with non_field_errors
            try:
                error_data = getattr(e, 'detail', {})  # e.g. from serializers.ValidationError
                non_field_error = (
                    error_data.get('non_field_errors', [])[0]
                    if isinstance(error_data, dict) and 'non_field_errors' in error_data
                    else None
                )
            except Exception:
                non_field_error = None

            return Response({
                "success": False,
                "message": non_field_error or "Something went wrong.",
                "data": []
            }, status=status.HTTP_400_BAD_REQUEST)
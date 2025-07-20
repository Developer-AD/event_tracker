from rest_framework import serializers
from rest_framework.exceptions import ValidationError


FIELD_INDEX_MAP = {
    'serialno': 0, 'version': 1, 'account-id': 2,
    'instance-id': 3, 'srcaddr': 4, 'dstaddr': 5,
    'srcport': 6, 'dstport': 7, 'protocol': 8,
    'packets': 9, 'bytes': 10, 'starttime': 11,
    'endtime': 12, 'action': 13, 'log-status': 14
}


class EventSearchSerializer(serializers.Serializer):
    query = serializers.CharField(required=False, allow_blank=True)
    start_time = serializers.IntegerField(required=False)
    end_time = serializers.IntegerField(required=False)


    def validate(self, attrs):
        query = attrs.get('query', '').strip()
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')

        # Raise error on empty query params.
        if not query and start_time is None and end_time is None:
            raise ValidationError("At least one of 'query', 'start_time', or 'end_time' must be provided.")
        
        # Check key in query params.
        if query:
            key, val = query.split('=')

            if key not in FIELD_INDEX_MAP.keys():
                raise ValidationError(f"Search key '{key}' is invalid")
            
        # Validate start and end time.
        if start_time and end_time:
            if start_time > end_time:
                raise ValidationError("Start time must be less than or equal to end time.")
            
        return attrs
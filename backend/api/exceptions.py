from rest_framework.views import exception_handler as drf_exception_handler

def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    if response is not None:
        # Extract the error message
        if isinstance(response.data, dict):
            # If it's a validation error, get the first field's message
            error = next(iter(response.data.values()))
            if isinstance(error, list):
                message = error[0]
            else:
                message = str(error)
        else:
            message = str(response.data)

        response.data = {
            "success": False,
            "message": message,
            "data": []
        }

    return response

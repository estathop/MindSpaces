import grpc
from concurrent import futures
import time
import echo.echo_pb2_grpc as pb2_grpc
import echo.echo_pb2 as pb2
import config


class UnaryService(pb2_grpc.UnaryServicer):

    def __init__(self, *args, **kwargs):
        pass

    def GetTAResponse(self, request, context):
        # get the string from the incoming request
        message = request.message
        message = pb2.TAMessage(message=message)
        print(message)
        #result = f'Hello I am up and running received "{message.va_analysis.emotion} " message from you'
        result = f'Hello I am up and running received  message from you'
        result = {'message': result, 'received': True}
        return pb2.MessageResponse(**result)

    def GetServerResponse(self, request, context):
        # get the string from the incoming request
        message = request.message
        result = f'Hello I am up and running received "{message}" message from you'
        result = {'message': result, 'received': True}

        return pb2.MessageResponse(**result)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    pb2_grpc.add_UnaryServicer_to_server(UnaryService(), server)
    server.add_insecure_port('[::]:{}'.format(config.GRPC_PORT))
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    serve()

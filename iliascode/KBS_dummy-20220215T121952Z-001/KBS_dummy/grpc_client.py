import grpc
import echo.echo_pb2_grpc as pb2_grpc
import echo.echo_pb2 as pb2
import config


class GrpcClient(object):
    """
    Client for gRPC functionality
    """

    def __init__(self):
        #self.host = 'localhost'
        self.host = '160.40.52.155'  # change according to connection ip
        self.server_port = config.GRPC_PORT

        # instantiate a channel
        self.channel = grpc.insecure_channel(
            '{}:{}'.format(self.host, self.server_port))

        # bind the client and the server
        self.stub = pb2_grpc.UnaryStub(self.channel)


    def get_send_ta(self, message):
        """
        Client function to call the rpc for GetServerResponse
        """
        message = pb2.TAMessage(message=message)
        print(f'{message}')
        return self.stub.GetTAResponse(message)

'''
if __name__ == '__main__':
    with open('C:/Users/vasil/Desktop/MindSpaces/FusionGSRnIS/grpc_communication/vr2CerthComponents_1/ea_2021-07-02-13-22-54-0.json') as jsonFile:
        vr_setting = json.load(jsonFile)
        jsonFile.close()
    with open('C:/Users/vasil/Desktop/MindSpaces/FusionGSRnIS/grpc_communication/vr2CerthComponents_1/gsr_analysis.json') as jsonFile:
        gsr_analysis = json.load(jsonFile)
        jsonFile.close()
    message = pb2.GSRMessageStruct(vr_settings=vr_setting, gsr_analysis=gsr_analysis)
    client = GrpcClient()
    result = client.get_gsr(message=message)
    print(f'{result}')
'''

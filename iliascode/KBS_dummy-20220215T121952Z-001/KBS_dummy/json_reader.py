import glob
import os
import json
from datetime import datetime
from threading import Thread
from grpc_client import GrpcClient
import config
import echo.echo_pb2 as pb2
import time

class JsonReader(Thread):
    def __init__(self, path, file_type):
        Thread.__init__(self)
        self.client = GrpcClient()
        self.reading = True
        self.experiment_startime = datetime.timestamp(datetime.now())
        self.file = path +file_type
    def run(self):
        while self.reading:
            try:
                # Opening JSON file
                f = open(self.file)
                # returns JSON object as
                # a dictionary
                data = json.load(f)
                # Iterating through the json
                # list
                for meta in data['points']:
                    va_bdy = meta['Visual_Analysis_Body']
                    ta_bdy = meta['Textual_Analysis_Body']
                    del meta['Visual_Analysis_Body']
                    del meta['Textual_Analysis_Body']
                    meta['user_id'] = 'test@iti.gr'
                    meta['district'] = False
                    meta['path'] = False
                    meta['url'] = 'https://mindspaces-integration.nurogate.com/Server/ProjectFile/101/117852668455cfe988cd2eb6c82807a72bac11a3/File'

                    res = self.submit_message_to_kbs(meta, va_bdy, ta_bdy)
                    print(res)
                    time.sleep(config.TA_SLEEP)

            except IOError:
                return False


    def stop(self):
        self.reading = False

    def submit_message_to_kbs(self, meta, va_bdy, ta_bdy):
        # Get UTC time as string
        timestamp = datetime.utcnow().strftime("%Y/%m/%d %H:%M:%S.%f")
        message = pb2.TAMessageStruct()

        message.meta_body = json.dumps(meta)
        message.ta_body = json.dumps(ta_bdy)
        message.va_body = json.dumps(va_bdy)
        result = self.client.get_send_ta(message=message)
        return result



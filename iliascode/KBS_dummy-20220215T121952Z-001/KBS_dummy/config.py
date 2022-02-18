import os
import yaml
#path to the VR directory
#PATH = '/home/iliask/Documents/EU_Projects/MINDSPACES/Integration/emotional_analysis_results'
PATH = '../../PUC1/json/'
FILETYPE = '/Merged_VA_TA.json'
#The following sleep times are serving only for testing purposes, supposingly that they will be substituted by the actual services for GSR and Sentiment analysis
TA_SLEEP = 2

GRPC_PORT = 49500
#not in use
default_config_yaml = ""

def default_config():
    """Return default configuration"""
    return yaml.safe_load(default_config_yaml)

def load_config(filepath):
    #"""Load config from a config.yaml filepath"""
    config = default_config()

    if os.path.isfile(filepath):
        with open(filepath) as fin:
            new_config = yaml.safe_load(fin)
        if new_config:
            for k, v in new_config.items():
                config[k] = v

    return config

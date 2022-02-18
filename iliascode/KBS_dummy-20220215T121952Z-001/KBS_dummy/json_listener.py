import config
from json_reader import JsonReader


class JsonParser:
    def __init__(self):
        # Create consumer object
        self.reader = JsonReader(config.PATH, config.FILETYPE)
    def start(self):
        print("Initiated listener in folder", config.PATH)
        # Start listening
        self.reader.start()


if __name__ == "__main__":
    print('\033[95m' + "\n************")
    print("*** v1.0 ***")
    print("************\n" + '\033[0m')
    # Create listener
    reader = JsonParser()
    # Start logger
    reader.start()
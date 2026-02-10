import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

class DataProcessor:
    def process(self, data):
        logging.info("Base processor started")
        logging.info(f"Processing data: {data}")
        return data.upper()


class FileDataProcessor(DataProcessor):
    def process(self, data):
        logging.info("FileDataProcessor override started")

        # Call parent method
        result = super().process(data)

        logging.info("Saving processed data to file")
        return f"FILE::{result}"


class NetworkDataProcessor(DataProcessor):
    def process(self, data):
        logging.info("NetworkDataProcessor override started")

        result = super().process(data)


        logging.info("Sending processed data over network")
        print (result)
        return f"NET::{result}"
        


# Polymorphism in action
processors = [
    FileDataProcessor(),
    NetworkDataProcessor()
]

for processor in processors:
    output = processor.process("python")
    print ("data")
    logging.info(f"Final Output: {output}")
    print("-" * 50)


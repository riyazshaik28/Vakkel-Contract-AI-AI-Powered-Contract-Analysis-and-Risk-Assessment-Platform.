from pymongo import MongoClient
from APP.config import MONGODB_URI


print("Using URI:", repr(MONGODB_URI))
client = MongoClient(MONGODB_URI)
db = client["vakeel_contract_db"]


contracts_collection = db["contracts"]
analysis_collection = db["analysis"]

def init_db():

    # Create indexes for the collections if they don't exist
    contracts_collection.create_index("contract_id", unique=True)
    analysis_collection.create_index("analysis_id", unique=True)
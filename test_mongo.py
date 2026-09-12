from pymongo import MongoClient

client = MongoClient("mongodb://127.0.0.1:27017")

try:
    print(client.admin.command("ping"))
    print("MongoDB Connected Successfully")
except Exception as e:
    print("Connection Error:", e)
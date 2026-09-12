from http.client import HTTPException
from bson import ObjectId
from fastapi import APIRouter, Depends,UploadFile, File,HTTPException

import os
from APP.config import ALLOWED_EXTENSIONS,MAXFILESIZE
import uuid
from APP.config import UPLOAD_FOLDER
from APP.service.document_parser import extract_text
from APP.models import Contract
from APP.database import contracts_collection, analysis_collection
from APP.service.analyze_contract import analyze_contract
router=APIRouter(
    prefix="/contracts",
    tags=["contracts"],

)

@router.post("/upload")
async def upload_contract(
    file:UploadFile=File(...),

):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
       raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")
    content= await file.read()

    size_mb=len(content) / (1024 * 1024)
    if size_mb > MAXFILESIZE:
        raise HTTPException(status_code=400, detail="File size exceeds the maximum allowed size.")

    os.makedirs("uploads", exist_ok=True)
    unique_name=f"{uuid.uuid4().hex}{ext}"

    file_path=os.path.join(UPLOAD_FOLDER,unique_name)

    with open(file_path,"wb") as f:
        f.write(content)

    parsed=extract_text(file_path)
    contract_data = Contract(
    filename=unique_name,
    original_name=file.filename,
    text_content=parsed["text"] if isinstance(parsed, dict) else parsed,
    page_count=parsed["page_count"] if isinstance(parsed, dict) else len(parsed.splitlines()),
    word_count=int(parsed["word_count"]) if isinstance(parsed, dict) else len(parsed.split()),
)
    doc=contract_data.model_dump()
    doc["contract_id"] = str(uuid.uuid4())
    result=contracts_collection.insert_one(doc)
    contract_data.id=str(result.inserted_id)

    return {"message": "Contract uploaded successfully.",
             "contract": contract_data.model_dump(),
             "id":contract_data.id
             }


@router.get("/")
async def get_contracts():

    contracts = []

    for con in contracts_collection.find():
        con["_id"] = str(con["_id"])   # convert instead of delete
        contracts.append(con)

    return contracts

@router.get("/{contract_id}")
async def get_contract(contract_id: str):

    contract = contracts_collection.find_one(
        {"_id": ObjectId(contract_id)}
    )

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    contract_obj = Contract(**contract)
    contract_obj.id = str(contract["_id"])

    return {
        "contract": contract_obj.model_dump()
    }
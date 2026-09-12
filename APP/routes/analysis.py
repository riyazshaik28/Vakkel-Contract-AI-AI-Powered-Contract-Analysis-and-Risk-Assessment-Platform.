from fastapi import APIRouter,HTTPException
import httpx
import json
from APP.config import GEMINI_API_KEY
from bson import ObjectId
from APP.models import AnalysisResult
from APP.service.analyze_contract import analyze_contract
from APP.config import GEMINI_API_KEY
from APP.database import contracts_collection,analysis_collection
router=APIRouter(
    prefix="/analysis",
    tags=["analysis"],
)


print("Loaded Gemini Key:", GEMINI_API_KEY)

@router.post("/analysis/{contract_id}")
async def analyse_contract(contract_id:str):
  
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key is not configured.")


    contract=contracts_collection.find_one({"_id":ObjectId(contract_id)})
    if not contract:
        raise HTTPException(status_code=404,detail="contract not found")
    contracts_collection.update_one({"_id":ObjectId(contract_id)},{"$set":{"status":"in progress"}})

    result=await analyze_contract(contract_id,contract["text_content"])

    doc= result.model_dump()
    doc["contract_id"] = contract_id
    doc["analysis_id"] = str(ObjectId())

    insert_result=analysis_collection.insert_one(doc)

    result.id=str(insert_result.inserted_id)
    contracts_collection.update_one({
        "_id":ObjectId(contract_id)
    }, {"$set": {"status": "analyzed"}})

    return {
        "message": "Contract analysis completed successfully.",
        "analysis": result.model_dump(),
        "id": result.id
    }

@router.get("/analysis/{analysis_id}")
async def get_analysis(analysis_id:str):
    analysis=analysis_collection.find_one({"_id":ObjectId(analysis_id)})
    if not analysis:
        raise HTTPException(status_code=404,detail="Analysis not found")
    analysis["id"]=str(analysis["_id"])
    del analysis["_id"]
    return analysis

@router.get("/contract/{contract_id}")
async def get_analysis_by_contract_id(contract_id:str):
    analysis = analysis_collection.find_one({"contract_id": contract_id})
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found for this contract")
    analysis["id"] = str(analysis["_id"])
    del analysis["_id"]
    return analysis

@router.get("/analysis_by_id_or_contract")
async def get_analysis_root(analysis_id: str | None = None, contract_id: str | None = None):
    if analysis_id:
        analysis = analysis_collection.find_one({"_id": ObjectId(analysis_id)})
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        analysis["id"] = str(analysis["_id"])
        del analysis["_id"]
        return analysis

    if contract_id:
        analysis = analysis_collection.find_one({"contract_id": contract_id})
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found for this contract")
        analysis["id"] = str(analysis["_id"])
        del analysis["_id"]
        return analysis

    analyses = list(analysis_collection.find())
    result = []
    for analysis in analyses:
        analysis["id"] = str(analysis["_id"])
        del analysis["_id"]
        result.append(analysis)
    return {
        "message": "Analysis routes available.",
        "count": len(result),
        "results": result,
    }

@router.get("/allanalysis")
async def get_all_analysis():
    analyses=analysis_collection.find()
    result=[]
    for analysis in analyses:
        analysis["id"]=str(analysis["_id"])
        del analysis["_id"]
        result.append(analysis)
    return result
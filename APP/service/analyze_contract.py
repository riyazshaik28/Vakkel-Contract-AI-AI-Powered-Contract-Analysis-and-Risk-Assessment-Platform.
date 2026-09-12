import json

from fastapi import HTTPException
from google import genai

from APP.config import GEMINI_API_KEY
from .promot import CONTRACT_ANALYSIS_prompt

from APP.models import (
    ClauseAnalysis,
    RiskFlag,
    AnalysisResult
)

client = genai.Client(
    api_key=GEMINI_API_KEY
)


async def analyze_contract(
    contract_id: str,
    contract_text: str
):

    prompt = CONTRACT_ANALYSIS_prompt.format(
        contract_text=contract_text
    )

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        raw_text = response.text.strip()

        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]

        if raw_text.startswith("```"):
            raw_text = raw_text[3:]

        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]

        raw_text = raw_text.strip()

        print("=" * 50)
        print(raw_text)
        print("=" * 50)

        analysis_data = json.loads(raw_text)

    except json.JSONDecodeError as e:
        print("JSON ERROR:", e)
        print("RAW RESPONSE:")
        #print(raw_text)

        raise HTTPException(
            status_code=500,
            detail="Gemini returned invalid JSON"
        )

    except Exception as e:
        print("Gemini Error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Gemini Error: {str(e)}"
        )

    key_clauses = [
        ClauseAnalysis(**clause)
        for clause in analysis_data.get(
            "key_clauses",
            []
        )
    ]

    risk_flags = [
        RiskFlag(**risk)
        for risk in analysis_data.get(
            "risk_flags",
            []
        )
    ]

    result = AnalysisResult(
        contract_id=contract_id,
        analysis_data=analysis_data,
        summary=analysis_data.get(
            "executive_summary",
            ""
        ),
        contract_type=analysis_data.get(
            "contract_type",
            ""
        ),
        key_clauses=key_clauses,
        risk_flags=risk_flags,
        overall_risk_level=analysis_data.get(
            "overall_risk_level",
            "low"
        ).lower(),
        recommendations=analysis_data.get(
            "recommendations",
            []
        )
    )

    return result
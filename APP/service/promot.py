CONTRACT_ANALYSIS_prompt = """
Analyze this contract and return ONLY valid JSON.

Contract:

{contract_text}

Return:

{{
    "executive_summary": "",
    "contract_type": "",

    "key_clauses": [
        {{
            "clause_title": "",
            "clause_text": "",
            "explanation": "",
            "is_standard": true
        }}
    ],

    "risk_flags": [
        {{
            "risk_title": "",
            "description": "",
            "risk_level": "low",
            "recommendation": "",
            "clause_reference": ""
        }}
    ],

    "overall_risk_level": "low",

    "recommendations": []
}}


IMPORTANT:
- Return ONLY valid JSON.
- Do not use markdown.
- Keep explanations under 50 words.
- Ensure JSON is complete and closed.

"""
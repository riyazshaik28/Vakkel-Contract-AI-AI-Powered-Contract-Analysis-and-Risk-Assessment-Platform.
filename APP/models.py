from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class Contract(BaseModel):
    id: Optional[str] = Field(default=None)
    filename: str
    original_name: str
    upload_date: str = ""
    text_content: str = ""
    page_count: int = 0
    word_count: int = 0
    status: str = "uploaded"

    def model_post_init(self, _context):
        if not self.upload_date:
            self.upload_date = datetime.now().isoformat()


class ClauseAnalysis(BaseModel):
    clause_title: str
    clause_text: str
    explanation: str
    is_standard: bool


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class RiskFlag(BaseModel):
    risk_title: str
    description: str
    risk_level: RiskLevel
    recommendation: str
    clause_reference: str = ""


class AnalysisResult(BaseModel):
    id: Optional[str] = None
    contract_id: str
    analysis_data: dict = Field(default_factory=dict)
    summary: str = ""
    contract_type: str = ""
    key_clauses: List[ClauseAnalysis] = Field(default_factory=list)
    risk_flags: List[RiskFlag] = Field(default_factory=list)

    overall_risk_level: RiskLevel = RiskLevel.LOW

    recommendations: List[str] = Field(default_factory=list)
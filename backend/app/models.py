from pydantic import BaseModel, Field
from typing import List, Optional


class TokenSHAPRequest(BaseModel):
    prompt: str = Field(..., description="Input text prompt to analyze")
    model: str = Field(..., description="Model identifier from OpenRouter")
    sampling_ratio: Optional[float] = Field(0.5, ge=0.0, le=1.0, description="Sampling ratio for Monte Carlo")
    num_samples: Optional[int] = Field(100, ge=10, le=500, description="Number of Monte Carlo samples")
    api_key: Optional[str] = Field(None, description="Optional OpenRouter API key override")


class TokenResult(BaseModel):
    token: str
    shapley_value: float
    index: int


class TokenSHAPResponse(BaseModel):
    tokens: List[TokenResult]
    full_response: str
    prompt: str
    model: str


class ModelInfo(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    pricing: Optional[dict] = None

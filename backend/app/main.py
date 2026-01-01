from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.models import TokenSHAPRequest, TokenSHAPResponse, TokenResult
from app.llm_client import OpenRouterClient
from app.tokenshap import TokenSHAP

app = FastAPI(
    title="TokenSHAP API",
    description="API for interpreting LLM outputs with Shapley values",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "TokenSHAP API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/models")
async def get_models(api_key: str = None):
    """Get available models from OpenRouter"""
    try:
        client = OpenRouterClient(api_key=api_key)
        models = await client.get_available_models()
        return {"models": models}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching models: {str(e)}")


@app.post("/analyze", response_model=TokenSHAPResponse)
async def analyze_prompt(request: TokenSHAPRequest):
    """
    Analyze a prompt using TokenSHAP to compute Shapley values for each token
    """
    try:
        # Validate prompt
        if not request.prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt cannot be empty")

        # Initialize LLM client
        api_key = request.api_key if request.api_key else settings.OPENROUTER_API_KEY
        if not api_key:
            raise HTTPException(status_code=400, detail="OpenRouter API key not provided")

        llm_client = OpenRouterClient(api_key=api_key)

        # Initialize TokenSHAP
        token_shap = TokenSHAP(
            llm_client=llm_client,
            sampling_ratio=request.sampling_ratio,
            num_samples=request.num_samples
        )

        # Compute Shapley values
        results, full_response = await token_shap.compute_shapley_values(
            prompt=request.prompt,
            model=request.model
        )

        # Format response
        tokens = [TokenResult(**result) for result in results]

        return TokenSHAPResponse(
            tokens=tokens,
            full_response=full_response,
            prompt=request.prompt,
            model=request.model
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing prompt: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

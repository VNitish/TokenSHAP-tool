import httpx
from typing import Optional
from app.config import settings


class OpenRouterClient:
    """Client for OpenRouter API"""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.OPENROUTER_API_KEY
        self.base_url = settings.OPENROUTER_BASE_URL

    async def generate(self, prompt: str, model: str, max_tokens: int = 150) -> str:
        """
        Generate text using OpenRouter API

        Args:
            prompt: Input text prompt
            model: Model identifier (e.g., "openai/gpt-3.5-turbo")
            max_tokens: Maximum tokens in response

        Returns:
            Generated text response
        """
        if not prompt.strip():
            return ""

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "TokenSHAP Tool"
        }

        payload = {
            "model": model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": max_tokens,
            "temperature": 0.7
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
            except Exception as e:
                print(f"Error calling OpenRouter API: {e}")
                return ""

    async def get_available_models(self) -> list:
        """Fetch available models from OpenRouter"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(
                    "https://openrouter.ai/api/v1/models",
                    headers=headers
                )
                response.raise_for_status()
                data = response.json()
                return data.get("data", [])
            except Exception as e:
                print(f"Error fetching models: {e}")
                return []

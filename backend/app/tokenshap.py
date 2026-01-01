import itertools
import random
from typing import List, Dict, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class TokenSHAP:
    """
    TokenSHAP: Interpreting Large Language Models with Monte Carlo Shapley Value Estimation
    Based on the paper: https://arxiv.org/abs/2407.10114
    """

    def __init__(self, llm_client, sampling_ratio: float = 0.5, num_samples: int = 100):
        """
        Initialize TokenSHAP

        Args:
            llm_client: LLM client for generating responses
            sampling_ratio: Ratio of token subsets to sample (0-1)
            num_samples: Number of Monte Carlo samples
        """
        self.llm_client = llm_client
        self.sampling_ratio = sampling_ratio
        self.num_samples = num_samples
        self.vectorizer = TfidfVectorizer()

    def tokenize(self, text: str) -> List[str]:
        """Simple word-level tokenization"""
        return text.split()

    def create_subset_prompt(self, tokens: List[str], subset_indices: List[int]) -> str:
        """Create a prompt from a subset of tokens"""
        subset_tokens = [tokens[i] for i in sorted(subset_indices)]
        return " ".join(subset_tokens)

    def calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate cosine similarity between two texts using TF-IDF"""
        if not text1.strip() or not text2.strip():
            return 0.0

        try:
            tfidf_matrix = self.vectorizer.fit_transform([text1, text2])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return float(similarity)
        except:
            return 0.0

    async def compute_shapley_values(
        self,
        prompt: str,
        model: str,
        progress_callback=None
    ) -> Tuple[List[Dict], str]:
        """
        Compute Shapley values for each token in the prompt

        Args:
            prompt: Input text prompt
            model: Model identifier for OpenRouter
            progress_callback: Optional callback for progress updates

        Returns:
            List of dicts with token and its Shapley value, and full response
        """
        tokens = self.tokenize(prompt)
        n_tokens = len(tokens)

        if n_tokens == 0:
            return [], ""

        # Get response for full prompt
        full_response = await self.llm_client.generate(prompt, model)

        # Initialize Shapley values
        shapley_values = np.zeros(n_tokens)

        # Monte Carlo sampling
        num_samples = min(self.num_samples, 2 ** n_tokens - 1)

        for sample_idx in range(num_samples):
            # Randomly sample subset size
            subset_size = random.randint(0, n_tokens)

            # Randomly sample indices
            subset_indices = random.sample(range(n_tokens), subset_size)

            # For each token, compute marginal contribution
            for token_idx in range(n_tokens):
                # Subset without token
                subset_without = [i for i in subset_indices if i != token_idx]
                prompt_without = self.create_subset_prompt(tokens, subset_without)

                # Subset with token
                subset_with = sorted(subset_without + [token_idx])
                prompt_with = self.create_subset_prompt(tokens, subset_with)

                # Get responses
                response_without = await self.llm_client.generate(prompt_without, model) if prompt_without else ""
                response_with = await self.llm_client.generate(prompt_with, model) if prompt_with else ""

                # Calculate marginal contribution using cosine similarity
                similarity_without = self.calculate_similarity(full_response, response_without)
                similarity_with = self.calculate_similarity(full_response, response_with)

                marginal_contribution = similarity_with - similarity_without
                shapley_values[token_idx] += marginal_contribution

            # Progress update
            if progress_callback:
                progress = (sample_idx + 1) / num_samples * 100
                await progress_callback(progress)

        # Average Shapley values
        shapley_values = shapley_values / num_samples

        # Normalize to [0, 1]
        if shapley_values.max() > shapley_values.min():
            shapley_values = (shapley_values - shapley_values.min()) / (shapley_values.max() - shapley_values.min())

        # Create result
        result = [
            {
                "token": token,
                "shapley_value": float(value),
                "index": idx
            }
            for idx, (token, value) in enumerate(zip(tokens, shapley_values))
        ]

        return result, full_response

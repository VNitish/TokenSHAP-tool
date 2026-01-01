# TokenSHAP Tool

A web-based tool for interpreting Large Language Model outputs using Shapley values from cooperative game theory. Based on the paper [TokenSHAP: Interpreting Large Language Models with Monte Carlo Shapley Value Estimation](https://arxiv.org/abs/2407.10114).

## Overview

TokenSHAP helps you understand which tokens in your prompt are most important to an LLM's response by calculating Shapley values using Monte Carlo sampling. This provides:

- **Quantitative token importance** - See exact Shapley values for each token
- **Visual interpretation** - Color-coded visualization showing token importance
- **Model flexibility** - Use any model available on OpenRouter
- **Interactive analysis** - Adjust sampling parameters to balance speed vs accuracy

## Features

- 🎯 **Token-level interpretation** - Understand individual token contributions
- 📊 **Visual analytics** - Color-coded heatmap and bar charts
- 🔧 **Configurable parameters** - Adjust sampling ratio and number of samples
- 🌐 **Multiple LLM support** - Choose from any OpenRouter-compatible model
- 📥 **Export results** - Download analysis as JSON

## Architecture

- **Backend**: Python + FastAPI
- **Frontend**: React + Vite
- **LLM API**: OpenRouter (supports 100+ models)

## Installation

### Prerequisites

- Python 3.8+
- Node.js 18+
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file (optional, you can also provide the key in the UI):
```bash
cp .env.example .env
# Edit .env and add your OpenRouter API key
```

5. Start the backend server:
```bash
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Enter your OpenRouter API key** in the configuration panel
2. **Select a model** from the dropdown (models will load after entering your API key)
3. **Enter your prompt** in the text area
4. **Adjust parameters** (optional):
   - **Sampling Ratio**: Controls subset sampling (default: 0.5)
   - **Number of Samples**: More samples = more accurate but slower (default: 100)
5. **Click "Analyze Prompt"** and wait for results
6. **View the results**:
   - Color-coded token visualization
   - Model's full response
   - Sorted Shapley values with bar charts
   - Analysis summary

## How It Works

TokenSHAP uses Monte Carlo sampling to estimate Shapley values:

1. **Tokenization**: The prompt is split into individual tokens (words)
2. **Subset Sampling**: Random subsets of tokens are sampled
3. **LLM Queries**: For each subset, the model generates a response
4. **Similarity Calculation**: Cosine similarity (TF-IDF) between subset responses and full response
5. **Marginal Contribution**: Each token's contribution is calculated
6. **Shapley Values**: Values are averaged and normalized to [0, 1]

Higher Shapley values indicate more important tokens.

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Key Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `GET /models` - List available models
- `POST /analyze` - Analyze a prompt

### Example API Request

```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What is the capital of France?",
    "model": "openai/gpt-3.5-turbo",
    "sampling_ratio": 0.5,
    "num_samples": 100,
    "api_key": "your_openrouter_key"
  }'
```

## Configuration

### Sampling Parameters

- **Sampling Ratio** (0.1 - 1.0): Controls the proportion of token subsets to sample
- **Number of Samples** (10 - 500): Number of Monte Carlo iterations
  - Lower values: Faster but less accurate
  - Higher values: Slower but more accurate

### Model Selection

Choose from any OpenRouter-compatible model. Popular options:
- `openai/gpt-4`
- `openai/gpt-3.5-turbo`
- `anthropic/claude-3-sonnet`
- `meta-llama/llama-3-70b`
- And 100+ more!

## Project Structure

```
TokenSHAP-tool/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI app
│   │   ├── config.py        # Configuration
│   │   ├── models.py        # Pydantic models
│   │   ├── tokenshap.py     # Core algorithm
│   │   └── llm_client.py    # OpenRouter client
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfigPanel.jsx
│   │   │   ├── PromptInput.jsx
│   │   │   ├── TokenVisualization.jsx
│   │   │   └── ResultsPanel.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Development

### Backend Development

Run with auto-reload:
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### Frontend Development

Run development server:
```bash
cd frontend
npm run dev
```

Build for production:
```bash
npm run build
```

## Troubleshooting

### CORS Issues
- Ensure backend is running on port 8000
- Check CORS_ORIGINS in `backend/app/config.py`

### API Key Issues
- Verify your OpenRouter API key is valid
- Check you have sufficient credits on OpenRouter

### Slow Analysis
- Reduce the number of samples
- Use a faster model
- Lower the sampling ratio

## Citations

If you use this tool, please cite the original paper:

```bibtex
@article{goldshmidt2024tokenshap,
  title={TokenSHAP: Interpreting Large Language Models with Monte Carlo Shapley Value Estimation},
  author={Goldshmidt, Roni and Horovicz, Miriam},
  journal={arXiv preprint arXiv:2407.10114},
  year={2024}
}
```

## License

MIT License - feel free to use and modify for your needs.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

For issues or questions:
- Open an issue on GitHub
- Check the [OpenRouter documentation](https://openrouter.ai/docs)
- Review the [original paper](https://arxiv.org/abs/2407.10114)

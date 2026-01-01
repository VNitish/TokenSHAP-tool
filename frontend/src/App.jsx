import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import TokenVisualization from './components/TokenVisualization'
import PromptInput from './components/PromptInput'
import ConfigPanel from './components/ConfigPanel'
import ResultsPanel from './components/ResultsPanel'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [prompt, setPrompt] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [models, setModels] = useState([])
  const [samplingRatio, setSamplingRatio] = useState(0.5)
  const [numSamples, setNumSamples] = useState(100)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  // Fetch available models
  const fetchModels = async () => {
    if (!apiKey) return

    try {
      const response = await axios.get(`${API_BASE_URL}/models`, {
        params: { api_key: apiKey }
      })
      setModels(response.data.models)
      if (response.data.models.length > 0) {
        setSelectedModel(response.data.models[0].id)
      }
    } catch (err) {
      console.error('Error fetching models:', err)
      setError('Failed to fetch models. Check your API key.')
    }
  }

  useEffect(() => {
    if (apiKey) {
      fetchModels()
    }
  }, [apiKey])

  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    if (!apiKey) {
      setError('Please enter your OpenRouter API key')
      return
    }

    if (!selectedModel) {
      setError('Please select a model')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        prompt,
        model: selectedModel,
        sampling_ratio: samplingRatio,
        num_samples: numSamples,
        api_key: apiKey
      })

      setResults(response.data)
    } catch (err) {
      console.error('Error analyzing prompt:', err)
      setError(err.response?.data?.detail || 'Failed to analyze prompt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>TokenSHAP</h1>
        <p className="subtitle">Interpret LLM Outputs with Shapley Values</p>
      </header>

      <div className="container">
        <div className="main-content">
          <ConfigPanel
            apiKey={apiKey}
            setApiKey={setApiKey}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            models={models}
            samplingRatio={samplingRatio}
            setSamplingRatio={setSamplingRatio}
            numSamples={numSamples}
            setNumSamples={setNumSamples}
          />

          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onAnalyze={handleAnalyze}
            loading={loading}
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Analyzing tokens... This may take a minute.</p>
            </div>
          )}

          {results && !loading && (
            <>
              <TokenVisualization tokens={results.tokens} />
              <ResultsPanel results={results} />
            </>
          )}
        </div>
      </div>

      <footer className="footer">
        <p>
          Based on the paper:{' '}
          <a
            href="https://arxiv.org/abs/2407.10114"
            target="_blank"
            rel="noopener noreferrer"
          >
            TokenSHAP: Interpreting Large Language Models with Monte Carlo Shapley Value Estimation
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App

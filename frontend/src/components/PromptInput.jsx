import './PromptInput.css'

function PromptInput({ prompt, setPrompt, onAnalyze, loading }) {
  return (
    <div className="prompt-input-section">
      <h2>Enter Your Prompt</h2>
      <textarea
        className="prompt-textarea"
        placeholder="Enter the text prompt you want to analyze..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
      />
      <button
        className="analyze-button"
        onClick={onAnalyze}
        disabled={loading || !prompt.trim()}
      >
        {loading ? 'Analyzing...' : 'Analyze Prompt'}
      </button>
    </div>
  )
}

export default PromptInput

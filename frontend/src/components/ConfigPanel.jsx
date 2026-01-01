import './ConfigPanel.css'

function ConfigPanel({
  apiKey,
  setApiKey,
  selectedModel,
  setSelectedModel,
  models,
  samplingRatio,
  setSamplingRatio,
  numSamples,
  setNumSamples
}) {
  return (
    <div className="config-panel">
      <h2>Configuration</h2>

      <div className="form-group">
        <label htmlFor="apiKey">OpenRouter API Key</label>
        <input
          id="apiKey"
          type="password"
          placeholder="Enter your OpenRouter API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="input"
        />
        <small>
          Get your API key from{' '}
          <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">
            OpenRouter
          </a>
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="model">Model</label>
        <select
          id="model"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="select"
          disabled={models.length === 0}
        >
          {models.length === 0 ? (
            <option>Enter API key to load models</option>
          ) : (
            models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name || model.id}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="samplingRatio">
            Sampling Ratio: {samplingRatio.toFixed(2)}
          </label>
          <input
            id="samplingRatio"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={samplingRatio}
            onChange={(e) => setSamplingRatio(parseFloat(e.target.value))}
            className="slider"
          />
        </div>

        <div className="form-group">
          <label htmlFor="numSamples">Samples: {numSamples}</label>
          <input
            id="numSamples"
            type="range"
            min="10"
            max="500"
            step="10"
            value={numSamples}
            onChange={(e) => setNumSamples(parseInt(e.target.value))}
            className="slider"
          />
          <small>More samples = more accurate but slower</small>
        </div>
      </div>
    </div>
  )
}

export default ConfigPanel

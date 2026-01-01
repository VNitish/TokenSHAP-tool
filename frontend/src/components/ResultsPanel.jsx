import './ResultsPanel.css'

function ResultsPanel({ results }) {
  const downloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = 'tokenshap_results.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const copyResults = () => {
    const text = results.tokens
      .map(t => `${t.token}: ${t.shapley_value.toFixed(4)}`)
      .join('\n')
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="results-panel">
      <div className="results-header">
        <h2>Results</h2>
        <div className="results-actions">
          <button onClick={copyResults} className="action-button">
            Copy Values
          </button>
          <button onClick={downloadResults} className="action-button">
            Download JSON
          </button>
        </div>
      </div>

      <div className="results-section">
        <h3>Model Response</h3>
        <div className="response-box">
          {results.full_response}
        </div>
      </div>

      <div className="results-section">
        <h3>Token Shapley Values</h3>
        <div className="values-table">
          <div className="table-header">
            <span>Token</span>
            <span>Shapley Value</span>
          </div>
          {results.tokens
            .sort((a, b) => b.shapley_value - a.shapley_value)
            .map((token, idx) => (
              <div key={idx} className="table-row">
                <span className="token-cell">{token.token}</span>
                <span className="value-cell">
                  <div className="value-bar-container">
                    <div
                      className="value-bar"
                      style={{ width: `${token.shapley_value * 100}%` }}
                    />
                    <span className="value-text">
                      {token.shapley_value.toFixed(4)}
                    </span>
                  </div>
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="results-section">
        <h3>Analysis Summary</h3>
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-label">Total Tokens:</span>
            <span className="stat-value">{results.tokens.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Most Important Token:</span>
            <span className="stat-value">
              "{[...results.tokens].sort((a, b) => b.shapley_value - a.shapley_value)[0].token}"
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Model Used:</span>
            <span className="stat-value">{results.model}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsPanel

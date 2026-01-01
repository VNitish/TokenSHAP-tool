import './TokenVisualization.css'

function TokenVisualization({ tokens }) {
  // Function to get color based on Shapley value
  const getColor = (value) => {
    // Color gradient from light blue (low) to dark red (high)
    const hue = 240 - (value * 240) // 240 (blue) to 0 (red)
    const saturation = 70 + (value * 30) // 70% to 100%
    const lightness = 85 - (value * 50) // 85% to 35%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  return (
    <div className="token-visualization">
      <h2>Token Importance Visualization</h2>
      <p className="viz-description">
        Each token is colored based on its Shapley value.
        <span className="color-low">Blue</span> indicates low importance,
        <span className="color-high">red</span> indicates high importance.
      </p>

      <div className="token-container">
        {tokens.map((token, idx) => (
          <span
            key={idx}
            className="token"
            style={{ backgroundColor: getColor(token.shapley_value) }}
            title={`Token: "${token.token}"\nShapley Value: ${token.shapley_value.toFixed(4)}`}
          >
            {token.token}
          </span>
        ))}
      </div>

      <div className="legend">
        <span className="legend-label">Low Importance</span>
        <div className="legend-gradient"></div>
        <span className="legend-label">High Importance</span>
      </div>
    </div>
  )
}

export default TokenVisualization

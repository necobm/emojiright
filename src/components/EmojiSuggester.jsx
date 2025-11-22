import { useState } from 'react'
import './EmojiSuggester.css'
import { getEmojiSuggestions } from '../services/aiService'
import Toast from './Toast'

function EmojiSuggester() {
  const [phrase, setPhrase] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!phrase.trim()) {
      setError('Please enter a phrase')
      return
    }

    setLoading(true)
    setError(null)
    setSuggestions([])

    try {
      const emojis = await getEmojiSuggestions(phrase)
      setSuggestions(emojis)
    } catch (err) {
      setError(err.message || 'Failed to get emoji suggestions')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyEmoji = (emoji) => {
    navigator.clipboard.writeText(emoji)
    setToast({
      message: `${emoji} copied to clipboard!`,
      type: 'success'
    })
  }

  return (
    <div className="emoji-suggester">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-group">
          <input
            type="text"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="Enter your phrase (e.g., 'Some ideas to work on')"
            className="phrase-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading || !phrase.trim()}
          >
            {loading ? '🔄 Getting suggestions...' : '🎯 Get Emojis'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="suggestions-container">
          <h2 className="suggestions-title">Suggested Emojis</h2>
          <div className="suggestions-grid">
            {suggestions.map((item, index) => (
              <div 
                key={index} 
                className="suggestion-card"
                onClick={() => handleCopyEmoji(item.emoji)}
                title="Click to copy"
              >
                <div className="emoji-display">{item.emoji}</div>
                <div className="emoji-reason">{item.reason}</div>
              </div>
            ))}
          </div>
          <p className="copy-hint">💡 Click on any emoji to copy it</p>
        </div>
      )}

      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default EmojiSuggester

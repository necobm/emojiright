/**
 * AI Service for Emoji Suggestions
 * 
 * This service calls a Cloudflare Worker backend that securely handles
 * API requests to OpenAI and Gemini, keeping API keys server-side.
 */

const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'gemini'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

/**
 * Main function to get emoji suggestions via Cloudflare Worker
 * @param {string} phrase - The user's input phrase
 * @returns {Promise<Array>} Array of emoji suggestions
 */
export async function getEmojiSuggestions(phrase) {
  if (!phrase || typeof phrase !== 'string') {
    throw new Error('Invalid phrase provided')
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phrase,
        provider: AI_PROVIDER
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `API error: ${response.status}`)
    }

    const data = await response.json()
    return data.suggestions
  } catch (error) {
    console.error('Error getting emoji suggestions:', error)
    
    // Provide user-friendly error messages
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to the API. Please check your internet connection.')
    }
    
    throw error
  }
}

/**
 * Validate API configuration
 * @returns {Object} Configuration status
 */
export function validateConfig() {
  return {
    provider: AI_PROVIDER,
    apiUrl: API_URL,
    configured: !!API_URL
  }
}

/**
 * Validate API configuration
 * @returns {Object} Configuration status
 */
export function validateConfig() {
  return {
    provider: AI_PROVIDER,
    apiUrl: API_URL,
    configured: !!API_URL
  }
}

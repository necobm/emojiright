/**
 * AI Service for Emoji Suggestions
 * 
 * This service provides an abstraction layer for AI providers (OpenAI, Gemini, etc.)
 * to generate emoji suggestions based on user phrases.
 * 
 * Current Status: STUB IMPLEMENTATION
 * TODO: Implement actual API integrations for OpenAI and Gemini
 */

const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'openai'
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

/**
 * Generate emoji suggestions using OpenAI API
 * @param {string} phrase - The user's input phrase
 * @returns {Promise<Array>} Array of emoji suggestions with reasons
 */
async function getOpenAISuggestions(phrase) {
  // TODO: Implement OpenAI API integration
  // API Endpoint: https://api.openai.com/v1/chat/completions
  // Model: gpt-3.5-turbo or gpt-4
  // 
  // Prompt template:
  // "Given the phrase: '{phrase}', suggest 5 relevant emojis with brief explanations.
  //  Return ONLY a JSON array with format: [{emoji: '💡', reason: 'Represents ideas and creativity'}]"
  
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in .env file.')
  }

  // Stub implementation - replace with actual API call
  console.warn('Using stub implementation. Implement OpenAI integration.')
  
  // Example API call structure (commented out):
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: 'You are an emoji suggestion assistant. Respond with JSON only.'
      }, {
        role: 'user',
        content: `Given the phrase: "${phrase}", suggest the most 3 relevant emojis. Return ONLY a JSON array with format: [{"emoji": "💡", "reason": "Represents ideas"}]`
      }],
      temperature: 0.7
    })
  })
  
  const data = await response.json()
  return JSON.parse(data.choices[0].message.content)
  */

  return getMockSuggestions(phrase)
}

/**
 * Generate emoji suggestions using Google Gemini API
 * @param {string} phrase - The user's input phrase
 * @returns {Promise<Array>} Array of emoji suggestions with reasons
 */
async function getGeminiSuggestions(phrase) {
  // TODO: Implement Gemini API integration
  // API Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
  // 
  // Prompt template:
  // "Given the phrase: '{phrase}', suggest the most 3 relevant emojis with brief explanations.
  //  Return ONLY a JSON array with format: [{emoji: '💡', reason: 'Represents ideas and creativity'}]"

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in .env file.')
  }

  // Stub implementation - replace with actual API call
  console.warn('Using stub implementation. Implement Gemini integration.')
  
  // Example API call structure (commented out):
  /*
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Given the phrase: "${phrase}", suggest 5 relevant emojis. Return ONLY a JSON array with format: [{"emoji": "💡", "reason": "Represents ideas"}]`
          }]
        }]
      })
    }
  )
  
  const data = await response.json()
  const textResponse = data.candidates[0].content.parts[0].text
  return JSON.parse(textResponse)
  */

  return getMockSuggestions(phrase)
}

/**
 * Mock suggestions for development/testing
 * @param {string} phrase - The user's input phrase
 * @returns {Array} Array of mock emoji suggestions
 */
function getMockSuggestions(phrase) {
  // Simple keyword-based mock suggestions
  const lowerPhrase = phrase.toLowerCase()
  
  const keywordMap = {
    'idea': [
      { emoji: '💡', reason: 'Represents ideas and inspiration' },
      { emoji: '🧠', reason: 'Symbolizes thinking and creativity' },
      { emoji: '✨', reason: 'Sparkles for brilliant ideas' },
      { emoji: '🎯', reason: 'Targeting the right solution' },
      { emoji: '🚀', reason: 'Launching new concepts' }
    ],
    'work': [
      { emoji: '💼', reason: 'Professional work context' },
      { emoji: '⚙️', reason: 'Working mechanism' },
      { emoji: '🔧', reason: 'Tools for the job' },
      { emoji: '📊', reason: 'Work analytics' },
      { emoji: '✅', reason: 'Completing tasks' }
    ],
    'happy': [
      { emoji: '😊', reason: 'Happy and content' },
      { emoji: '🎉', reason: 'Celebration' },
      { emoji: '😄', reason: 'Joyful expression' },
      { emoji: '🌟', reason: 'Bright and positive' },
      { emoji: '💖', reason: 'Love and happiness' }
    ],
    'sad': [
      { emoji: '😢', reason: 'Expressing sadness' },
      { emoji: '💔', reason: 'Heartbreak' },
      { emoji: '😔', reason: 'Disappointed' },
      { emoji: '🌧️', reason: 'Gloomy mood' },
      { emoji: '😞', reason: 'Down feeling' }
    ],
    'success': [
      { emoji: '🏆', reason: 'Achievement trophy' },
      { emoji: '🎯', reason: 'Hit the target' },
      { emoji: '✨', reason: 'Shining success' },
      { emoji: '🌟', reason: 'Star performer' },
      { emoji: '👑', reason: 'Champion' }
    ]
  }

  // Find matching keywords
  for (const [keyword, suggestions] of Object.entries(keywordMap)) {
    if (lowerPhrase.includes(keyword)) {
      return suggestions
    }
  }

  // Default suggestions
  return [
    { emoji: '💭', reason: 'General thought bubble' },
    { emoji: '📝', reason: 'Note or message' },
    { emoji: '🎯', reason: 'Focus and direction' },
    { emoji: '✨', reason: 'Special or important' },
    { emoji: '🔍', reason: 'Looking for the right fit' }
  ]
}

/**
 * Main function to get emoji suggestions
 * Routes to the appropriate AI provider based on configuration
 * @param {string} phrase - The user's input phrase
 * @returns {Promise<Array>} Array of emoji suggestions
 */
export async function getEmojiSuggestions(phrase) {
  if (!phrase || typeof phrase !== 'string') {
    throw new Error('Invalid phrase provided')
  }

  try {
    switch (AI_PROVIDER) {
      case 'openai':
        return await getOpenAISuggestions(phrase)
      case 'gemini':
        return await getGeminiSuggestions(phrase)
      default:
        throw new Error(`Unknown AI provider: ${AI_PROVIDER}`)
    }
  } catch (error) {
    console.error('Error getting emoji suggestions:', error)
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
    openaiConfigured: OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key_here',
    geminiConfigured: GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here'
  }
}

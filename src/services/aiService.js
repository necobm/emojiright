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
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in .env file.')
  }

  try {
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
          content: 'You are an emoji suggestion assistant. Respond ONLY with a valid JSON array, no markdown, no explanations.'
        }, {
          role: 'user',
          content: `Given the phrase: "${phrase}", suggest 5 relevant emojis. Return ONLY a JSON array with this exact format: [{"emoji": "💡", "reason": "Represents ideas"}]`
        }],
        temperature: 0.7,
        max_tokens: 300
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || `OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content.trim()
    
    // Try to parse JSON, handling potential markdown wrapping
    let suggestions
    try {
      // Remove markdown code blocks if present
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim()
      suggestions = JSON.parse(cleanedContent)
    } catch {
      console.error('Failed to parse OpenAI response:', content)
      throw new Error('Invalid response format from OpenAI. Please try again.')
    }

    // Validate response format
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      throw new Error('OpenAI returned an invalid response format')
    }

    // Validate each suggestion has required fields
    const validSuggestions = suggestions.filter(item => item.emoji && item.reason)
    if (validSuggestions.length === 0) {
      throw new Error('No valid emoji suggestions in response')
    }

    return validSuggestions
  } catch (error) {
    if (error.message.includes('API key')) {
      throw error
    }
    console.error('OpenAI API error:', error)
    throw new Error(`Failed to get suggestions from OpenAI: ${error.message}`)
  }
}

/**
 * Generate emoji suggestions using Google Gemini API
 * @param {string} phrase - The user's input phrase
 * @returns {Promise<Array>} Array of emoji suggestions with reasons
 */
async function getGeminiSuggestions(phrase) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in .env file.')
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Given the phrase: "${phrase}", suggest the most 4 relevant emojis. Return ONLY a JSON array with this exact format: [{"emoji": "💡", "reason": "Represents ideas"}]. No markdown, no explanations, just the JSON array.`
            }]
          }]
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || `Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Check for API errors
    if (!data.candidates || data.candidates.length === 0) {
      console.error('Gemini response:', data)
      throw new Error('No response from Gemini. The content may have been blocked by safety filters.')
    }

    const textResponse = data.candidates[0].content.parts[0].text.trim()
    
    // Try to parse JSON, handling potential markdown wrapping
    let suggestions
    try {
      // Remove markdown code blocks if present
      const cleanedContent = textResponse.replace(/```json\n?|\n?```/g, '').trim()
      suggestions = JSON.parse(cleanedContent)
    } catch {
      console.error('Failed to parse Gemini response:', textResponse)
      throw new Error('Invalid response format from Gemini. Please try again.')
    }

    // Validate response format
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      throw new Error('Gemini returned an invalid response format')
    }

    // Validate each suggestion has required fields
    const validSuggestions = suggestions.filter(item => item.emoji && item.reason)
    if (validSuggestions.length === 0) {
      throw new Error('No valid emoji suggestions in response')
    }

    return validSuggestions
  } catch (error) {
    if (error.message.includes('API key')) {
      throw error
    }
    console.error('Gemini API error:', error)
    throw new Error(`Failed to get suggestions from Gemini: ${error.message}`)
  }
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

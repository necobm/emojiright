/**
 * Cloudflare Worker for Right Emoji
 * Securely proxies requests to OpenAI and Gemini APIs
 */

// CORS headers for frontend requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Change to your domain in production
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders 
      })
    }

    try {
      const { phrase, provider } = await request.json()

      if (!phrase || typeof phrase !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Invalid phrase provided' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      let suggestions
      switch (provider) {
        case 'openai':
          suggestions = await getOpenAISuggestions(phrase, env.OPENAI_API_KEY)
          break
        case 'gemini':
          suggestions = await getGeminiSuggestions(phrase, env.GEMINI_API_KEY)
          break
        default:
          return new Response(
            JSON.stringify({ error: `Unknown provider: ${provider}` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
      }

      return new Response(
        JSON.stringify({ suggestions }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.error('Worker error:', error)
      return new Response(
        JSON.stringify({ error: error.message || 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }
}

async function getOpenAISuggestions(phrase, apiKey) {
  if (!apiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
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
  
  // Remove markdown code blocks if present
  const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim()
  const suggestions = JSON.parse(cleanedContent)

  // Validate response format
  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    throw new Error('Invalid response format from OpenAI')
  }

  // Filter valid suggestions
  return suggestions.filter(item => item.emoji && item.reason)
}

async function getGeminiSuggestions(phrase, apiKey) {
  if (!apiKey) {
    throw new Error('Gemini API key not configured')
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Given the phrase: "${phrase}", suggest 4 relevant emojis. Return ONLY a JSON array with this exact format: [{"emoji": "💡", "reason": "Represents ideas"}]. No markdown, no explanations, just the JSON array.`
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
  
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No response from Gemini. Content may have been blocked by safety filters.')
  }

  const textResponse = data.candidates[0].content.parts[0].text.trim()
  
  // Remove markdown code blocks if present
  const cleanedContent = textResponse.replace(/```json\n?|\n?```/g, '').trim()
  const suggestions = JSON.parse(cleanedContent)

  // Validate response format
  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    throw new Error('Invalid response format from Gemini')
  }

  // Filter valid suggestions
  return suggestions.filter(item => item.emoji && item.reason)
}

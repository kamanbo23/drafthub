const fetch = require('node-fetch');

/**
 * AWS Lambda function to handle AI projection generation
 */
exports.handler = async (event) => {
  // Handle OPTIONS requests for CORS
  if (event.httpMethod === 'OPTIONS') {
    return formatResponse(200, {});
  }
  
  try {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    // Parse the incoming request body
    const body = JSON.parse(event.body || '{}');
    const { prompt, systemMessage, temperature, maxTokens } = body;
    
    // Validate required parameters
    if (!prompt) {
      return formatResponse(400, { error: 'Missing required parameter: prompt' });
    }
    
    // Get API key from environment variables (stored securely in Lambda)
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!OPENROUTER_API_KEY) {
      return formatResponse(500, { error: 'API key configuration missing' });
    }
    
    console.log('Making request to OpenRouter API for prompt starting with:', prompt.substring(0, 50) + '...');
    
    // Call the OpenRouter API
    const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://teal-vacherin-45b714.netlify.app', // Your Netlify domain
        'X-Title': 'NBA Draft Hub'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3-14b:free',
        messages: [
          {
            role: 'system',
            content: systemMessage || 'You are a professional NBA scout who writes clear, structured scouting reports with markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: temperature || 0.7,
        max_tokens: maxTokens || 2000
      })
    });
    
    if (!apiResponse.ok) {
      let errorText = await apiResponse.text();
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (parseError) {
        errorData = { raw: errorText };
      }
      
      console.error('OpenRouter API error:', apiResponse.status, errorData);
      
      return formatResponse(apiResponse.status, { 
        error: `API error: ${apiResponse.status}`,
        details: errorData
      });
    }
    
    // Return the successful response
    const data = await apiResponse.json();
    console.log('Successfully received response from OpenRouter');
    return formatResponse(200, data);
    
  } catch (error) {
    console.error('Server error:', error);
    return formatResponse(500, {
      error: 'Failed to generate projection',
      message: error.message || String(error)
    });
  }
};

/**
 * Helper function to format Lambda responses
 */
function formatResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Allow all origins for now
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'POST,OPTIONS'
    },
    body: JSON.stringify(body)
  };
} 
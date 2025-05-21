// Vercel serverless function to proxy OpenRouter API requests
// This function keeps API keys secure on the server side
import fetch from 'node-fetch';

// Define a function to handle both Vercel serverless function and local development
export default async function handler(req, res) {
  // Only allow POST requests for security
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // The API key should be set as an environment variable in Vercel
  // For local development, you can use the .env file
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

  try {
    // Extract the required data from the request body
    const body = req.body || {};
    const { prompt, systemMessage, temperature, maxTokens } = body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Missing required parameter: prompt' });
    }
    
    // Log request for debugging
    console.log('Generating projection for:', prompt.substring(0, 50) + '...');
    console.log('Using API key:', OPENROUTER_API_KEY.substring(0, 10) + '...');
    
    try {
      // Call the OpenRouter API with the server-side API key
      const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://drafthub.vercel.app',
          'X-Title': 'NBA Draft Hub'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-prover-v2:free',
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
      
      // Log the response status for debugging
      console.log('OpenRouter API response status:', apiResponse.status);
      
      if (!apiResponse.ok) {
        // Try to parse error data
        let errorText = await apiResponse.text();
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorData = { raw: errorText };
        }
        
        console.error('OpenRouter API error:', apiResponse.status, errorData);
        return res.status(apiResponse.status).json({ 
          error: `API error: ${apiResponse.status}`,
          details: errorData
        });
      }
      
      // Forward the successful response
      const data = await apiResponse.json();
      return res.status(200).json(data);
    } catch (fetchError) {
      console.error('Fetch error:', fetchError.message);
      return res.status(500).json({
        error: 'Failed to call OpenRouter API',
        message: fetchError.message
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Failed to generate projection',
      message: error.message || String(error)
    });
  }
} 
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const COMPOSIO_API_KEY = process.env.COMPOSIO_API_KEY;
    
    if (!COMPOSIO_API_KEY) {
      return res.status(500).json({ error: 'Composio API key not configured' });
    }

    // Use Composio backend API with automatic connection handling
    const response = await fetch(
      'https://backend.composio.dev/api/v1/actions/TWITTER_USER_LOOKUP_ME/execute',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': COMPOSIO_API_KEY,
        },
        body: JSON.stringify({
          input: {
            user_fields: ['public_metrics', 'created_at', 'description', 'profile_image_url']
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Composio API Error:', errorText);
      return res.status(response.status).json({ 
        error: 'Composio API request failed',
        details: errorText 
      });
    }

    const data = await response.json();
    
    if (!data.data || !data.data.data) {
      return res.status(500).json({ 
        error: 'Invalid response format',
        details: 'No data returned from Composio' 
      });
    }

    const profile = data.data.data;
    const metrics = profile.public_metrics || {};

    // Return formatted data
    return res.status(200).json({
      followers: metrics.followers_count || 0,
      tweets: metrics.tweet_count || 0,
      following: metrics.following_count || 0,
      likes: metrics.like_count || 0,
      username: profile.username || 'ladyzeng12',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
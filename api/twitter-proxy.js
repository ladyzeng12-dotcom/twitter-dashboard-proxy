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

    // Correct Twitter connectedAccountId for ladyzeng12
    const connectedAccountId = 'ca_i8XYd0jQcHe7';
    
    // Call Composio to get Twitter user info
    const response = await fetch(
      'https://backend.composio.dev/api/v2/actions/TWITTER_GET_PROFILE/execute',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': COMPOSIO_API_KEY,
        },
        body: JSON.stringify({
          connectedAccountId,
          input: {}
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
    
    if (!data.data) {
      return res.status(500).json({ error: 'No data returned from Composio' });
    }

    const profile = data.data;

    // Return formatted data
    return res.status(200).json({
      followers: profile.public_metrics?.followers_count || 0,
      tweets: profile.public_metrics?.tweet_count || 0,
      following: profile.public_metrics?.following_count || 0,
      likes: profile.public_metrics?.like_count || 0,
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
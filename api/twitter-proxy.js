const XQUIK_API_BASE_URL = process.env.XQUIK_API_BASE_URL || 'https://xquik.com';

function formatProfile(profile, defaults = {}) {
  const metrics = profile.public_metrics || {};

  return {
    followers: profile.followers || profile.followers_count || metrics.followers_count || 0,
    tweets: profile.statuses_count || profile.tweet_count || metrics.tweet_count || 0,
    following: profile.following || profile.following_count || metrics.following_count || 0,
    likes: profile.favourites_count || profile.like_count || metrics.like_count || 0,
    username: profile.username || defaults.username || 'ladyzeng12',
    timestamp: new Date().toISOString()
  };
}

async function fetchXquikProfile() {
  const apiKey = process.env.XQUIK_API_KEY;
  const username = process.env.XQUIK_USERNAME || 'ladyzeng12';

  if (!apiKey) return null;

  const response = await fetch(
    `${XQUIK_API_BASE_URL}/api/v1/x/users/${encodeURIComponent(username)}`,
    {
      headers: {
        'X-API-Key': apiKey
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    return {
      error: {
        details: errorText,
        error: 'Xquik API request failed',
        status: response.status
      }
    };
  }

  const profile = await response.json();
  return { data: formatProfile(profile, { username }) };
}

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
    const xquikProfile = await fetchXquikProfile();

    if (xquikProfile?.error) {
      return res.status(xquikProfile.error.status).json({
        error: xquikProfile.error.error,
        details: xquikProfile.error.details
      });
    }

    if (xquikProfile?.data) {
      return res.status(200).json(xquikProfile.data);
    }

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

    // Return formatted data
    return res.status(200).json(formatProfile(profile));

  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

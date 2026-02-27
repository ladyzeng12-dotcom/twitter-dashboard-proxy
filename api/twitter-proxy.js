export default async function handler(req, res) {
  // CORS 头设置
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 从环境变量读取 Twitter Bearer Token
    const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
    
    if (!TWITTER_BEARER_TOKEN) {
      return res.status(500).json({ error: 'Twitter token not configured' });
    }

    // 获取用户 ID (ladyzeng12 的 Twitter ID)
    const userId = '1879077516028063744';
    
    // 调用 Twitter API v2 获取用户信息
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}?user.fields=public_metrics`,
      {
        headers: {
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('Twitter API Error:', errorText);
      return res.status(userResponse.status).json({ 
        error: 'Twitter API request failed',
        details: errorText 
      });
    }

    const userData = await userResponse.json();

    // 获取最近推文
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=public_metrics,created_at`,
      {
        headers: {
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    let tweetsData = { data: [] };
    if (tweetsResponse.ok) {
      tweetsData = await tweetsResponse.json();
    }

    // 返回组合数据
    return res.status(200).json({
      user: userData.data,
      tweets: tweetsData.data || [],
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
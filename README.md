# Twitter Dashboard Proxy

Vercel Serverless Function proxy for Twitter API.

## Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ladyzeng12-dotcom/twitter-dashboard-proxy)

### Manual Deployment

1. Import this repository in Vercel Dashboard
2. Add environment variable:
   - Key: `TWITTER_BEARER_TOKEN`
   - Value: Your Twitter Bearer Token
3. Deploy

### Get Twitter Bearer Token

1. Visit https://developer.twitter.com/en/portal/dashboard
2. Login with @ladyzeng12
3. Create or select an App
4. Go to "Keys and tokens" tab
5. Generate Bearer Token

### API Endpoint

After deployment, access:
```
https://your-vercel-domain.vercel.app/api/twitter-proxy
```

### Update HTML Dashboard

Replace the API endpoint in `twitter-dashboard.html`:

```javascript
const CONFIG = {
  API_ENDPOINT: 'https://your-vercel-domain.vercel.app/api/twitter-proxy',
  // ...
};
```

## License

MIT
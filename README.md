# Twitter Dashboard Proxy

Vercel Serverless Function proxy for Twitter API.

## Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ladyzeng12-dotcom/twitter-dashboard-proxy)

### Manual Deployment

1. Import this repository in Vercel Dashboard
2. Add environment variable:
   - Key: `XQUIK_API_KEY`
   - Value: Your Xquik API key
   - Key: `XQUIK_USERNAME`
   - Value: Dashboard username without `@`
3. Deploy

The proxy still supports the existing backend provider when `XQUIK_API_KEY` is
not configured.

### Xquik Profile Source

When `XQUIK_API_KEY` is set, the function reads:

```text
GET https://xquik.com/api/v1/x/users/{username}
```

It returns the same dashboard response shape:

```json
{
  "followers": 1234,
  "tweets": 456,
  "following": 89,
  "likes": 0,
  "username": "ladyzeng12",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

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

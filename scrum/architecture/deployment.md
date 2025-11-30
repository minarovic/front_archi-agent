# MCOP Deployment Guide

Tento dokument popisuje nasadenie MCOP aplikácie na Railway (backend) a Vercel (frontend).

## Architektúra nasadenia

```
┌─────────────────────────────────────────────────────────────────┐
│                         Production                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐         ┌──────────────────────┐      │
│  │    Vercel            │         │    Railway           │      │
│  │    ────────          │         │    ───────           │      │
│  │                      │  HTTP/  │                      │      │
│  │  React Frontend      │◄───────►│  FastAPI Backend     │      │
│  │  - Static assets     │   WS    │  - REST API          │      │
│  │  - Client-side       │         │  - WebSocket         │      │
│  │                      │         │  - Explorer Agent    │      │
│  └──────────────────────┘         └──────────────────────┘      │
│                                            │                     │
│                                            ▼                     │
│                                   ┌──────────────────┐          │
│                                   │ Azure OpenAI     │          │
│                                   │ (gpt-5-mini)     │          │
│                                   └──────────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Backend Deployment (Railway)

### 1. Project Structure

```
archi-agent/
├── Dockerfile
├── requirements.txt
├── railway.toml          # Railway config
├── src/
│   ├── api/
│   │   ├── __init__.py
│   │   └── main.py
│   ├── explorer/
│   ├── orchestrator/
│   └── tool*/
└── data/
    └── analysis/
        └── ba_bs_datamarts_summary_*.json
```

### 2. Dockerfile

```dockerfile
# Dockerfile
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/
COPY data/ ./data/

# Create non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run server
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 3. Railway Configuration

```toml
# railway.toml
[build]
builder = "dockerfile"
dockerfilePath = "Dockerfile"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 30
startCommand = "uvicorn src.api.main:app --host 0.0.0.0 --port $PORT"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

### 4. Requirements

```txt
# requirements.txt
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
websockets>=12.0
python-multipart>=0.0.6
pydantic>=2.5.0
pydantic-ai>=0.0.49
python-dotenv>=1.0.0
httpx>=0.26.0
```

### 5. Railway Setup Steps

1. **Create Project:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Create project
   railway init
   ```

2. **Connect Repository:**
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub repo
   - Select `archi-agent` repository

3. **Configure Environment Variables:**
   ```bash
   # Via CLI
   railway variables set OPENAI_API_BASE="https://your-endpoint.openai.azure.com/"
   railway variables set OPENAI_API_KEY="your-api-key"
   railway variables set OPENAI_API_VERSION="2024-10-21"
   railway variables set CORS_ORIGINS="https://mcop.vercel.app"
   railway variables set LOG_LEVEL="INFO"
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

5. **Get Public URL:**
   ```bash
   railway domain
   # Output: mcop-api.railway.app
   ```

### 6. Health Check Endpoint

```python
# src/api/main.py
@app.get("/health")
async def health_check():
    """Health check for Railway."""
    return {
        "status": "healthy",
        "version": "0.1.0",
        "checks": {
            "collibra_mock": collibra_client is not None,
            "sessions_active": len(sessions)
        }
    }
```

## Frontend Deployment (Vercel)

### 1. Project Structure

```
frontend/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── store/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── vercel.json
└── .env.production
```

### 2. Vercel Configuration

```json
// vercel.json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://mcop-api.railway.app/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### 3. Environment Variables

```bash
# .env.production
VITE_API_URL=https://mcop-api.railway.app
VITE_WS_URL=wss://mcop-api.railway.app
```

### 4. Vercel Setup Steps

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy from frontend directory:**
   ```bash
   cd frontend
   vercel
   ```

4. **Configure Environment Variables:**
   - Go to [vercel.com](https://vercel.com) → Project Settings → Environment Variables
   - Add:
     - `VITE_API_URL` = `https://mcop-api.railway.app`
     - `VITE_WS_URL` = `wss://mcop-api.railway.app`

5. **Production Deploy:**
   ```bash
   vercel --prod
   ```

### 5. Custom Domain (Optional)

```bash
# Add custom domain
vercel domains add mcop.yourdomain.com

# Verify DNS
vercel domains verify mcop.yourdomain.com
```

## CORS Configuration

### Backend CORS Settings

```python
# src/api/main.py
import os
from fastapi.middleware.cors import CORSMiddleware

# Get allowed origins from env
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)
```

### WebSocket Origin Check

```python
@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    # Check origin for WebSocket
    origin = websocket.headers.get("origin", "")
    allowed = os.getenv("CORS_ORIGINS", "").split(",")

    if origin and origin not in allowed:
        await websocket.close(code=4003, reason="Origin not allowed")
        return

    await websocket.accept()
    # ...
```

## Environment Variables Summary

### Backend (Railway)

| Variable             | Description                       | Example                         |
| -------------------- | --------------------------------- | ------------------------------- |
| `OPENAI_API_BASE`    | Azure OpenAI endpoint             | `https://xxx.openai.azure.com/` |
| `OPENAI_API_KEY`     | API key                           | `sk-xxx...`                     |
| `OPENAI_API_VERSION` | API version                       | `2024-10-21`                    |
| `CORS_ORIGINS`       | Allowed origins (comma-separated) | `https://mcop.vercel.app`       |
| `LOG_LEVEL`          | Logging level                     | `INFO`                          |
| `PORT`               | Server port (set by Railway)      | `8000`                          |

### Frontend (Vercel)

| Variable       | Description     | Example                        |
| -------------- | --------------- | ------------------------------ |
| `VITE_API_URL` | Backend API URL | `https://mcop-api.railway.app` |
| `VITE_WS_URL`  | WebSocket URL   | `wss://mcop-api.railway.app`   |

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Railway CLI
        run: npm install -g @railway/cli

      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: deploy-backend
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_WS_URL: ${{ secrets.VITE_WS_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: frontend
```

## Monitoring & Logging

### Railway Logs

```bash
# View logs
railway logs

# Follow logs
railway logs --follow
```

### Application Logging

```python
import logging
import os

# Configure logging
log_level = os.getenv("LOG_LEVEL", "INFO")
logging.basicConfig(
    level=getattr(logging, log_level),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)

logger = logging.getLogger("mcop")

# Usage
logger.info(f"Session created: {session_id}")
logger.error(f"Agent error: {error}", exc_info=True)
```

### Vercel Analytics (Optional)

```tsx
// src/main.tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <Layout />
      <Analytics />
    </>
  );
}
```

## Troubleshooting

### Common Issues

#### 1. WebSocket Connection Fails

**Symptom:** Frontend can't connect to WebSocket

**Solution:**
- Ensure Railway URL uses `wss://` (not `ws://`)
- Check CORS_ORIGINS includes frontend URL
- Verify Railway service is running

```bash
# Check Railway status
railway status

# Check logs for WebSocket errors
railway logs | grep -i websocket
```

#### 2. CORS Errors

**Symptom:** Browser shows CORS error

**Solution:**
```python
# Ensure exact origin match (no trailing slash)
CORS_ORIGINS = "https://mcop.vercel.app"  # ✓
CORS_ORIGINS = "https://mcop.vercel.app/" # ✗
```

#### 3. Environment Variables Not Loading

**Symptom:** `OPENAI_API_KEY` is undefined

**Solution:**
```bash
# Verify variables are set
railway variables

# Redeploy after adding variables
railway up
```

#### 4. Build Fails on Railway

**Symptom:** Dockerfile build error

**Solution:**
```bash
# Test build locally
docker build -t mcop-api .
docker run -p 8000:8000 --env-file .env mcop-api

# Check Dockerfile syntax
docker build --check .
```

## Scaling (Post-MVP)

### Railway Horizontal Scaling

```toml
# railway.toml
[deploy]
numReplicas = 2  # Scale to 2 instances
```

### Session Persistence with Redis

```python
# When scaling beyond 1 instance, add Redis
import redis

redis_client = redis.from_url(os.getenv("REDIS_URL"))

class RedisSessionManager:
    def __init__(self):
        self.redis = redis_client

    def set(self, session_id: str, data: dict, ttl: int = 86400):
        self.redis.setex(session_id, ttl, json.dumps(data))

    def get(self, session_id: str) -> dict | None:
        data = self.redis.get(session_id)
        return json.loads(data) if data else None
```

## Security Checklist

- [ ] HTTPS only (Railway provides SSL automatically)
- [ ] Environment variables for secrets (never commit)
- [ ] CORS configured for production origins only
- [ ] Rate limiting enabled
- [ ] WebSocket origin validation
- [ ] No debug mode in production
- [ ] Health check endpoint protected (no sensitive data)

## Cost Estimates (2024)

| Service      | Tier          | Est. Monthly Cost |
| ------------ | ------------- | ----------------- |
| Railway      | Hobby         | $5 + usage        |
| Railway      | Pro           | $20 + usage       |
| Vercel       | Hobby         | Free              |
| Vercel       | Pro           | $20/member        |
| Azure OpenAI | Pay-as-you-go | ~$10-50           |

**Total MVP:** ~$15-75/month

## References

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

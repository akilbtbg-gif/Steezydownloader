# Steezy Backend

Self-hosted backend for the Steezy YouTube downloader.

## Setup

1. Upload this `backend` folder to your VPS

2. Install dependencies:
```bash
cd backend
npm install
```

3. Run the server:
```bash
npm start
```

For production, use PM2:
```bash
npm install -g pm2
pm2 start server.js --name steezy-backend
pm2 save
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Your frontend URL for CORS (default: allows all)

## API Endpoints

### POST /api/info
Returns video metadata.

**Request:**
```json
{ "url": "https://www.youtube.com/watch?v=..." }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "...",
    "title": "Video Title",
    "thumbnail": "https://...",
    "duration": "3:42",
    "viewCount": "1.2M views",
    "channelTitle": "Channel Name"
  }
}
```

### POST /api/download
Streams the video/audio file.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "format": "mp4",
  "quality": "720p"
}
```

## Frontend Configuration

In your frontend `.env`:
```
VITE_API_BASE_URL=https://your-vps-domain.com
```

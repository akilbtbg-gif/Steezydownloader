# Backend API Documentation

This document describes the API endpoints your self-hosted backend needs to implement.

## Configuration

Set the `VITE_API_BASE_URL` environment variable to point to your backend:

```env
VITE_API_BASE_URL=https://your-vps-domain.com
```

If not set, the frontend will use relative URLs (same origin).

---

## Endpoints

### POST /api/info

Fetches video information from a YouTube URL.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response (success):**
```json
{
  "success": true,
  "data": {
    "videoId": "dQw4w9WgXcQ",
    "title": "Video Title",
    "description": "Video description...",
    "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "channelTitle": "Channel Name",
    "duration": "3:32",
    "viewCount": "1.2M views",
    "publishedAt": "2023-01-15"
  }
}
```

**Response (error):**
```json
{
  "success": false,
  "error": "Invalid YouTube URL"
}
```

---

### POST /api/download

Initiates a download for the specified video.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "mp4",
  "quality": "720p"
}
```

- `format`: Either `"mp4"` or `"mp3"`
- `quality`: Optional. e.g., `"1080p"`, `"720p"`, `"480p"`, `"360p"`

**Response (success - direct download URL):**
```json
{
  "success": true,
  "downloadUrl": "https://your-server.com/downloads/video.mp4",
  "filename": "video-title.mp4",
  "useIframe": false
}
```

**Response (success - iframe/redirect):**
```json
{
  "success": true,
  "downloadUrl": "https://external-service.com/download?v=...",
  "useIframe": true
}
```

**Response (error):**
```json
{
  "success": false,
  "error": "Download failed - video unavailable"
}
```

---

## CORS Configuration

Make sure your backend allows CORS from your frontend domain:

```
Access-Control-Allow-Origin: https://your-frontend-domain.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Example Node.js Backend (Express)

```javascript
const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/info', async (req, res) => {
  try {
    const { url } = req.body;
    const info = await ytdl.getInfo(url);
    
    res.json({
      success: true,
      data: {
        videoId: info.videoDetails.videoId,
        title: info.videoDetails.title,
        description: info.videoDetails.description,
        thumbnail: info.videoDetails.thumbnails[0]?.url,
        channelTitle: info.videoDetails.author.name,
        duration: formatDuration(info.videoDetails.lengthSeconds),
        viewCount: formatViews(info.videoDetails.viewCount),
        publishedAt: info.videoDetails.publishDate
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/download', async (req, res) => {
  // Implement your download logic here
  // Return a download URL or stream the file directly
});

app.listen(3000);
```

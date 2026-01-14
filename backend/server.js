const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS - allow all for now, update later for your frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Helper - format duration
function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Helper - format views
function formatViews(count) {
  const num = parseInt(count);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
  return `${num} views`;
}

// POST /api/info - Get video info
app.post('/api/info', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.json({ success: false, error: 'No URL provided' });

  try {
    const info = await ytdl.getInfo(url);

    const videoDetails = info.videoDetails;
    res.json({
      success: true,
      data: {
        title: videoDetails.title,
        author: videoDetails.author.name,
        duration: formatDuration(videoDetails.lengthSeconds),
        views: formatViews(videoDetails.viewCount),
        thumbnail: videoDetails.thumbnails.pop().url,
        url: videoDetails.video_url
      }
    });
  } catch (err) {
    console.error('Error fetching video info:', err);
    res.json({ success: false, error: 'Failed to fetch video information' });
  }
});

// GET /api/download - download video
app.get('/api/download', (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('No URL provided');

  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  ytdl(url, { format: 'mp4' }).pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
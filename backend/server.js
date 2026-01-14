const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS - update origin for production
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Format duration from seconds to MM:SS or HH:MM:SS
function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Format view count
function formatViews(count) {
  const num = parseInt(count);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
  return `${num} views`;
}

// POST /api/info - Get video information
app.post('/api/info', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });
    }

    const info = await ytdl.getInfo(url);
    const details = info.videoDetails;

    res.json({
      success: true,
      data: {
        videoId: details.videoId,
        title: details.title,
        description: details.description?.substring(0, 500) || '',
        thumbnail: details.thumbnails[details.thumbnails.length - 1]?.url || '',
        channelTitle: details.author.name,
        duration: formatDuration(parseInt(details.lengthSeconds)),
        viewCount: formatViews(details.viewCount),
        publishedAt: details.publishDate || ''
      }
    });
  } catch (error) {
    console.error('Info error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch video information' });
  }
});

// POST /api/download - Stream video/audio download
app.post('/api/download', async (req, res) => {
  try {
    const { url, format, quality } = req.body;

    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s-]/g, '').substring(0, 50);

    if (format === 'mp3') {
      // Audio only
      res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
      res.setHeader('Content-Type', 'audio/mpeg');

      ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio'
      }).pipe(res);

    } else {
      // Video (MP4)
      const qualityMap = {
        '1080p': '137',
        '720p': '136',
        '480p': '135',
        '360p': '134'
      };

      res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
      res.setHeader('Content-Type', 'video/mp4');

      ytdl(url, {
        quality: qualityMap[quality] || 'highest',
        filter: 'videoandaudio'
      }).pipe(res);
    }
  } catch (error) {
    console.error('Download error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Download failed' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

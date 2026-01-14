// server.js
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 requests per minute per IP
  message: { success: false, error: 'Too many requests, slow down!' }
});
app.use(limiter);

// Timeout & Max file size (in bytes)
const DOWNLOAD_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

// Helper to generate temp file
function getTempFilePath(extension = '.mp4') {
  return path.join(os.tmpdir(), `yt-${Date.now()}${extension}`);
}

// POST /api/info
app.post('/api/info', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, error: 'Missing URL' });

    // Spawn yt-dlp to get JSON info
    const ytdlp = spawn('yt-dlp', ['-J', url]);

    let output = '';
    let errorOutput = '';
    const timeout = setTimeout(() => {
      ytdlp.kill();
      res.status(500).json({ success: false, error: 'Timeout fetching video info' });
    }, DOWNLOAD_TIMEOUT);

    ytdlp.stdout.on('data', data => output += data.toString());
    ytdlp.stderr.on('data', data => errorOutput += data.toString());

    ytdlp.on('close', code => {
      clearTimeout(timeout);
      if (code !== 0) {
        return res.status(500).json({ success: false, error: errorOutput || 'Failed fetching video info' });
      }
      try {
        const info = JSON.parse(output);
        res.json({
          success: true,
          data: {
            id: info.id,
            title: info.title,
            uploader: info.uploader,
            duration: info.duration,
            thumbnail: info.thumbnail,
            view_count: info.view_count,
            formats: info.formats.map(f => ({
              format_id: f.format_id,
              ext: f.ext,
              resolution: f.resolution || f.height + 'p',
              filesize: f.filesize || 0,
              note: f.format_note || ''
            }))
          }
        });
      } catch (err) {
        res.status(500).json({ success: false, error: 'Invalid info JSON' });
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/download
app.post('/api/download', async (req, res) => {
  try {
    const { url, format = 'mp4', quality = 'best' } = req.body;
    if (!url) return res.status(400).json({ success: false, error: 'Missing URL' });

    const tempFile = getTempFilePath(`.${format}`);

    const args = [
      url,
      '-f', quality,
      '-o', tempFile
    ];

    if (format === 'mp3') {
      args.push('--extract-audio', '--audio-format', 'mp3');
    }

    const ytdlp = spawn('yt-dlp', args);

    const timeout = setTimeout(() => {
      ytdlp.kill();
      fs.unlink(tempFile, () => { });
      res.status(500).json({ success: false, error: 'Download timeout' });
    }, DOWNLOAD_TIMEOUT);

    ytdlp.stderr.on('data', data => { }); // ignore for now

    ytdlp.on('close', code => {
      clearTimeout(timeout);
      if (code !== 0 || !fs.existsSync(tempFile)) {
        fs.unlink(tempFile, () => { });
        return res.status(500).json({ success: false, error: 'Failed to download video' });
      }

      // Check file size
      const stats = fs.statSync(tempFile);
      if (stats.size > MAX_FILE_SIZE) {
        fs.unlinkSync(tempFile);
        return res.status(413).json({ success: false, error: 'File too large' });
      }

      // Stream to client
      res.setHeader('Content-Disposition', `attachment; filename="${path.basename(tempFile)}"`);
      res.setHeader('Content-Type', format === 'mp3' ? 'audio/mpeg' : 'video/mp4');

      const fileStream = fs.createReadStream(tempFile);
      fileStream.pipe(res);

      fileStream.on('close', () => {
        fs.unlink(tempFile, () => { }); // delete after sending
      });
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
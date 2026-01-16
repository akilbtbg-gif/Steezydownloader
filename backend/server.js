import express from "express";
import cors from "cors";
import ytdl from "@distube/ytdl-core";
import dotenv from "dotenv";
import { readFileSync } from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Load YouTube cookies
let youtubeCookies = [];
try {
  youtubeCookies = JSON.parse(readFileSync('./youtube-cookies.json', 'utf8'));
  console.log('✅ YouTube cookies loaded successfully');
} catch (err) {
  console.warn('⚠️  No YouTube cookies found');
}

/* =======================
   CORS CONFIG
======================= */
// Allowed origins: set in .env as comma-separated list
// Example: ALLOWED_ORIGINS=http://localhost:8080,https://myfrontend.com
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:8080"]; // fallback

app.use(
  cors({
    origin: ["https://steezydownloader.online", "https://www.steezydownloader.online", "http://localhost:5173"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json());

/* =======================
   HELPERS
======================= */
function formatDuration(seconds) {
  const total = Number(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatViews(count) {
  const num = Number(count);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M views`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K views`;
  return `${num} views`;
}

/* =======================
   ROUTES
======================= */

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "Steezy backend is running 🚀" });
});

// POST /api/info
app.post("/api/info", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "No URL provided",
    });
  }

  if (!ytdl.validateURL(url)) {
    return res.status(400).json({
      success: false,
      error: "Invalid YouTube URL",
    });
  }

  try {
    const info = await ytdl.getInfo(url, {
      cookies: youtubeCookies
    });

    const video = info.videoDetails;

    res.json({
      success: true,
      data: {
        title: video.title,
        author: video.author.name,
        duration: formatDuration(video.lengthSeconds),
        views: formatViews(video.viewCount),
        thumbnail: video.thumbnails.at(-1)?.url,
        url: video.video_url,
      },
    });
  } catch (err) {
    console.error("YTDL ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch video information",
    });
  }
});

// GET /api/download
app.get("/api/download", (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).send("No URL provided");
  if (!ytdl.validateURL(url)) return res.status(400).send("Invalid YouTube URL");

  res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');

  ytdl(url, {
    quality: "highestvideo",
    cookies: youtubeCookies
  })
    .on("error", (err) => {
      console.error("Download error:", err);
      res.end();
    })
    .pipe(res);
});

/* =======================
   START SERVER
======================= */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
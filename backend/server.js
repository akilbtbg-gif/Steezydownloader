import express from "express";
import cors from "cors";
import ytdl from "ytdl-core";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// Helper - format duration
function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Helper - format views
function formatViews(count) {
  const num = parseInt(count, 10);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M views`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K views`;
  return `${num} views`;
}

// POST /api/info
app.post("/api/info", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: "No URL provided" });
  }

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
        thumbnail: videoDetails.thumbnails.at(-1)?.url,
        url: videoDetails.video_url,
      },
    });
  } catch (err) {
    console.error("Error fetching video info:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to fetch video information",
    });
  }
});

// GET /api/download
app.get("/api/download", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("No URL provided");

  res.setHeader(
    "Content-Disposition",
    'attachment; filename="video.mp4"'
  );

  ytdl(url, { quality: "highestvideo" }).pipe(res);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

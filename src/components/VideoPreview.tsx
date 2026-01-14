import { motion } from "framer-motion";
import { Play, User, ExternalLink } from "lucide-react";
import type { VideoInfo } from "@/lib/youtube";

interface VideoPreviewProps {
  video: VideoInfo;
}

const VideoPreview = ({ video }: VideoPreviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl overflow-hidden max-w-2xl mx-auto"
    >
      {/* Video Thumbnail */}
      <div className="relative aspect-video group">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to lower quality thumbnail
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('hqdefault')) {
              target.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
            }
          }}
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <a
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
          </a>
        </div>

        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-sm font-medium">
            {video.duration}
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold line-clamp-2 leading-tight">
          {video.title}
        </h3>
        
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{video.channelTitle}</span>
          </div>
          
          {video.viewCount && (
            <>
              <span>•</span>
              <span>{video.viewCount}</span>
            </>
          )}
        </div>

        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-primary text-sm hover:underline"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Watch on YouTube
        </a>
      </div>
    </motion.div>
  );
};

export default VideoPreview;

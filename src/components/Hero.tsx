import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import VideoPreview from "@/components/VideoPreview";
import { fetchVideoInfo, requestDownload, validateYouTubeUrl, type VideoInfo } from "@/lib/youtube";

type DownloadState = "idle" | "fetching" | "ready" | "downloading" | "error" | "complete";

const Hero = () => {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<DownloadState>("idle");
  const [format, setFormat] = useState<"mp4" | "mp3">("mp4");
  const [errorMessage, setErrorMessage] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setVideoInfo(null);

    if (!url.trim()) {
      setErrorMessage("Please enter a YouTube URL");
      setState("error");
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setErrorMessage("Please enter a valid YouTube video or Shorts URL");
      setState("error");
      return;
    }

    setState("fetching");

    const result = await fetchVideoInfo(url);

    if (!result.success || !result.data) {
      setErrorMessage(result.error || "Failed to fetch video information");
      setState("error");
      return;
    }

    setVideoInfo(result.data);
    setState("ready");
  };

  const handleDownload = async () => {
    if (!videoInfo) return;

    setState("downloading");

    const result = await requestDownload(url, format);

    if (!result.success) {
      toast({
        title: "Download Failed",
        description: result.error || "Could not process the download",
        variant: "destructive",
      });
      setState("ready");
      return;
    }

    if (result.downloadUrl) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // If it's a direct download link, set download attribute
      if (!result.useIframe) {
        link.download = result.filename || `${videoInfo.title || 'video'}.${format}`;
      }
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started!",
        description: result.useIframe 
          ? "Download page opened - select your preferred quality" 
          : `Your ${format.toUpperCase()} file is being downloaded`,
      });

      setState("complete");
      
      // Reset after a delay
      setTimeout(() => {
        setState("ready");
      }, 3000);
    } else {
      toast({
        title: "Download Error",
        description: "Could not get download URL",
        variant: "destructive",
      });
      setState("ready");
    }
  };

  const resetState = () => {
    setState("idle");
    setErrorMessage("");
    setVideoInfo(null);
    setUrl("");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Fast & Free Downloads</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Download YouTube Videos
          <br />
          & Shorts <span className="gradient-text">Instantly ⚡</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Steezy Downloader lets you download YouTube long videos and Shorts in seconds — no sign-up, no stress, just vibes.
        </motion.p>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {state === "idle" || state === "fetching" || state === "error" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (state === "error") {
                      setState("idle");
                      setErrorMessage("");
                    }
                  }}
                  placeholder="Paste YouTube video or Shorts link here…"
                  className="h-16 px-6 text-lg glass rounded-2xl border-2 border-transparent focus:border-primary transition-all"
                  disabled={state === "fetching"}
                />
                {state === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-0 flex items-center gap-2 text-destructive text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errorMessage}
                  </motion.div>
                )}
              </div>

              <Button
                type="submit"
                size="hero"
                variant="gradient"
                className="w-full sm:w-auto"
                disabled={state === "fetching"}
              >
                {state === "fetching" ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Fetching Video...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download Now
                  </>
                )}
              </Button>
            </form>
          ) : (state === "ready" || state === "downloading" || state === "complete") && videoInfo ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Video Preview */}
              <VideoPreview video={videoInfo} />

              {/* Format Selection */}
              <div className="glass rounded-2xl p-6 space-y-4">
                {state === "complete" && (
                  <div className="flex items-center justify-center gap-2 text-primary mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-semibold">Download Started!</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setFormat("mp4")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      format === "mp4"
                        ? "gradient-bg text-primary-foreground"
                        : "glass hover:bg-secondary"
                    }`}
                    disabled={state === "downloading"}
                  >
                    📹 MP4 Video
                  </button>
                  <button
                    onClick={() => setFormat("mp3")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      format === "mp3"
                        ? "gradient-bg text-primary-foreground"
                        : "glass hover:bg-secondary"
                    }`}
                    disabled={state === "downloading"}
                  >
                    🎵 MP3 Audio
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Button
                    onClick={handleDownload}
                    size="hero"
                    variant="gradient"
                    disabled={state === "downloading"}
                  >
                    {state === "downloading" ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Download {format.toUpperCase()}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={resetState}
                    variant="ghost"
                    size="lg"
                    disabled={state === "downloading"}
                  >
                    Try Another URL
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </motion.div>

        <motion.p
          className="mt-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Works with YouTube videos, Shorts, and more
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;

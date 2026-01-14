// Configuration - Update this to point to your self-hosted backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface VideoInfo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  duration: string;
  viewCount: string;
  publishedAt: string;
}

export interface DownloadResult {
  success: boolean;
  downloadUrl?: string;
  filename?: string;
  error?: string;
  useIframe?: boolean;
}

export async function fetchVideoInfo(url: string): Promise<{ success: boolean; data?: VideoInfo; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch video information' }));
      return { success: false, error: errorData.error || 'Failed to fetch video information' };
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: 'Failed to fetch video information' };
  }
}

export async function requestDownload(url: string, format: 'mp4' | 'mp3', quality?: string): Promise<DownloadResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, format, quality }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Download failed' }));
      return { success: false, error: errorData.error || 'Download failed' };
    }

    const data = await response.json();

    if (!data.success) {
      return { success: false, error: data.error || 'Download failed' };
    }

    return {
      success: true,
      downloadUrl: data.downloadUrl,
      filename: data.filename,
      useIframe: data.useIframe || false,
    };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: 'Failed to process download request' };
  }
}

export function validateYouTubeUrl(url: string): boolean {
  const patterns = [
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/,
    /^(https?:\/\/)?youtu\.be\/[\w-]+/,
  ];
  return patterns.some((pattern) => pattern.test(url));
}

export function parseVideoAtts(
  video: any,
) {
  if (!video) return null;
  const videoUrl = video.url || video;
  const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(videoUrl)}`;

  return {
    src: proxyUrl,
    poster: video.poster || undefined,
    type: video.mime_type || 'video/mp4',
    width: video.width || undefined,
    height: video.height || undefined,
  };
}

export function getVideoThumbnail(videoUrl: string): string {
  return `/api/video-thumbnail?url=${encodeURIComponent(videoUrl)}`;
}
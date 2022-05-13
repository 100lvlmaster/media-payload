export const isAudio = (mimeType: string): boolean => {
  return mimeType.startsWith('audio/');
}

export const isVideo = (mimeType: string): boolean => {
  return mimeType.startsWith('video/');
}

export const isImage = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
}

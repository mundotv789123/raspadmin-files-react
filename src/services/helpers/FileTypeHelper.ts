export const isVideo = (type: string) => type.match(/video\/(mp4|webm|ogg|mkv)/);

export const isAudio = (type: string) => type.match(/audio\/(mpeg|mp3|ogg|(x-(pn-)?)?wav)/);

export const isImage = (type: string) => type.match(/image\/(png|jpe?g|svg|webp)/);
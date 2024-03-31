export const isVideo = (type: string) => type.match(/video\/(mp4|webm|ogg|mkv)/);

export const isAudio = (type: string) => type.match(/audio\/(mpeg|mp3|ogg|(x-(pn-)?)?wav)/);

export const isImage = (type: string) => type.match(/image\/(png|jpe?g|svg|webp)/);

export const iconsPath = "/img/icons/";

export function getFileIcon(is_dir: boolean, minetype: string | null): string {
  if (is_dir)
    return 'folder.svg'
  if (!minetype)
    return 'document.svg';

  let [type, format] = minetype.toString().split('/');
  switch (type) {
    case 'video':
      return 'video.svg';
    case 'audio':
      return 'music.svg';
    case 'image':
      return 'image.svg';
    case "application":
      switch (format) {
        case 'java-archive':
          return 'java.svg'
        case 'x-msdos-program':
          return 'exe.svg';
        case 'x-iso9660-image':
        case 'octet-stream':
          return 'iso.svg';
        case 'x-msdownload':
        case 'x-sh':
          return 'document.svg';
      }
      return 'compact.svg';
    case 'text':
      switch (format) {
        case 'x-java-source':
          return 'java.svg'
      }
      return 'document.svg';
  }
  return 'document.svg';
}
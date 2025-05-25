import { FileDTO } from "@/services/models/files-model";
import { Component, Decorator } from "../files-transformers-base";

const iconsPath = "/img/icons/";

export class FileIconTransformer extends Decorator {
  constructor(compoment: Component, private apiUrl: string) {
    super(compoment);
  }

  public transform(): FileDTO {
    const file = super.transform();
    if (file.icon) {
      file.icon = `${this.apiUrl.replace("{0}", encodeURIComponent(file.icon))}`;
    } else {
      file.icon = `${iconsPath}${this.getFileIcon(file.is_dir, file.type)}`;
    }
    return file;
  }

  private getFileIcon(is_dir: boolean, minetype: string | null): string {
    if (is_dir)
      return 'folder.svg'
    if (!minetype)
      return 'document.svg';

    const [type, format] = minetype.toString().split('/');
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
          case 'pdf':
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
    return 'unknow.svg';
  }
}
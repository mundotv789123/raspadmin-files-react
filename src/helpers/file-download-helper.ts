import { FileDTO } from "@/services/models/files-model";

export class FileDownloadHelper {
  static downloadFile(file: FileDTO) {
    const elementA = document.createElement('a');
    elementA.hidden = true;
    elementA.href = file.src;
    elementA.download = file.name;
    elementA.target = 'blank'
    elementA.click();
    elementA.remove();
  }
}
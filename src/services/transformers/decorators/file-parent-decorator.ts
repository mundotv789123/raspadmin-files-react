import { FileDTO } from "@/services/models/files-model";
import { Decorator } from "../files-transformers-base";

export class FileParentTransformer extends Decorator {
  public transform(): FileDTO {
    const file = super.transform();
    file.parent = file.path.replace(/\/[^\/]+\/?$/, '');
    return file;
  }
}
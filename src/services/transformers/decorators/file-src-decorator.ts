import { FileDTO } from "@/services/models/files-model";
import { Component, Decorator } from "../files-transformers-base";

export class FileSrcTransformer extends Decorator {
  constructor(compoment: Component, private apiUrl: string) {
    super(compoment);
  }

  public transform(): FileDTO {
    const file = super.transform();
    const fullpath = encodeURIComponent(`${file.path}`);
    file.src = `${this.apiUrl.replace("{0}", fullpath)}`;
    file.href = `#${fullpath.replaceAll("%2F", "/")}`;
    return file;
  }
}
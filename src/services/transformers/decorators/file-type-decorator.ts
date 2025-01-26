import { FileDTO } from "@/services/models/files-model";
import { Component, Decorator } from "../files-transformers-base";
import { lookup } from "mime-types";

export class FileTypeTransformer extends Decorator {
  constructor(compoment: Component) {
    super(compoment);
  }

  public transform(): FileDTO {
    const file = super.transform();
    if (!file.type) {
      const mimeType = lookup(file.name);
      if (mimeType) {
        file.type = mimeType;
      }
    }
    return file;
  }
}
import { FileDTO } from "../models/files-model";
import { FileIconTransformer } from "./decorators/file-icon-decorator";
import { FileParentTransformer } from "./decorators/file-parent-decorator";
import { FileSrcTransformer } from "./decorators/file-src-decorator";
import { FileTypeTransformer } from "./decorators/file-type-decorator";
import { FileTransformerComponent } from "./files-transformers-base";

export default function TranformeFileDTO(file: FileDTO, apiUrl: string): FileDTO {
  const component = new FileTransformerComponent(file);

  const srcTransformer = new FileSrcTransformer(component, apiUrl);
  const parentTransformer = new FileParentTransformer(srcTransformer);

  const typeTransformer = new FileTypeTransformer(parentTransformer);
  const iconTransformer = new FileIconTransformer(typeTransformer, apiUrl);

  return iconTransformer.transform();
}
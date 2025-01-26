import { FileDTO } from "../models/files-model";

export interface Component {
  transform(): FileDTO;
}

export class FileTransformerComponent implements Component {
  constructor(private file: FileDTO) { }

  transform(): FileDTO {
    return this.file;
  }
}

export class Decorator implements Component {
  constructor(private component: Component) { }

  public transform(): FileDTO {
    return this.component.transform();
  }
}

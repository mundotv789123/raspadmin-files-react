import { FileDTO } from "../models/files-model";

export interface SortStrategy {
  sort(files: Array<FileDTO>): Array<FileDTO>;
}

class SortByNameNaturalStrategy implements SortStrategy {
  public sort(files: Array<FileDTO>) {
    return files.sort((a: FileDTO, b: FileDTO) => {
      if (a.is_dir == b.is_dir)
        return a.name.localeCompare(b.name, undefined, { numeric: true });
      return a.is_dir ? -1 : 1;
    });
  }
}

class SortByDateStrategy implements SortStrategy {
  public sort(files: Array<FileDTO>) {
    return files.sort((a: FileDTO, b: FileDTO) => {
      if (!a.updated_at) return 1;
      if (!b.updated_at) return -1;

      if (a.is_dir == b.is_dir)
        return a.updated_at > b.updated_at ? -1 : 1;
      return a.is_dir ? -1 : 1;
    });
  }
}

export function SortFactory(sortBy: string = 'name'): SortStrategy {
  switch(sortBy) {
    case "name":
      return new SortByNameNaturalStrategy();
    case "date":
      return new SortByDateStrategy();
  }
  return new SortByNameNaturalStrategy();
}
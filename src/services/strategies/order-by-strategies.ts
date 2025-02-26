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
      if (a.is_dir == b.is_dir)
        return (a.created_at?.valueOf() ?? 0) - (b.created_at?.valueOf()  ?? 0);
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
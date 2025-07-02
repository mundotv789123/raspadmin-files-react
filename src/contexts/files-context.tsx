import { FileDTO } from "@/services/models/files-model";
import { SortStrategy } from "@/services/strategies/order-by-strategies";
import { createContext } from "react";

export interface FilesContextType {
  file?: FileDTO;
  files?: Array<FileDTO>;
  sortStrategy?: SortStrategy;
}

export interface FilesContextProps {
  children: React.ReactNode;
  value: FilesContextType;
}

export const FilesContext = createContext<FilesContextType | null>(null);

export function FilesContextProvider({ children, value }: FilesContextProps) {
  return <FilesContext value={value}>{children}</FilesContext>;
}

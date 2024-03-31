import axios, { AxiosError, AxiosInstance } from "axios";
import { FileResponse, FileModel } from "./models/FilesModel";
import { lookup } from "mime-types";
import { FileError } from "./exceptions/FilesErros";
import path from "path";

interface FileResponseData {
  files: Array<FileResponse>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";
const API_QUERY = process.env.NEXT_PUBLIC_API_QUERY ?? "?path={0}"
const SRC_QUERY = process.env.NEXT_PUBLIC_SRC_QUERY ?? "?path={0}"

export class FilesService {
  private static instance: FilesService | null = null;

  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}`,
      timeout: 5000
    })
  }

  public static getInstance(): FilesService {
    if (this.instance == null)
      this.instance = new FilesService();
    return this.instance;
  }

  public async getFiles(pathFile: string | null): Promise<Array<FileModel>> {
    if (pathFile == null)
      pathFile = "/";
    try {
      let result = await this.api.get<FileResponseData>(`/files${FilesService.getQuery(encodeURIComponent(pathFile))}`);
      if (result.status == 204)
        return [];

      let response = result.data.files.map(file => FilesService.convertFileModel(file, pathFile));
      return FilesService.sortNaturalFiles(response);
    } catch (ex: unknown) {
      if (ex instanceof AxiosError)
        throw new FileError(ex.response?.status ?? 500);
    }
  }

  public static convertFileModel(file: FileResponse, pathFile: string): FileModel {
    let filePathFull = file.open ? pathFile : `${pathFile}/${file.name}`;

    let fileModel = {
      ...file,
      src: FilesService.getSrcFile(filePathFull),
      href: FilesService.getHrefFile(filePathFull),
      parent: FilesService.getParentPath(pathFile)
    };
    
    if (!fileModel.type)
      fileModel.type = FilesService.getType(fileModel.name);
    if (fileModel.icon)
      fileModel.icon = FilesService.getSrcFile(fileModel.icon);
    return fileModel;
  }

  public static getType(name: string): string | null {
    let mimeType = lookup(name);
    if (mimeType)
      return mimeType;
  }

  public static sortNaturalFiles(files: Array<FileModel>): Array<FileModel> {
    return files.sort((a: FileModel, b: FileModel) => {
      if (a.is_dir == b.is_dir)
        return a.name.localeCompare(b.name, undefined, { numeric: true });
      return a.is_dir ? -1 : 1;
    });
  } 

  public static getParentPath = (pathFile: string): string =>
    pathFile.replace(/\/[^\/]+\/?$/, '');

  public static getHrefFile = (pathFile: string): string =>
    `#${encodeURIComponent(path.normalize(`${pathFile}`))}`;

  public static getSrcFile = (pathFile: string): string =>
    `${API_URL}/files/open${FilesService.getSrcQuery(encodeURIComponent(path.normalize(`${pathFile}`)))}`;

  public static getQuery = (path: string): string =>
    API_QUERY.replace('{0}', path);

  public static getSrcQuery = (path: string): string =>
    SRC_QUERY.replace('{0}', path);
}

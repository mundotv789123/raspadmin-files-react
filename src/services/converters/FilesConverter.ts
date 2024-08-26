import { lookup } from "mime-types";
import { FileModel, FileResponse, MediaType } from "../models/FilesModel";
import path from "path";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";
const API_QUERY = process.env.NEXT_PUBLIC_API_QUERY ?? "?path={0}"
const SRC_QUERY = process.env.NEXT_PUBLIC_SRC_QUERY ?? "?path={0}"

export class FilesConverter {
  public static convertFileModel(file: FileResponse, pathFile: string): FileModel {
    let filePathFull = file.open ? pathFile : `${pathFile}/${file.name}`;

    let fileModel: FileModel = {
      ...file,
      src: FilesConverter.getSrcFile(filePathFull),
      href: FilesConverter.getHrefFile(filePathFull),
      parent: FilesConverter.getParentPath(pathFile),
      mediaType: MediaType.UNKNOW //TODO get media type
    };

    if (!fileModel.type)
      fileModel.type = FilesConverter.getType(fileModel.name);
    if (fileModel.icon)
      fileModel.icon = FilesConverter.getSrcFile(fileModel.icon);
    return fileModel;
  }

  public static getType(name: string): string | null {
    let mimeType = lookup(name);
    if (mimeType)
      return mimeType;
    return null;
  }

  public static getParentPath = (pathFile: string): string =>
    pathFile.replace(/\/[^\/]+\/?$/, '');

  public static getHrefFile = (pathFile: string): string =>
    `#${encodeURIComponent(path.normalize(`${pathFile}`))}`;

  public static getSrcFile = (pathFile: string): string =>
    `${API_URL}/files/open${FilesConverter.getSrcQuery(encodeURIComponent(path.normalize(`${pathFile}`)))}`;

  public static getQuery = (path: string): string =>
    API_QUERY.replace('{0}', path.replace("%2F", "/"));

  public static getSrcQuery = (path: string): string =>
    SRC_QUERY.replace('{0}', path.replace("%2F", "/"));
}
import ApiBaseService from "../api-base-service";
import { FileDTO, FilesResponse } from "../models/files-model";
import TranformeFileDTO from "../transformers/files-transformers";

const API_QUERY = process.env.NEXT_PUBLIC_API_QUERY ?? "?path={0}"
const SRC_QUERY = process.env.NEXT_PUBLIC_SRC_QUERY ?? "?path={0}"

export default class FilesService extends ApiBaseService {
  async getFiles(path: string): Promise<Array<FileDTO>> {
    const endpoint = API_QUERY.replace('{0}', encodeURIComponent(path).replace("%2F", "/"));
    const response = await this.get<FilesResponse>(`/files${endpoint}`);

    const url = `${this.baseUri}/files/open${SRC_QUERY}`;
    
    const responseTransforme = response.files.map(file => TranformeFileDTO(file, url));
    return responseTransforme;
  }
}
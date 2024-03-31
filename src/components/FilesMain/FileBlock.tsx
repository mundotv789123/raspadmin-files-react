import { FileModel } from "../../services/models/FilesModel";
import { getFileIcon, iconsPath } from "../../helpers/FileTypeHelper";
import { FileCont, FileIcon, FileLoading, FileName } from "./styles";

interface PropsInterface {
  file: FileModel, 
  key: number, 
  loading: boolean
}

export default function FileBlock(props: PropsInterface) {
  function getIcon(): string {
    return props.file.icon ? props.file.icon : `${iconsPath}${getFileIcon(props.file.is_dir, props.file.type)}`;
  }

  return (
    <FileCont href={props.file.href}>
      <FileIcon style={{ backgroundImage: `url('${getIcon()}')` }}>
        {props.loading && <FileLoading />}
      </FileIcon>
      <FileName>{props.file.name}</FileName>
    </FileCont>
  )
}
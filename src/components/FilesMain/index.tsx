import { FileModel } from "../../services/models/FilesModel"
import FileBlock from "./FileBlock";
import { LoadingCont, Panel, Text } from "./styles";

interface PropsInterface {
  files: Array<FileModel> | null, 
  text: string|null, 
  search?: string, 
  fileLoading: number
}

export default function FilesMain(props: PropsInterface) {
  var text = props.text;
  if (props.files?.length == 0 ?? false)
    text = "Essa pasta está vazia!"

  return (
    <Panel>
      {
        text ? <Text>{text}</Text> : 
        props.files === null ? <LoadingCont /> :

        props.files.map((file: FileModel, index: number) => (
        (!props.search || file.name.toLowerCase().includes(props.search.toLowerCase())) && 
          <FileBlock file={file} key={index} loading={props.fileLoading == index} />
        ))
      }
    </Panel>
  )
}
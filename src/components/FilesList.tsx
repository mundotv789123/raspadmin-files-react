import styled from "styled-components"
import { FileModel } from "../services/models/FilesModel";

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const FileRow = styled.a`
  padding: 12px;
  font-weight: 600;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`

export default function FilesList(props: { files: Array<FileModel> }) {
  if (!props.files)
    return <Column />

  return (
    <Column>
      {props.files.map((file: FileModel, index: number) =>
        <FileRow key={index} href={file.href}>{file.name}</FileRow>
      )}
    </Column>
  )
}
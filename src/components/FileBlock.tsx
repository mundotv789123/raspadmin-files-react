import styled, { keyframes } from "styled-components"
import { FileModel } from "../services/models/FilesModel";
import { getFileIcon } from "../helpers/FileTypeHelper";

const iconsPath = "/img/icons/";

const FileCont = styled.a`
  height: 130px;
  margin: 5px;
  text-align: center;
  overflow: hidden;
  font-weight: 600;
  word-wrap: break-word;
  text-shadow: 0 1px 5px black;
  transition: background-color 0.5s;
  border-radius: 5px;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    overflow: inherit;
    z-index: 1;
    transition: background-color 0.1s;
  }
`

const FileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 5px auto;
  border-radius: 5px;
  background-size: cover;
  background-position: center;
`

const Name = styled.p`
  text-align: center;
  font-weight: bold;
`
const Spin = keyframes`
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
`

const Loading = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: solid 5px transparent;
  border-top: solid 5px cyan;
  animation: ${Spin} 500ms linear infinite;
`

export default function FileBlock(props: { file: FileModel, key: number, loading: boolean }) {
  return (
    <FileCont href={props.file.href}>
      <FileIcon style={{ backgroundImage: "url('" + (props.file.icon ? props.file.icon : (iconsPath + getFileIcon(props.file.is_dir, props.file.type))) + "')" }}>
        {props.loading && <Loading />}
      </FileIcon>
      <Name>{props.file.name}</Name>
    </FileCont>
  )
}
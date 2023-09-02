import styled from "styled-components"
import FileRow from "./FileRow"
import { FileModel } from "../services/models/FilesModel";

const Column = styled.div`
    display: flex;
    flex-direction: column;
`

export default function FilesList(props: {files: Array<FileModel>}) {
    if (props.files) {
        let c = 0;
        return (
            <Column>
                {props.files.map((file: any) => {
                    return <FileRow key={++c} src={file.href} />
                })}
            </Column>
        )
    }
    return <Column />
}
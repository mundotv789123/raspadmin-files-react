import styled from "styled-components"
import FileBlock from "./FileBlock"
import Loading from "./Loading"
import { FileModel } from "../services/models/FilesModel"

const Panel = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    padding: 10px;
    text-align: center;
    align-content: start;
    & a {
        width: calc(20% - 10px);
    }
    @media(min-width:1400px) {
        & a {
            width: calc(14.2% - 10px);
        }
    }
    @media(max-width:680px) {
        & a {
            width: calc(50% - 10px);
        }
    }
`

const Text = styled.h1`
    color: white;
    text-align: center;
    width: 100%;
`

export default function FilesBlock(props: { files: Array<FileModel> | null, text: string, search?: string, fileLoading: number }) {
    var text = props.text;
    if (props.files?.length == 0 ?? false)
        text = "Essa pasta está vazia!"

    return (
        <Panel>
            {props.files === null ? <Loading /> : text ? <Text>{text}</Text> :
                props.files.map((file: FileModel, index: number) => {
                    return <>{(!props.search || file.name.toLowerCase().includes(props.search.toLowerCase())) && <FileBlock file={file} key={index} loading={props.fileLoading == index}/>}</>
                })
            }
        </Panel>
    )
}
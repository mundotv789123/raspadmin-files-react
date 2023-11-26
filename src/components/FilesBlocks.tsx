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
    if (props.files?.length == 0 ?? false)
        props.text = "Essa pasta está vazia!"

        console.log(props.fileLoading);
    return (
        <Panel>
            {props.files === null ? <Loading /> : props.text ? <Text>{props.text}</Text> :
                props.files.filter(f => !props.search || f.name.toLowerCase().includes(props.search.toLowerCase())).map((file: FileModel, index: number) => {
                    return <FileBlock file={file} key={index} loading={props.fileLoading == index}/>
                })
            }
        </Panel>
    )
}
import styled from "styled-components"
import FileBlock from "./FileBlock"
import Loading from "./Loading"

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
            width: calc(25% - 10px);
        }
    }
    @media(max-width:380px) {
        & a {
            width: calc(30% - 2px);
        }
    }
`

const Text = styled.h1`
    color: white;
    text-align: center;
    width: 100%;
`

export default function FilesBlock(props) {
    if (props.text) {
        return(
            <Panel>
                <Text>{props.text}</Text>
            </Panel>
        )
    }
    if (props.files === null) {
        return (
            <Panel>
                <Loading />
            </Panel>
        )
    }
    if (props.files.length === 0) {
        <Panel>
            <h1>Pasta vazia</h1>
        </Panel>
    }
    let key = 0;
    return (
        <Panel>
            {props.files.map((file: any) => {
                return <FileBlock key={++key} src={file.url} dir={file.is_dir} icon={file.icon}/>
            })}
        </Panel>
    )
}
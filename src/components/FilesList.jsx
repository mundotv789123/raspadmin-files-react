import styled from "styled-components"
import FileRow from "./FileRow"

const Column = styled.div`
    display: flex;
    flex-direction: column;
`

export default function FilesList(props) {
    if (props.files) {
        return (
            <Column>
                {props.files.map((file) => {
                    return <FileRow src={file.url}/>
                })}
            </Column>
        )
    }
    return <Column/>
}
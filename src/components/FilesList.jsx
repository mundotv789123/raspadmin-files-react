import styled from "styled-components"
import FileRow from "./FileRow"

const Column = styled.div`
    display: flex;
    flex-direction: column;
`

export default function FilesList(props) {
    if (props.files) {
        let c = 0;
        return (
            <Column>
                {props.files.map((file) => {
                    return <FileRow key={++c} src={file.url}/>
                })}
            </Column>
        )
    }
    return <Column/>
}
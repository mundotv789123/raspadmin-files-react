import styled from "styled-components";

const Row = styled.a `
    padding: 12px;
    font-weight: 600;
    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
`

export default function FileRow(props) {
    const srcSplited = props.src.split("/");
    const fileName = srcSplited[srcSplited.length - 1];
    return (
        <Row href={props.src}>
            {fileName.substr(0, 16)+(fileName.length > 16 ? '...' : '')}
        </Row>
    )
}
import styled from "styled-components";

const Row = styled.a `
    padding: 12px;
    font-weight: 600;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
`

export default function FileRow(props: {src: string}) {
    const srcSplited = props.src.split("/");
    const fileName = srcSplited[srcSplited.length - 1];
    return (
        <Row href={props.src}>
            {fileName}
        </Row>
    )
}
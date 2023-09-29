import styled from "styled-components";

const PlayListContent = styled.div`
    background-color: rgba(0, 0, 0, 0.4);
    height: 150px;
    margin-bottom: -10px;
    padding-bottom: 15px;
    border-radius: 15px 15px 0 0;
    overflow: hidden;
    transition: 500ms;
`

const PlaylistHeader = styled.div`
    padding: 10px;
    text-align: center;
    border-radius: 15px 15px 0 0;
    background-color: rgba(0, 0, 0, 0.2);
`

export default function PlayList(props: { open: boolean }) {
    return (
        <PlayListContent style={!props.open ? {height: 0, padding: 0} : {}}>
            <PlaylistHeader>
                <h3>Lista de músicas</h3>
            </PlaylistHeader>
            <h1>Playlist aqui!</h1>
        </PlayListContent>
    );
}
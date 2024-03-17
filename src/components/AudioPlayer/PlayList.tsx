import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled from "styled-components";

const PlayListContent = styled.div`
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.35);
    border: solid 1px gray;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    height: 200px;
    margin-top: 20px;
    margin-bottom: -10px;
    padding-bottom: 15px;
    border-radius: 15px 15px 0 0;
    overflow-y: hidden;
    transition: height 500ms;
`

const PlaylistHeader = styled.div`
    padding: 10px;
    text-align: center;
    border-radius: 15px 15px 0 0;
    background-color: rgba(0, 0, 0, 0.2);
    overflow-y: hidden;
`

const MusicCol = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    height: 100%;
`

const MusicRow = styled.div`
    display: flex;
    & p {
        display: block;
        background-color: transparent;
        border: none;
        color: white;
        font-weight: 600;
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
        font-size: 11pt;
        padding: 5px;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
`

export default function PlayList(props: { open: boolean, playlist: Array<string>, onClick?: ((index: number) => void), playing?: number }) {

    const [playing, setPlaying] = useState(null);

    function playSong(index: number) {
        if (props.onClick) {
            props.onClick(index);
        }
    }

    useEffect(() => {
        setPlaying(props.playing);
    }, [props.playing])

    return (
        <PlayListContent style={!props.open ? { height: 0, padding: 0 } : {}}>
            <PlaylistHeader>
                <h3>Lista de músicas</h3>
            </PlaylistHeader>
            <MusicCol>
                {props.playlist.map((name, index) =>
                    <MusicRow key={index} onClick={() => playSong(index)}>
                        <p>{index + 1}. {name}</p> 
                        {playing != null && index == playing && <FontAwesomeIcon icon={faVolumeUp} style={{ margin: 'auto 5px auto auto' }} />}
                    </MusicRow>
                )}
            </MusicCol>
        </PlayListContent>
    );
}
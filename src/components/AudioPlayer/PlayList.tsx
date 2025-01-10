import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const ShowElement = keyframes`
  from {
    transform: translateX(100%);
  }
`

const PlayListContent = styled.div`
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.7);
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 110px);
  width: 550px;
  max-width: 100%;
  overflow-y: hidden;
  margin-left: auto;
  top: 0;
  right: 0;
  position: fixed;
  animation: ${ShowElement} 200ms linear normal;
`

const PlaylistHeader = styled.div`
  padding: 10px;
  text-align: center;
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
interface PropsInterface {
  open: boolean, 
  playlist: Array<string>, 
  playing?: number
  onClick?: ((index: number) => void)
}

export default function PlayList(props: PropsInterface) {
  const [playing, setPlaying] = useState<number|null>(null);

  function playSong(index: number) {
    if (props.onClick) {
      props.onClick(index);
    }
  }

  useEffect(() => {
    setPlaying(props.playing ?? null);
  }, [props.playing])

  if (!props.open) {
    return <></>;
  }

  return (
    <PlayListContent>
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
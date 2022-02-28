import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFastForward, faPlay, faVolumeUp, faExpand, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import styled, { keyframes } from "styled-components";

const VideoCont = styled.div`
    display: flex;
    background-color: black;
    color: white;
    overflow: hidden;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`

const Video = styled.video`
    width: 100%;
    height: 100%;
    margin: auto;
`

const VideoMain = styled.div`
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    display: flex;
    flex-direction: column;
    transition: 0.5s;
`

const VideoTop = styled.div`
    padding: 15px;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
    user-select: none;
`

const VideoTitle = styled.h1`
    text-align: center;
`

const VideoCenter = styled.div`
    height: 100%;
    display: flex;
`

const VideoLoadingSpin = keyframes`
    to {
        transform: rotate(0);
    }
    from {
        transform: rotate(-360deg);
    }
`

const VideoLoading = styled.div`
    margin: auto;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    border: solid 10px transparent;
    border-left-color: white;
    animation: ${VideoLoadingSpin} 0.7s linear infinite;
`

const VideoBottom = styled.div`
    padding: 10px;
    display: flex;
    background-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8));
`

const VideoButton = styled.button`
    background-color: transparent;
    border: none;
    color: white;
    font-size: 13pt;
    margin: 0 5px;
    font-size: 20px;
    text-align: center;
    &:hover {
        color: lightgray;
        transform: translateY(-1px);
    }
`

const VideoProgressBar = styled.div`
    width: 100%;
    margin: auto 5px;
    background: rgb(100,100,100);
    height: 7px;
    border-radius: 5px;
`

export default function VideoPlayer(props) {
    if (!props.src) {
        return <></>
    }
    const srcSplited = props.src.split("/")
    const fileName = srcSplited[srcSplited.length - 1];
    return (
        <VideoCont>
            <Video src={props.src} controls={false}></Video>
            <VideoMain>
                <VideoTop>
                    <VideoTitle>{fileName}</VideoTitle>
                    <VideoButton style={{ position: 'absolute', top: 0, left: 0, margin: '10px 15px' }}><FontAwesomeIcon icon={faAngleLeft}/></VideoButton>
                </VideoTop>
                <VideoCenter>
                    <VideoLoading/>
                </VideoCenter>
                <VideoBottom>
                    <VideoButton><FontAwesomeIcon icon={faPlay}/></VideoButton>
                    <VideoProgressBar />
                    <VideoButton><FontAwesomeIcon icon={faVolumeUp}/></VideoButton>
                    <VideoButton><FontAwesomeIcon icon={faFastForward}/></VideoButton>
                    <VideoButton><FontAwesomeIcon icon={faExpand}/></VideoButton>
                </VideoBottom>
            </VideoMain>
        </VideoCont>
    );
}
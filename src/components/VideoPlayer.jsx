import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFastForward, faPlay, faVolumeUp, faExpand, faAngleLeft, faPause } from "@fortawesome/free-solid-svg-icons";
import styled, { keyframes } from "styled-components";
import { useEffect } from "react";

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

const VideoCloseButton = styled.a`
    background-color: transparent;
    border: none;
    color: white;
    font-size: 13pt;
    font-size: 20px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    margin: 10px 15px; 
    &:hover {
        color: lightgray;
        transform: translateY(-1px);
    }
`

const VideoProgress = styled.div`
    width: 100%;
    margin: auto 5px;
    background: rgb(100,100,100);
    height: 7px;
    border-radius: 5px;
    overflow: hidden;
`

const VideoProgressBar = styled.div`
    background-color: white;
    height: 100%;
`

function registerControlsEvents(video, videoCenter, playButton, pauseButton) {
    /* video events */
    video.oncanplay = () => {
        loading.style.display = 'none';
    }

    /* play events */
    video.onplay = () => {
        playButton.style.display = 'none';
        pauseButton.style.display = '';
    }
    video.onpause = () => {
        playButton.style.display = '';
        pauseButton.style.display = 'none';
    }
    pauseButton.style.display = 'none';
    
    /* buttons event */
    playButton.onclick = () => {
        video.play();
    }
    pauseButton.onclick = () => {
        video.pause();
    }
    videoCenter.onclick = () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
}

function registerProgressEvents(video, progressMain, progress) {
    progressMain.onclick = (e) => {
        let rect = progressMain.getBoundingClientRect();
        let percent = ((e.x - rect.left) * 100 / (rect.right - rect.left)).toFixed(2);
        video.currentTime = (video.duration / 100 * percent);
        progress.style.width = percent+'%';
    }
    video.ontimeupdate = () => {
        let percent = (video.currentTime * 100 / video.duration).toFixed(3);
        progress.style.width = percent+'%';
    }
}

export default function VideoPlayer(props) {
    useEffect(() => {
        var video = document.getElementById('video');
        if (video !== null) {
            registerControlsEvents(
                video,
                document.getElementById('videoCenter'),
                document.getElementById('playButton'),
                document.getElementById('pauseButton')
            )
            registerProgressEvents(
                video,
                document.getElementById('progressMain'),
                document.getElementById('progress')
            )
        }
    })

    if (!props.video) {
        return <></>
    }

    let srcSplited = props.video.src.split("/")
    const fileName = srcSplited[srcSplited.length - 1];

    return (
        <VideoCont>
            <Video src={props.video.src} controls={false} id={"video"}></Video>
            <VideoMain>
                <VideoTop>
                    <VideoTitle>{fileName}</VideoTitle>
                    <VideoCloseButton style={{ display: (props.video.backUrl ? '' : 'none') }} href={props.video.backUrl}><FontAwesomeIcon icon={faAngleLeft}/></VideoCloseButton>
                </VideoTop>
                <VideoCenter id={"videoCenter"}>
                    <VideoLoading id={"loading"}/>
                </VideoCenter>
                <VideoBottom>
                    <VideoButton id={"playButton"}><FontAwesomeIcon icon={faPlay}/></VideoButton>
                    <VideoButton id={"pauseButton"}><FontAwesomeIcon icon={faPause}/></VideoButton>
                    <VideoProgress id={"progressMain"}><VideoProgressBar id={"progress"}/></VideoProgress>
                    <VideoButton><FontAwesomeIcon icon={faVolumeUp}/></VideoButton>
                    <VideoButton><FontAwesomeIcon icon={faFastForward}/></VideoButton>
                    <VideoButton><FontAwesomeIcon icon={faExpand}/></VideoButton>
                </VideoBottom>
            </VideoMain>
        </VideoCont>
    );
}
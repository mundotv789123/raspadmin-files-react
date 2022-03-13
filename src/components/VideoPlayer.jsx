import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFastForward, faPlay, faVolumeUp, faExpand, faAngleLeft, faPause } from "@fortawesome/free-solid-svg-icons";
import styled, { keyframes } from "styled-components";
import md5 from "md5";
import { useRef, useState } from "react";

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

const VideoElement = styled.video`
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
    opacity: 0;
    cursor: none;
    transition-delay: 3s;
    &:hover {
        transition-delay: 0s;
        opacity: 100;
        cursor: default;
    }
`

const VideoTop = styled.div`
    color: white;
    padding: 15px;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
    user-select: none;
`

const VideoTitle = styled.h1`
    text-align: center;
    margin: 0;
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
    width: 28px;
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
    display: flex;
`

const VideoProgressBar = styled.div`
    background-color: white;
    height: 100%;
    border-radius: 5px 0 0 5px;
`

const VideoProgressBarPin = styled.div`
    border: solid 7px white;
    top: -3px;
    margin: auto 0;
    position: relative;
    border-radius: 50%;
`

export default function VideoPlayer(props) {
    /* states */
    const [buttonPlayIcon, setButtonPlayIcon] = useState(faPlay)
    const [progressPercent, setProgressPercent] = useState(0)
    const [loading, setLoading] = useState(true)

    /* refs */
    const main_element = useRef(null);
    const video_element = useRef(null);
    const progress_bar = useRef(null);

    /* functions */
    function togglePauseVideo() {
        if (video_element.current.paused) {
            video_element.current.play();
        } else {
            video_element.current.pause();
        }
        setLoading(false);
    }

    function togglePauseButton() {
        if (video_element.current.paused) {
            setButtonPlayIcon(faPlay)
        } else {
            setButtonPlayIcon(faPause)
        }
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            main_element.current.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    function updateProgress() {
        let percent = (video_element.current.currentTime * 100 / video_element.current.duration);
        setProgressPercent(percent);
    }

    function updateVideoTime(event) {
        let rect = progress_bar.current.getBoundingClientRect();
        let percent = ((event.clientX - rect.left) * 100 / (rect.right - rect.left));
        video_element.current.currentTime = (video_element.current.duration / 100 * percent);
        setProgressPercent(percent);
    }

    function resetVideo() {
        video_element.current.src = null;
        setButtonPlayIcon(faPlay);
        setProgressPercent(0);
        setLoading(true);
    }

    if (props.src == null) {
        return <></>
    }

    /* video name */
    let srcSplited = props.src.split("/")
    const fileName = srcSplited[srcSplited.length - 1];

    return (
        <VideoCont ref={main_element}>
            <VideoElement onStop={resetVideo} onPlay={togglePauseButton} onPause={togglePauseButton} onTimeUpdate={updateProgress} onCanPlay={() => setLoading(false)} src={props.src} autoPlay={true} controls={false} ref={video_element}></VideoElement>
            <VideoMain>
                <VideoTop>
                    <VideoTitle>{fileName}</VideoTitle>
                    <VideoCloseButton style={{ display: (props.backUrl ? '' : 'none') }} href={props.backUrl} onClick={resetVideo}><FontAwesomeIcon icon={faAngleLeft} /></VideoCloseButton>
                </VideoTop>
                <VideoCenter onClick={togglePauseVideo}>
                    <VideoLoading style={{ display: (loading ? '' : 'none') }} />
                </VideoCenter>
                <VideoBottom>
                    <VideoButton onClick={togglePauseVideo}><FontAwesomeIcon icon={buttonPlayIcon} /></VideoButton>
                    <VideoProgress onClick={(e) => updateVideoTime(e)} ref={progress_bar}><VideoProgressBar style={{ width: `${progressPercent}%` }} /><VideoProgressBarPin /></VideoProgress>
                    <VideoButton><FontAwesomeIcon icon={faVolumeUp} /></VideoButton>
                    <VideoButton onClick={toggleFullScreen}><FontAwesomeIcon icon={faExpand} /></VideoButton>
                </VideoBottom>
            </VideoMain>
        </VideoCont>
    );
}
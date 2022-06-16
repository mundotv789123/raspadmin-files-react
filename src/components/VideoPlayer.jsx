import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faVolumeUp, faExpand, faAngleLeft, faPause } from "@fortawesome/free-solid-svg-icons";
import styled, { keyframes } from "styled-components";
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

const VideoTitle = styled.h2`
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

const VideoVolume = styled.div`
    border-radius: 10px;
    overflow: show;
    display: flex;
    flex-direction: column;
    transition: 320ms;
    & .volume {
        height: 100%;
        width: 10px;
        background-color: #999;
        margin: 0 auto;
        border-radius: 15px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    & .volume .volume_percent {
        width: 100%;
        margin-top: auto;
        background-color: white;
        transition: all 0.2s ease 0s;
    }
    &:hover {
        background-color: #444;
        padding: 10px 0 5px 0;
        margin-top: -105px;
    }
    & button {
        margin: 0 !important; 
    }
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
    const volume = useRef(null);
    const volume_percent = useRef(null);

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

    function updateVolume(event) {
        let rect = volume.current.getBoundingClientRect();
        let value = ((rect.bottom - event.clientY) * 1.0 / (rect.bottom - rect.top));
        video_element.current.volume = value;
        volume_percent.current.style.height = (value * 100) + '%';
    }

    function resetVideo() {
        video_element.current.src = null;
        setButtonPlayIcon(faPlay);
        setProgressPercent(0);
        setLoading(true);
    }

    function playVideo() {
        volume_percent.current.style.height = (video_element.current.volume * 100) + '%';
        setLoading(false);
    }

    if (props.src == null) {
        return <></>
    }

    /* video name */
    let srcSplited = props.src.split("/")
    const fileName = decodeURI(srcSplited[srcSplited.length - 1]);

    return (
        <VideoCont ref={main_element}>
            <VideoElement onStop={resetVideo} onPlay={togglePauseButton} onPause={togglePauseButton} onTimeUpdate={updateProgress} onCanPlay={() => playVideo()} src={props.src} autoPlay={true} controls={false} ref={video_element}></VideoElement>
            <VideoMain>
                <VideoTop>
                    <VideoTitle>{fileName.substring(0, 32) + (fileName.length > 32 ? '...' : '')}</VideoTitle>
                    <VideoCloseButton style={{ display: (props.backUrl ? '' : 'none') }} href={props.backUrl} onClick={resetVideo}><FontAwesomeIcon icon={faAngleLeft} /></VideoCloseButton>
                </VideoTop>
                <VideoCenter onClick={togglePauseVideo}>
                    <VideoLoading style={{ display: (loading ? '' : 'none') }} />
                </VideoCenter>
                <VideoBottom>
                    <VideoButton onClick={togglePauseVideo}><FontAwesomeIcon icon={buttonPlayIcon} /></VideoButton>
                    <VideoProgress onClick={(e) => updateVideoTime(e)} ref={progress_bar}><VideoProgressBar style={{ width: `${progressPercent}%` }} /><VideoProgressBarPin /></VideoProgress>
                    <VideoVolume><div className="volume" ref={volume} onClick={(e) => { updateVolume(e) }}><div className="volume_percent" ref={volume_percent}></div></div><VideoButton><FontAwesomeIcon icon={faVolumeUp} /></VideoButton></VideoVolume>
                    <VideoButton onClick={toggleFullScreen}><FontAwesomeIcon icon={faExpand} /></VideoButton>
                </VideoBottom>
            </VideoMain>
        </VideoCont>
    );
}
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faVolumeUp, faExpand, faAngleLeft, faPause } from '@fortawesome/free-solid-svg-icons'
import styled, { keyframes } from "styled-components";
import { useRef, useState } from "react";
import md5 from "md5";

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
    padding: 2px 0;
    display: flex;
    & .background {
        width: 100%;
        margin: auto 5px;
        background: rgb(100,100,100);
        height: 7px;
        border-radius: 5px;
        display: flex;
    }
    &:hover .follower {
        opacity: 100;
    }
`

const VideoProgressBar = styled.div`
    background-color: white;
    height: 100%;
    border-radius: 5px 0 0 5px;
    display: flex;
    z-index: 1;
    &::after {
        content: "";
        display: block;
        border: solid 7px white;
        top: -3px;
        margin-right: -5px;
        margin-left: auto;
        position: relative;
        border-radius: 50%;
    }
`

const VideoProgressFollower = styled.div`
    border-radius: 5px 0px 0px 5px;
    height: 100%;
    width: 50%;
    position:;
    background-color: gray;
    display: flex;
    opacity: 0;
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

export function getVideoTime(url) {
    if (!localStorage['videos']) {
        localStorage['videos'] = JSON.stringify({});
        return 0;
    }
    let videos = JSON.parse(localStorage['videos']);
    let uuid = md5(url);
    return videos[uuid] ? videos[uuid] : 0;
}

export function setVideoTime(url, time) {
    if (time <= 0) {
        return;
    }
    let videos = localStorage['videos'] ? JSON.parse(localStorage['videos']) : {};
    let uuid = md5(url);
    videos[uuid] = parseFloat(time);
    localStorage['videos'] = JSON.stringify(videos);
}

export default function VideoPlayer(props) {
    /* states */
    const [buttonPlayIcon, setButtonPlayIcon] = useState(faPlay);
    const [progressPercent, setProgressPercent] = useState(0);
    const [progressFollowerPercent, setProgressFollerPercent]  = useState(0);
    const [loading, setLoading] = useState(true)

    /* refs */
    const main_element = useRef(null);
    const video_element = useRef(null);
    const progress_follower = useRef(null);
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

    function updateProgressFollower(event) {
        let rect = progress_bar.current.getBoundingClientRect();
        let percent = ((event.clientX - rect.left) * 100 / (rect.right - rect.left));
        setProgressFollerPercent(percent);
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
        if (!loading) {
            return;
        }
        volume_percent.current.style.height = (video_element.current.volume * 100) + '%';
        let videoTime = getVideoTime(video_element.current.src);
        if (videoTime > 0 && (video_element.current.duration - 15) > videoTime) {
            video_element.current.currentTime = videoTime;
        }
        setLoading(false);
        updateTime(true);
    }

    async function updateTime(loop = false) {
        if (!video_element.current || !video_element.current.src) {
            return;
        }
        setVideoTime(video_element.current.src, video_element.current.currentTime);
        if (loop) {
            setTimeout(() => {
                updateTime(true)
            }, 1000);
        }
    }

    if (props.src == null) {
        return <></>
    }

    /* video name */
    let srcSplited = props.src.split("/")
    const fileName = decodeURI(srcSplited[srcSplited.length - 1]);

    return (
        <VideoCont ref={main_element}>
            <VideoElement onPlay={togglePauseButton} onPause={togglePauseButton} onTimeUpdate={updateProgress} onCanPlay={() => playVideo()} src={props.src} autoPlay={true} controls={false} ref={video_element}></VideoElement>
            <VideoMain>
                <VideoTop>
                    <VideoTitle>{fileName.substring(0, 32) + (fileName.length > 32 ? '...' : '')}</VideoTitle>
                    <VideoCloseButton style={{ display: (props.backUrl ? '' : 'none') }} href={props.backUrl} onClick={resetVideo}>
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </VideoCloseButton>
                </VideoTop>
                <VideoCenter onClick={togglePauseVideo}>
                    <VideoLoading style={{ display: (loading ? '' : 'none') }} />
                </VideoCenter>
                <VideoBottom>
                    <VideoButton onClick={togglePauseVideo}>
                        <FontAwesomeIcon icon={buttonPlayIcon} />
                    </VideoButton>
                    <VideoProgress onClick={(e) => updateVideoTime(e)} onMouseMove={(e) => updateProgressFollower(e)} ref={progress_bar}>
                        <div className='background'>
                            <VideoProgressBar style={{ width: `${progressPercent}%` }} />
                            <VideoProgressFollower className='follower' style={{ marginLeft: `-${progressPercent}%`, width: `${progressFollowerPercent}%` }} ref={progress_follower} /> 
                        </div>
                    </VideoProgress>
                    <VideoVolume>
                        <div className="volume" ref={volume} onClick={(e) => { updateVolume(e) }}>
                            <div className="volume_percent" ref={volume_percent} />
                        </div>
                        <VideoButton>
                            <FontAwesomeIcon icon={faVolumeUp} />
                        </VideoButton>
                    </VideoVolume>
                    <VideoButton onClick={toggleFullScreen}>
                        <FontAwesomeIcon icon={faExpand} />
                    </VideoButton>
                </VideoBottom>
            </VideoMain>
        </VideoCont>
    );
}
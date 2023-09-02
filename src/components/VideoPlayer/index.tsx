import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faVolumeUp, faExpand, faAngleLeft, faPause } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from "react";
import md5 from "md5";
import { VideoBottom, VideoButton, VideoCenter, VideoCloseButton, VideoCont, VideoElement, VideoLoading, VideoMain, VideoProgress, VideoProgressBar, VideoProgressFollower, VideoTitle, VideoTop, VideoVolume } from './styles';

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
    const [progressFollowerPercent, setProgressFollerPercent] = useState(0);
    const [loading, setLoading] = useState(true)

    const main_element = useRef(null);
    const video_element = useRef(null);
    const progress_follower = useRef(null);
    const progress_bar = useRef(null);
    const volume = useRef(null);
    const volume_percent = useRef(null);

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
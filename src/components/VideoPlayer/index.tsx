import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faVolumeUp, faExpand, faAngleLeft, faPause } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from "react";
import { CenterButtonPlay, Error, VideoBottom, VideoButton, VideoCenter, VideoCloseButton, VideoCont, VideoElement, VideoLoading, VideoMain, VideoProgress, VideoProgressBar, VideoProgressFollower, VideoTitle, VideoTop, VideoVolume } from './styles';
import VideoService from '../../services/VideoService';

var cursorTimeout = 0;

export default function VideoPlayer(props: { src: string | undefined, backUrl: string | undefined }) {

    const [progressPercent, setProgressPercent] = useState(0);
    const [progressFollowerPercent, setProgressFollerPercent] = useState(0);

    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [error, setError] = useState(null);

    const main_element = useRef<HTMLDivElement>(null);
    const main_video = useRef<HTMLDivElement>(null);
    const progress_follower = useRef<HTMLDivElement>(null);
    const progress_bar = useRef<HTMLDivElement>(null);
    const volume = useRef<HTMLDivElement>(null);
    const volume_percent = useRef<HTMLDivElement>(null);
    const video_element = useRef<HTMLVideoElement>(null);

    const service = new VideoService();

    function resetCursorTimeout() {
        if (main_video.current.classList)
            main_video.current.classList.remove('hide');
        if (cursorTimeout <= 0)
            cursorTimeoutExec();
        cursorTimeout = 3;
    }

    function cursorTimeoutExec() {
        setTimeout(() => {
            cursorTimeout--;
            if (cursorTimeout > 0) {
                cursorTimeoutExec();
                return;
            }
            if (!main_video.current || video_element.current.paused)
                return;
            main_video.current.classList.add('hide');
        }, 1000);
    }

    function togglePauseVideo() {
        if (loading || error)
            return;
        resetCursorTimeout();
        if (playing) {
            video_element.current.pause();
        } else {
            video_element.current.play();
        }
        setError(false);
        setLoading(false);
    }

    function togglePauseButton() {
        setPlaying(!video_element.current.paused);
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            main_element.current.requestFullscreen();
            screen.orientation.lock('landscape');
        } else {
            document.exitFullscreen();
            screen.orientation.unlock();
        }
    }

    function updateProgress() {
        let percent = (video_element.current.currentTime * 100 / video_element.current.duration);
        setProgressPercent(percent);
    }

    function updateProgressFollower(event: any) {
        let rect = progress_bar.current.getBoundingClientRect();
        let percent = ((event.clientX - rect.left) * 100 / (rect.right - rect.left));
        setProgressFollerPercent(percent);
    }

    function updateError() {
        setLoading(false);
        setError(video_element.current.error.message);
    }

    function updateVideoTime(event: any) {
        if (loading || error)
            return;
        let rect = progress_bar.current.getBoundingClientRect();
        let percent = ((event.clientX - rect.left) * 100 / (rect.right - rect.left));
        video_element.current.currentTime = (video_element.current.duration / 100 * percent);
        setProgressPercent(percent);
    }

    function updateVolume(event: any) {
        let rect = volume.current.getBoundingClientRect();
        let value = ((rect.bottom - event.clientY) * 1.0 / (rect.bottom - rect.top));
        video_element.current.volume = value;
        volume_percent.current.style.height = (value * 100) + '%';
    }

    function resetVideo() {
        video_element.current.src = null;
        setPlaying(false);
        setProgressPercent(0);
        setLoading(true);
    }

    function playVideo() {
        if (!loading) {
            return;
        }
        volume_percent.current.style.height = (video_element.current.volume * 100) + '%';
        let videoTime = service.getVideoTime(video_element.current.src);
        if (videoTime > 0 && (video_element.current.duration - 15) > videoTime) {
            video_element.current.currentTime = videoTime;
        }
        setLoading(false);
        service.startAutoSaving(video_element.current.src, video_element.current);
    }

    if (props.src == null) {
        return <></>
    }

    /* get file name from url, ex: http://exemple.local/video/cool_video.mp4 -> cool_video */
    const fileName = decodeURIComponent(props.src)
        .replace(/\/+$/, '')
        .replace(/^([a-zA-Z]+:\/\/)?\/?([^\/]+\/)+/, '')
        .replace(/\.[a-zA-Z0-9]+$/, '');

    return (
        <VideoCont ref={main_element} onMouseMove={resetCursorTimeout}>
            <VideoElement
                onPlay={togglePauseButton}
                onPause={togglePauseButton}
                onTimeUpdate={updateProgress}
                onError={updateError}
                onCanPlay={playVideo}
                src={props.src}
                autoPlay={true}
                controls={false}
                ref={video_element}
            />
            <VideoMain ref={main_video}>
                <VideoTop>
                    <VideoTitle>{fileName}</VideoTitle>
                    <VideoCloseButton
                        style={{
                            display: (props.backUrl ? '' : 'none')
                        }}
                        href={props.backUrl}
                        onClick={resetVideo}
                    >
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </VideoCloseButton>
                </VideoTop>
                <VideoCenter>
                    {loading && <VideoLoading />}
                    {error && <Error>Erro ao carregar vídeo</Error>}
                    {(!loading && !error) && <CenterButtonPlay onClick={togglePauseVideo}><FontAwesomeIcon icon={(playing ? faPause : faPlay)} /></CenterButtonPlay>}
                </VideoCenter>
                <VideoBottom>
                    <VideoButton onClick={togglePauseVideo}>
                        <FontAwesomeIcon icon={(playing ? faPause : faPlay)} />
                    </VideoButton>
                    <VideoProgress
                        onClick={updateVideoTime}
                        onMouseMove={updateProgressFollower}
                        ref={progress_bar}
                    >
                        <div className='background'>
                            <VideoProgressBar style={{ width: `${progressPercent}%` }} />
                            <VideoProgressFollower
                                className='follower' style={{
                                    marginLeft: `-${progressPercent}%`,
                                    width: `${progressFollowerPercent}%`
                                }}
                                ref={progress_follower}
                            />
                        </div>
                    </VideoProgress>
                    <VideoVolume>
                        <div className="volume" ref={volume} onClick={updateVolume}>
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
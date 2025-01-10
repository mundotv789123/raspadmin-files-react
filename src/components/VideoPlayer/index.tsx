import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faVolumeUp, faExpand, faAngleLeft, faPause, faRotateRight, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { MouseEvent, useMemo, useRef, useState } from "react";
import { CenterButtons, Error, VideoBottom, VideoButton, VideoCenter, VideoCloseButton, VideoCont, VideoElement, VideoLoading, VideoMain, VideoProgress, VideoTitle, VideoTop, VideoVolume } from './styles';
import VideoService from '../../services/VideoService';
import Range from '../../elements/range';
import { srcToFileName } from '../../helpers/ConverterHelper';

let cursorTimeout = 0;

interface VideoControl {
  playing: boolean
}

interface VideoProps {
  duration: number,
  currentTime: number,
  volume: number
}

interface PropsInterface {
  src: string | null,
  backUrl: string | null
}

interface VideoScreenOrientation extends ScreenOrientation {
  lock?(a: string): Promise<void>
}

export default function VideoPlayer(props: PropsInterface) {
  const [controls, setControls] = useState<VideoControl>({
    playing: false
  });

  const [videoProps, setVideoProps] = useState<VideoProps>({
    duration: 0,
    currentTime: 0,
    volume: 0
  });

  const progressPercent = useMemo(() => (videoProps.currentTime * 100 / videoProps.duration), [videoProps.currentTime]);
  const playPauseIcon = useMemo(() => controls.playing ? faPause : faPlay, [controls.playing]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoContElement = useRef<HTMLDivElement>(null);
  const videoMainElement = useRef<HTMLDivElement>(null);
  const volumeElement = useRef<HTMLDivElement>(null);
  const videoElement = useRef<HTMLVideoElement>(null);

  const service = new VideoService();

  function resetCursorTimeout() {
    if (videoMainElement.current!.classList)
      videoMainElement.current!.classList.remove('hide');
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
      if (!videoMainElement.current || videoElement.current!.paused)
        return;
      videoMainElement.current.classList.add('hide');
    }, 1000);
  }

  function togglePauseVideo() {
    if (loading || error)
      return;
    resetCursorTimeout();
    if (controls.playing) {
      videoElement.current!.pause();
    } else {
      videoElement.current!.play();
    }
    setError(null);
    setLoading(false);
  }

  function togglePauseButton() {
    setControls(prev => ({ ...prev, playing: !videoElement.current!.paused }));
  }

  function toggleFullScreen() {
    const orientation = screen.orientation as VideoScreenOrientation;
    if (!document.fullscreenElement) {
      videoContElement.current!.requestFullscreen();
      if (orientation.lock)
        orientation.lock('landscape');
    } else {
      document.exitFullscreen();
      orientation.unlock();
    }
  }

  function updateError() {
    setLoading(false);
    setError(videoElement.current!.error!.message);
  }

  function updateVideoTime(percent: number) {
    if (loading || error)
      return false;
    videoElement.current!.currentTime = (videoElement.current!.duration / 100 * percent);
    return true;
  }

  function updateVolume(event: MouseEvent<HTMLDivElement>) {
    const rect = volumeElement.current!.getBoundingClientRect();
    const value = ((rect.bottom - event.clientY) * 1.0 / (rect.bottom - rect.top));
    videoElement.current!.volume = value;
    setVideoProps(prev => ({ ...prev, volume: videoElement.current!.volume }));
  }

  function resetVideo() {
    videoElement.current!.src = "";
    setControls(prev => ({ ...prev, playing: false }));
    videoElement.current!.currentTime = 0;
    setLoading(true);
  }

  function playVideo() {
    if (!loading) {
      return;
    }

    const videoTime = service.getVideoTime(videoElement.current!.src);
    if (videoTime > 0 && (videoElement.current!.duration - 15) > videoTime) {
      videoElement.current!.currentTime = videoTime;
    }

    setVideoProps({
      currentTime: videoElement.current!.currentTime,
      duration: videoElement.current!.duration,
      volume: videoElement.current!.volume
    });

    setLoading(false);
    service.startAutoSaving(videoElement.current!.src, videoElement.current!);
  }

  function forward() {
    videoElement.current!.currentTime += 5;
  }

  function backward() {
    videoElement.current!.currentTime -= 5;
  }

  if (props.src == null) {
    return <></>
  }

  const fileName = srcToFileName(decodeURIComponent(props.src));

  return (
    <VideoCont ref={videoContElement} onMouseMove={resetCursorTimeout}>
      <VideoElement
        onPlay={togglePauseButton}
        onPause={togglePauseButton}
        onTimeUpdate={(e) => setVideoProps((prev) => ({ ...prev, currentTime: (e.target as HTMLVideoElement | null)?.currentTime ?? 0 }))}
        onError={updateError}
        onCanPlay={playVideo}
        src={props.src}
        autoPlay={true}
        controls={false}
        ref={videoElement}
      />
      <VideoMain ref={videoMainElement}>
        <VideoTop>
          <VideoTitle>{fileName}</VideoTitle>
          {props.backUrl && (
            <VideoCloseButton href={props.backUrl} onClick={resetVideo}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </VideoCloseButton>
          )}
        </VideoTop>
        <VideoCenter>
          {loading && <VideoLoading />}
          {error && <Error>Erro ao carregar vídeo</Error>}
          {(!loading && !error) && (
            <CenterButtons>
              <button className='buttonSmall' onClick={backward}>
                <FontAwesomeIcon icon={faRotateLeft} />
              </button>
              <button className='buttonBig' onClick={togglePauseVideo}>
                <FontAwesomeIcon icon={playPauseIcon} />
              </button>
              <button className='buttonSmall' onClick={forward}>
                <FontAwesomeIcon icon={faRotateRight} />
              </button>
            </CenterButtons>
          )}
        </VideoCenter>
        <VideoBottom>
          <VideoButton onClick={togglePauseVideo}>
            <FontAwesomeIcon icon={playPauseIcon} />
          </VideoButton>
          <VideoProgress>
            <Range percent={progressPercent} onInput={updateVideoTime} follower={true} step='0.25' />
          </VideoProgress>
          <VideoVolume>
            <div className="volume" ref={volumeElement} onClick={updateVolume}>
              <div className="volume_percent" style={{ height: `${(videoProps.volume * 100)}%` }} />
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
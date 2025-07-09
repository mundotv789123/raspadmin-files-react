import Range from "@/components/elements/range-element";
import { FileDTO } from "@/services/models/files-model";
import { faBackwardFast, faBars, faClock, faExpand, faForwardFast, faPause, faPlay, faRotateBack, faVolumeHigh, faVolumeMute, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faRotateForward } from "@fortawesome/free-solid-svg-icons/faRotateForward";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEvent, useEffect, useRef, useState } from "react";
import Playlist from "../file-playlist";
import { useLocalStorage } from "@/hooks/local-storange-hook";
import { SortFactory } from "@/services/strategies/order-by-strategies";
import { ThumbGenerator } from "@/components/elements/thumb-generator";
import fileUpdateEvent, { FileOpenEvent } from "@/events/FileUpdateEvent";

const isVideo = (type: string) => type.match(/video\/(mp4|webm|ogg|mkv)/);
const speedsSelector = [0.25, 0.50, 0.75, 1, 1.25, 1.50, 1.75, 2];

let cursorTimeout = 0;

interface VideoScreenOrientation extends ScreenOrientation {
  lock?(a: string): Promise<void>
}

type PropsType = {
  filesList?: Array<FileDTO>
}

export default function VideoPlayer({ filesList }: PropsType) {
  const [file, setFile] = useState<FileDTO | null>(null);
  const [playlist, setPlaylist] = useState<Array<FileDTO> | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoThumbRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const [videoControls, setVideoControls] = useLocalStorage<{
    muted: boolean,
    playlistOpened: boolean,
    volume: number,
    speed?: number
  }>("video-settings", {
    muted: false,
    playlistOpened: false,
    speed: 1,
    volume: .5
  });

  const [videoProps, setVideoProps] = useState<{
    loading: boolean,
    speedOpen: boolean,
    playing: boolean,
    duration: number,
    currentTime: number,
    thumbTime?: number,
  }>({
    loading: true,
    speedOpen: false,
    playing: true,
    duration: 0,
    currentTime: 0,
  });

  function resetCursorTimeout() {
    if (videoRef.current!.classList)
      controlsRef.current!.classList.remove('hidden');
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
      if (!videoRef.current || videoRef.current!.paused)
        return;
      controlsRef.current!.classList.add('hidden');
    }, 1000);
  }

  function handlerCloseFile() {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = '';
    }
    setFile(null);
  }

  function handlerCanPlay() {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.playbackRate = videoControls.speed ?? 1;
    videoRef.current.volume = videoControls.muted ? 0 : videoControls.volume;
    setVideoProps({
      loading: false,
      speedOpen: false,
      playing: !videoRef.current!.paused,
      duration: videoRef.current!.duration,
      currentTime: videoRef.current!.currentTime,
    });
  }

  function handlerUpdateTime() {
    if (!videoRef.current) {
      return;
    }
    setVideoProps(prev => ({
      ...prev,
      playing: !videoRef.current!.paused,
      currentTime: videoRef.current!.currentTime
    }));
  }

  function handlerThumbMouseMove(event: MouseEvent<HTMLDivElement>) {
    const dropdown = videoThumbRef.current;
    if (!dropdown)
      return;

    dropdown.classList.remove("hidden");

    const screenWidth = window.innerWidth;
    const dropdownWidth = dropdown.offsetWidth;

    let posX = event.pageX - (dropdownWidth / 2);

    if (posX <= 0) {
      posX = 0;
    }

    if (posX + dropdownWidth > screenWidth) {
      posX = screenWidth - dropdownWidth;
    }

    dropdown.style.left = posX + 'px';

    const rect = event.currentTarget.getBoundingClientRect();
    const percent = ((event.clientX - rect.left) * 100 / (rect.right - rect.left));
    const time = (videoProps.duration / 100 * percent);
    setVideoProps(props => ({ ...props, thumbTime: time }))
  }

  function handlerThumbMouseLeave() {
    const dropdown = videoThumbRef.current;
    if (!dropdown)
      return;
    dropdown.classList.add("hidden");
  }

  function handlerError() {
    const message = videoRef.current?.error?.message;
    setVideoProps((prev) => ({
      ...prev,
      loading: false,
      error: message ?? "Ocorreu um erro ao reproduzir áudio",
    }));
  }

  function updateVideoPercent(percent: number) {
    const time = videoProps.duration * (percent / 100);
    videoRef.current!.currentTime = time;
    return true;
  }

  function togglePlaylist() {
    resetCursorTimeout();
    setVideoControls(prev => ({ ...prev, playlistOpened: !prev.playlistOpened }))
  }

  function togglePlay() {
    if (!videoRef.current) {
      return;
    }
    setVideoProps(prev => ({ ...prev, playing: !prev.playing }))
  }

  function toggleFullScreen() {
    if (!containerRef.current) {
      return;
    }
    const orientation = screen.orientation as VideoScreenOrientation;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      if (orientation.lock)
        orientation.lock('landscape');
    } else {
      document.exitFullscreen();
      orientation.unlock();
    }
  }

  function nextVideo() {
    if (!file || !playlist) {
      return;
    }
    setVideoProps(prev => ({ ...prev, loading: true }));

    let nextVideo = 0;

    const fileE = playlist.filter(f => f.src == file.src);
    if (fileE.length == 1) {
      nextVideo = playlist.indexOf(fileE[0]);
      if (nextVideo + 1 >= playlist.length) {
        nextVideo = 0;
      } else {
        nextVideo++;
      }
    }

    setFile(playlist[nextVideo]);
  }

  function backVideo() {
    if (!file || !playlist) {
      return;
    }
    if (videoProps.currentTime >= 3) {
      videoRef.current!.currentTime = 0;
      return;
    }

    setVideoProps(prev => ({ ...prev, loading: true }));

    let backVideo = playlist.indexOf(file);
    if (backVideo <= 0) {
      backVideo = playlist.length - 1;
    } else {
      backVideo--;
    }
    setFile(playlist[backVideo]);
  }

  function forward() {
    videoRef.current!.currentTime += 5;
  }

  function backward() {
    videoRef.current!.currentTime -= 5;
  }

  useEffect(() => {
    const handlerOpen = (event: FileOpenEvent) => {
      if (!event.file.type || !isVideo(event.file.type)) {
        setFile(null);
        return;
      }

      event.eventCalled = true;
      setFile(event.file);
      if (filesList) {
        setPlaylist(filesList.filter(file => file.type && isVideo(file.type)))
      }
    }

    const changeFileSort = (sort: string) => {
      setPlaylist(playlist => playlist && SortFactory(sort).sort(playlist));
    }

    fileUpdateEvent.addListener("open", handlerOpen);
    fileUpdateEvent.addListener("change-sort", changeFileSort);
    return () => {
      fileUpdateEvent.removeListener("open", handlerOpen);
      fileUpdateEvent.removeListener("change-sort", changeFileSort);
    }
  }, [filesList])

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.playbackRate = videoControls.speed ?? 1;
    videoRef.current.volume = videoControls.muted ? 0 : videoControls.volume;
    if (videoProps.playing) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [videoControls, videoProps])

  return (
    file && <div className="fixed top-0 left-0 bottom-0 right-0 bg-black flex justify-center z-20" onMouseMove={resetCursorTimeout} ref={containerRef}>
      <video
        src={file.src}
        onError={handlerError}
        onCanPlay={handlerCanPlay}
        onTimeUpdate={handlerUpdateTime}
        className="h-full w-full"
        autoPlay
        ref={videoRef}
      />
      <div className="absolute w-full h-full grid grid-rows-[4rem_calc(100%_-10rem)_6rem]" ref={controlsRef}>
        <div className="flex px-2 bg-opacity-30 items-center bg-gradient-to-t from-transparent to-black/70">
          <button onClick={handlerCloseFile} className="text-2xl mx-2 absolute">
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <h1 className="text-2xl font-bold text-center w-full">{file.name}</h1>
        </div>
        <div className="flex justify-center items-center">
          {videoProps.loading ? <div className="w-24 h-24 border-8 rounded-full border-white border-t-transparent animate-spin" ></div> : <div className="text-2xl lg:text-5xl flex gap-8 items-center">
            <button className="rounded-full bg-black bg-opacity-30 w-14 h-14 lg:w-20 lg:h-20" onClick={backward}>
              <FontAwesomeIcon icon={faRotateBack} />
            </button>
            <button className="text-6xl lg:text-8xl rounded-full bg-black bg-opacity-30 w-24 h-24 lg:w-32 lg:h-32" onClick={togglePlay}>
              <FontAwesomeIcon icon={videoProps.playing ? faPause : faPlay} />
            </button>
            <button className="rounded-full bg-black bg-opacity-30 w-14 h-14 lg:w-20 lg:h-20" onClick={forward}>
              <FontAwesomeIcon icon={faRotateForward} />
            </button>
          </div>}
        </div>
        <div className="bg-opacity-30 flex flex-col px-4 justify-center bg-gradient-to-t from-black/70 to-transparent">
          <div className="w-full">
            <ThumbGenerator ref={videoThumbRef} src={file.src} time={videoProps.thumbTime} />
            <div className="w-full">
              <Range
                percent={videoProps.currentTime / videoProps.duration * 100}
                progressMouseFoller={true}
                onChange={updateVideoPercent}
                onMouseLeave={handlerThumbMouseLeave}
                onMouseMove={handlerThumbMouseMove}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 w-full px-2">
              <div className="hidden md:block"></div>
              <div className="flex text-3xl md:justify-center">
                <div className="flex gap-3">
                  <button>
                    <FontAwesomeIcon icon={faBackwardFast} onClick={backVideo} />
                  </button>
                  <button onClick={togglePlay}>
                    <FontAwesomeIcon icon={videoProps.playing ? faPause : faPlay} />
                  </button>
                  <button>
                    <FontAwesomeIcon icon={faForwardFast} onClick={nextVideo} />
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="flex text-2xl gap-2">
                  <div className="flex flex-col justify-center items-center">
                    {videoProps.speedOpen && <div className="absolute bg-zinc-700 p-2 text-sm flex flex-col font-bold bottom-20 rounded-lg gap-1">
                      {speedsSelector.map((sp, key) =>
                        <button
                          className={`px-8 py-1 hover:bg-zinc-400 rounded ${videoControls.speed == sp ? 'bg-slate-500' : ''}`}
                          key={key}
                          onClick={() => setVideoControls(prev => ({ ...prev, speed: sp }))}>
                          {sp.toLocaleString()}x
                        </button>
                      )}
                    </div>}
                    <button onClick={() => setVideoProps(prev => ({ ...prev, speedOpen: !prev.speedOpen }))}>
                      <FontAwesomeIcon icon={faClock} />
                    </button>
                  </div>
                  <button>
                    <FontAwesomeIcon icon={faExpand} onClick={toggleFullScreen} />
                  </button>
                  <div className="flex items-center gap-2">
                    <button>
                      <FontAwesomeIcon icon={videoControls.muted ? faVolumeMute : faVolumeHigh} onClick={() => setVideoControls(prev => ({ ...prev, muted: !prev.muted }))} />
                    </button>
                    <Range className="w-24" percent={videoControls.volume * 100} onChange={percent => { setVideoControls(prev => ({ ...prev, volume: percent / 100 })); return true }} />
                  </div>
                  <button onClick={togglePlaylist}>
                    <FontAwesomeIcon icon={faBars} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {playlist && <Playlist playlist={playlist} title="Lista de vídeos" onClick={(file) => { setVideoProps(prev => ({ ...prev, loading: true })); setFile(file) }} playing={file} classList={`fixed w-full h-full ${videoControls.playlistOpened ? '' : 'hidden'}`} onClose={togglePlaylist} />}
    </div>
  )
}
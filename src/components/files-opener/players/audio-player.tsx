import { useLocalStorage } from "@/hooks/local-storange-hook";
import Range from "@/components/elements/range-element";
import { FileDTO } from "@/services/models/files-model";
import {
  faBackwardFast,
  faBars,
  faEye,
  faEyeSlash,
  faForwardFast,
  faPause,
  faPlay,
  faRotateRight,
  faShuffle,
  faVolumeHigh,
  faVolumeMute,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef, useState } from "react";
import Playlist from "../file-playlist";
import Image from "next/image";
import { SortFactory } from "@/services/strategies/order-by-strategies";
import fileUpdateEvent, { FileOpenEvent } from "@/events/FileUpdateEvent";

const isAudio = (type: string) =>
  type.match(/audio\/(mpeg|mp3|ogg|(x-(pn-)?)?wav)/);

type PropsType = {
  filesList?: Array<FileDTO>;
};

export default function AudioPlayer({ filesList }: PropsType) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [file, setFile] = useState<FileDTO | null>(null);
  const [playlist, setPlaylist] = useState<Array<FileDTO> | null>(null);
  const [src, setSrc] = useState<string>();

  const [audioProps, setAudioProps] = useState<{
    duration: number;
    currentTime: number;
    playing: boolean;
    loading: boolean;
    error: string | null;
  }>({
    duration: 0,
    currentTime: 0,
    playing: false,
    loading: true,
    error: null,
  });

  const [audioControls, setAudioControls] = useLocalStorage<{
    muted: boolean;
    random: boolean;
    playlistOpened: boolean;
    hideTitle: boolean;
    volume: number;
  }>("audio-settings", {
    muted: false,
    random: false,
    playlistOpened: false,
    hideTitle: false,
    volume: 0.5,
  });

  const audioTimePercent = useMemo(
    () => audioProps.currentTime / audioProps.duration,
    [audioProps.duration, audioProps.currentTime]
  );
  const audioPlayList = useMemo(
    () =>
      audioControls.random && playlist
        ? playlist.map((a) => a).sort(() => Math.random() - 0.5)
        : playlist,
    [playlist, audioControls.random]
  );

  function handlerAudioLoaded() {
    if (!audioProps.loading) {
      return;
    }
    setAudioProps((prev) => ({
      ...prev,
      loading: false,
      playing: true,
      error: null,
      duration: audioRef.current!.duration,
    }));

    if (!navigator.mediaSession.metadata) {
      navigator.mediaSession.metadata = new MediaMetadata();
    }
    navigator.mediaSession.metadata.title = audioControls.hideTitle
      ? "Raspadmin Music Player"
      : file!.name;
    navigator.mediaSession.metadata.artwork = [
      {
        src:
          !file!.icon || audioControls.hideTitle
            ? "/img/icons/music.svg"
            : file!.icon,
      },
    ];
    navigator.mediaSession.metadata.album = file?.parent ?? "";
    navigator.mediaSession.setPositionState({
      duration: audioRef.current!.duration
    });

    navigator.mediaSession.setActionHandler("previoustrack", backSong);
    navigator.mediaSession.setActionHandler("nexttrack", nextSong);
    navigator.mediaSession.setActionHandler("seekto", function (details) {
      if (details.seekTime) {
        audioRef.current!.currentTime = details.seekTime;
      }
    });
  }

  function handlerAudioTimeUpdate() {
    const audioElement = audioRef.current;
    if (!audioElement) {
      return;
    }
    setAudioProps((prev) => ({
      ...prev,
      currentTime: audioElement.currentTime,
      playing: !audioElement.paused,
    }));
    navigator.mediaSession.setPositionState({
      duration: audioElement.duration,
      playbackRate: audioElement.playbackRate,
      position: audioElement.currentTime,
    });
  }

  function handlerError() {
    const message = audioRef.current?.error?.message;
    setAudioProps((prev) => ({
      ...prev,
      loading: false,
      error: message ?? "Ocorreu um erro ao reproduzir áudio",
    }));
  }

  function handlerCloseFile() {
    if (audioRef.current) {
      audioRef.current.src = "";
    }
    setFile(null);
  }

  function togglePlayAudio() {
    if (!audioRef.current) {
      return;
    }

    if (audioProps.error) {
      audioRef.current.load();
      setAudioProps((prev) => ({ ...prev, error: null, loading: true }));
      return;
    }

    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setAudioProps((prev) => ({ ...prev, playing: !audioRef.current!.paused }));
  }

  function toggleHideText() {
    setAudioControls((prev) => ({ ...prev, hideTitle: !prev.hideTitle }));
  }

  function toggleMute() {
    setAudioControls((prev) => ({ ...prev, muted: !prev.muted }));
  }

  function togglePlaylist() {
    setAudioControls((prev) => ({
      ...prev,
      playlistOpened: playlist ? !prev.playlistOpened : false,
    }));
  }

  function toggleRandom() {
    setAudioControls((prev) => ({ ...prev, random: !prev.random }));
  }

  function updateAudioPercent(percent: number) {
    const time = audioProps.duration * (percent / 100);
    audioRef.current!.currentTime = time;
    return true;
  }

  function nextSong() {
    if (!file || !audioPlayList) {
      return;
    }
    setAudioProps((prev) => ({ ...prev, loading: true }));

    let nextSong = 0;

    const fileE = audioPlayList.filter((f) => f.src == file.src);
    if (fileE.length == 1) {
      nextSong = audioPlayList.indexOf(fileE[0]);
      if (nextSong + 1 >= audioPlayList.length) {
        nextSong = 0;
      } else {
        nextSong++;
      }
    }

    setFile(audioPlayList[nextSong]);
  }

  function backSong() {
    if (!file || !audioPlayList) {
      return;
    }
    if (audioProps.currentTime >= 3) {
      audioRef.current!.currentTime = 0;
      return;
    }

    setAudioProps((prev) => ({ ...prev, loading: true }));

    let backSong = audioPlayList.indexOf(file);
    if (backSong <= 0) {
      backSong = audioPlayList.length - 1;
    } else {
      backSong--;
    }
    setFile(audioPlayList[backSong]);
  }

  useEffect(() => {
    const handerOpen = (event: FileOpenEvent) => {
      if (!event.file.type || !isAudio(event.file.type)) {
        setFile(null);
        return;
      }

      event.eventCalled = true;
      if (event.file.src == file?.src) {
        audioRef.current!.currentTime = 0;
        return;
      }

      if (filesList) {
        setPlaylist(
          filesList.filter((file) => file.type && isAudio(file.type))
        );
      }

      setAudioProps((prev) => ({ ...prev, loading: true }));
      setFile(event.file);
    };

    const changeFileSort = (sort: string) => {
      setPlaylist((playlist) => playlist && SortFactory(sort).sort(playlist));
    };

    const handlerReloadPage = (event: BeforeUnloadEvent) => {
      if (file) {
        const message = "Você tem certeza que deseja atualizar a página?";
        event.preventDefault();
        return message;
      }
    };

    if (playlist == null && file != null && filesList != null) {
      setPlaylist(filesList.filter((file) => file.type && isAudio(file.type)));
    }

    fileUpdateEvent.addListener("open", handerOpen);
    fileUpdateEvent.addListener("change-sort", changeFileSort);
    window.addEventListener("beforeunload", handlerReloadPage);
    return () => {
      fileUpdateEvent.removeListener("open", handerOpen);
      fileUpdateEvent.removeListener("change-sort", changeFileSort);
      window.removeEventListener("beforeunload", handlerReloadPage);
    };
  }, [playlist, file, filesList]);

  useEffect(() => {
    if (!file) {
      setSrc('');
      setPlaylist(null);
      navigator.mediaSession.metadata = null;
      return;
    }
    if (src != file.src) {
      setSrc('');
      setTimeout(() => {
        setSrc(file.src)
      }, 100);
    }
    if (!audioRef.current) {
      return;
    }
    if (!audioProps.loading) {
      audioRef.current.volume = audioControls.muted ? 0 : audioControls.volume;
      if (navigator.mediaSession.metadata) {
        navigator.mediaSession.metadata.title = audioControls.hideTitle
          ? "Raspadmin Music Player"
          : file.name;
        navigator.mediaSession.metadata.artwork = [
          {
            src:
              !file.icon || audioControls.hideTitle
                ? "/img/icons/music.svg"
                : file.icon,
          },
        ];
      }
    }
    navigator.mediaSession.playbackState = audioProps.playing
      ? "playing"
      : "paused";
  }, [audioControls, audioProps.loading, audioProps.playing, file, src]);

  return (
    file && (
      <div
        className={`fixed bottom-0 left-0 right-0 flex flex-col z-20 ${
          audioControls.playlistOpened ? "top-0" : ""
        }`}
      >
        {playlist && (
          <Playlist
            playlist={playlist}
            title="Lista de áudios"
            onClick={setFile}
            onClose={togglePlaylist}
            playing={file}
            classList={audioControls.playlistOpened ? "" : "hidden"}
          />
        )}
        <div className="grid grid-cols-[calc(100%_-2rem)_2rem] bg-black bg-opacity-45 border-2 border-zinc-400 bg-gradient-to-r from-zinc-500/25 to-zinc-900/25 ps-4 backdrop-blur-sm animate-transform-from-bottom">
          <div className="w-full flex flex-col flex-grow">
            <div className="w-full flex flex-col md:flex-row my-2 md:my-4">
              <div className="w-full md:w-1/3 md:grid-cols-[3rem_calc(100%_-_3rem)] grid grid-cols-[3.5rem_calc(100%_-_3rem)]  gap-2 items-center mb-3 md:mb-0">
                <div className="flex flex-col justify-center items-center w-14 h-14 md:w-12 md:h-12 overflow-hidden rounded-md">
                  <Image
                    src={!file.icon ? "/img/icons/music.svg" : file.icon}
                    alt={file.name}
                    className={`h-full w-full top-0 left-0 object-cover ${
                      audioControls.hideTitle ? "blur-sm" : ""
                    }`}
                    width={512}
                    height={512}
                    unoptimized
                  />
                </div>
                <div className="overflow-hidden md:text-left text-center">
                  <h1
                    className={`font-bold overflow-hidden text-nowrap text-ellipsis ${
                      audioControls.hideTitle ? "blur-sm" : ""
                    } ${audioProps.error ? "text-red-400" : ""}`}
                  >
                    {audioProps.error ? audioProps.error : file.name}
                  </h1>
                </div>
              </div>
              <div className="w-full flex md:w-2/3 md:justify-center">
                <div className="md:w-1/2 flex justify-center gap-3 me-auto md:me-0">
                  <button className="text-2xl w-8" onClick={backSong}>
                    <FontAwesomeIcon icon={faBackwardFast} />
                  </button>
                  <button
                    className="text-3xl w-8 h-12"
                    onClick={togglePlayAudio}
                    disabled={audioProps.loading}
                  >
                    {audioProps.loading ? (
                      <div className="flex w-full h-full items-center justify-center">
                        <div className="w-6 h-6 border-4 border-b-transparent border-white rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <FontAwesomeIcon
                        icon={
                          audioProps.error
                            ? faRotateRight
                            : audioProps.playing
                            ? faPause
                            : faPlay
                        }
                      />
                    )}
                  </button>
                  <button className="text-2xl w-8" onClick={nextSong}>
                    <FontAwesomeIcon icon={faForwardFast} />
                  </button>
                </div>
                <div className="md:w-1/2 flex gap-2 justify-end">
                  <button
                    className="text-2xl flex flex-col justify-center"
                    onClick={toggleRandom}
                  >
                    {audioControls.random ? (
                      <svg
                        width="24px"
                        height="32"
                        viewBox="0 0 500 450"
                        fill="white"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M426.6 439.699C417.4 448.899 403.7 451.6 391.7 446.6C379.7 441.6 371.9 429.999 371.9 416.999V384.999H32.5C14.8 384.999 0.5 370.699 0.5 352.999C0.5 335.299 14.8 320.999 32.5 320.999H372V288.999C372 276.099 379.8 264.399 391.8 259.399C403.8 254.399 417.5 257.199 426.7 266.299L490.7 330.299C496.7 336.299 500.1 344.399 500.1 352.899C500.1 361.399 496.7 369.499 490.7 375.499L426.7 439.499L426.6 439.699Z" />
                        <path d="M426.6 183.7C417.4 192.9 403.7 195.6 391.7 190.6C379.7 185.6 371.9 174 371.9 161V129H32.5C14.8 129 0.5 114.7 0.5 96.9998C0.5 79.2998 14.8 64.9998 32.5 64.9998H372V32.9998C372 20.0998 379.8 8.39976 391.8 3.39976C403.8 -1.60024 417.5 1.19976 426.7 10.2998L490.7 74.2998C496.7 80.2998 500.1 88.3998 500.1 96.8998C500.1 105.4 496.7 113.5 490.7 119.5L426.7 183.5L426.6 183.7Z" />
                      </svg>
                    ) : (
                      <FontAwesomeIcon icon={faShuffle} />
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="text-2xl w-7" onClick={toggleMute}>
                      <FontAwesomeIcon
                        icon={audioControls.muted ? faVolumeMute : faVolumeHigh}
                      />
                    </button>
                    <Range
                      className="sm:block w-20 hidden"
                      percent={audioControls.volume * 100}
                      onChange={(volume) => {
                        setAudioControls((prev) => ({
                          ...prev,
                          volume: volume / 100,
                        }));
                        return true;
                      }}
                    />
                  </div>
                  <button className="text-2xl w-9">
                    <FontAwesomeIcon
                      icon={audioControls.hideTitle ? faEye : faEyeSlash}
                      onClick={toggleHideText}
                    />
                  </button>
                  <button className="text-2xl">
                    <FontAwesomeIcon icon={faBars} onClick={togglePlaylist} />
                  </button>
                </div>
              </div>
            </div>
            <Range
              className="w-full my-2"
              percent={audioTimePercent * 100}
              onChange={updateAudioPercent}
            />
            <audio
              autoPlay
              src={src}
              ref={audioRef}
              className="hidden"
              controls={false}
              onCanPlay={handlerAudioLoaded}
              onTimeUpdate={handlerAudioTimeUpdate}
              onEnded={nextSong}
              onError={handlerError}
            />
          </div>
          <div>
            <button onClick={handlerCloseFile} className="mb-auto">
              <FontAwesomeIcon icon={faXmark} className="block m-1 text-xl" />
            </button>
          </div>
        </div>
      </div>
    )
  );
}

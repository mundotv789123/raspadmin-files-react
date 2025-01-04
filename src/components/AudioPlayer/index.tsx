import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AudioContent, AudioDurationContent, AudioDurationCount, AudioElement, AudioProgress, AudioTitle, Col, ContentHeader, ControlButton, ControlContent, ErrorText, LoadingSpin, VolumeControl, VolumeProgress } from "./styles";
import { faBackwardStep, faBars, faEye, faEyeSlash, faForwardStep, faPause, faPlay, faRotateRight, faShuffle, faTimes, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import PlayList from "./PlayList";
import Range from "../../elements/range";
import { numberClockTime, srcToFileName } from "../../helpers/ConverterHelper";
import { getErrorMessage } from "@/services/exceptions/FilesErros";
import { useLocalStorage } from "@/helpers/HooksHelper";

interface AudioControl {
  muted: boolean,
  random: boolean,
  playing: boolean,
  playlistOpened: boolean,
  hideTitle: boolean,
  volume: number
}

interface AudioProps {
  duration: number,
  currentTime: number
}

interface PropsInterface {
  src: string | null,
  playlist: Array<string>,
  onClose?(): void
}

export default function AudioPlayer(props: PropsInterface) {
  const audioElement = useRef<HTMLAudioElement>(null);
  const [src, setSrc] = useState<string>(props.src ?? "");

  const playlist = props.playlist;

  const [controls, setControls] = useLocalStorage<AudioControl>("audio-settings", {
    muted: false,
    random: false,
    playing: false,
    playlistOpened: false,
    hideTitle: false,
    volume: .5
  });

  const [audioProps, setAudioProps] = useState<AudioProps>({
    duration: 0,
    currentTime: 0
  });

  const audioDuration = useMemo(() => numberClockTime(audioProps.duration), [audioProps.duration]);
  const audioCurrentTime = useMemo(() => numberClockTime(audioProps.currentTime), [audioProps.currentTime]);
  const progressPercent = useMemo(() => 
    audioProps.duration == 0 ? 0 : (audioProps.currentTime * 100 / audioProps.duration)
  , [audioProps.currentTime, audioProps.duration]);
  const currentPlayList = useMemo(() => 
    controls.random ? playlist.map(a => a).sort(() => Math.random() - 0.5) : playlist
  , [controls.random, playlist]);

  const [errorText, setErrorText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!props.src)
      return;
    if (props.src == src)
      audioElement.current!.currentTime = 0;
    else
      setSrc(props.src);
  }, [props.src, src])

  useEffect(() => {
    setLoading(true);
    audioElement.current!.load();
  }, [src])

  const fileName = srcToFileName(decodeURIComponent(src));

  function loadPlayer() {
    if (!loading)
      return;

    setErrorText(null);
    loadMediaSession();

    setAudioProps((prev) => ({ ...prev, duration: audioElement.current!.duration }));
    audioElement.current!.volume = controls.muted ? 0 : controls.volume;

    setLoading(false);
  }

  function loadMediaSession() {
    if (!navigator.mediaSession.metadata) {
      navigator.mediaSession.metadata = new MediaMetadata();
    }
    navigator.mediaSession.metadata.title = controls.hideTitle ? "Raspadmin Music Player" : fileName;
    navigator.mediaSession.metadata.artwork = [{ src: "/img/icons/music.svg" }];
    navigator.mediaSession.setActionHandler('previoustrack', backSong);
    navigator.mediaSession.setActionHandler('nexttrack', nextSong);
  }

  function updateHideTitle() {
    setControls((prev) => {
      navigator.mediaSession.metadata!.title = !prev.hideTitle ? "Raspadmin Music Player" : fileName;
      return { ...prev, hideTitle: !prev.hideTitle };
    });
  }

  function updatePlaying() {
    setControls((prev) => ({ ...prev, playing: !audioElement.current!.paused }));
  }

  function togglePlay() {
    if (errorText !== null) {
      audioElement.current!.load();
      setLoading(true);
      return;
    }

    if (controls.playing) {
      audioElement.current!.pause();
    } else {
      audioElement.current!.play();
    }
  }

  function updateAudioTime(percent: number) {
    audioElement.current!.currentTime = (audioElement.current!.duration / 100 * percent);
    return true;
  }

  function updateAudioVolume(percent: number) {
    if (!controls.muted)
      audioElement.current!.volume = percent / 100;
    setControls((prev) => ({ ...prev, volume: audioElement.current!.volume }));
    return true;
  }

  function nextSong() {
    if (currentPlayList.length <= 1) {
      audioElement.current!.currentTime = 0;
      return;
    }
    setLoading(true);

    const index = currentPlayList.indexOf(src)
    if (index < 0 || (index + 1) >= currentPlayList.length) {
      setSrc(currentPlayList[0]);
      return;
    }
    setSrc(currentPlayList[index + 1]);
  }

  function backSong() {
    if (audioElement.current!.currentTime > 1 || currentPlayList.length <= 1) {
      audioElement.current!.currentTime = 0;
      return;
    }

    setLoading(true);
    const index = currentPlayList.indexOf(src);
    setSrc(() => {
      return index <= 0 ? currentPlayList[currentPlayList.length - 1] : currentPlayList[index - 1];
    });
  }

  function updateSongPlaying(index: number) {
    const src = playlist[index];
    setSrc(src);
  }

  function updateMuted() {
    const isMuted = !controls.muted;
    audioElement.current!.volume = isMuted ? 0 : controls.volume;
    setControls((prev) => ({ ...prev, muted: isMuted }));
  }

  function toggleRandon() {
    const isRandom = !controls.random;
    setControls((prev) => ({ ...prev, random: isRandom }));
  }

  function setError() {
    setLoading(false);
    const code = audioElement.current?.error?.code;
    const message = audioElement.current?.error?.message;
    const errorMessage = code ? getErrorMessage(code) : message ?? "Ocorreu um erro ao reproduzir áudio";
    setErrorText(errorMessage)
  }

  function close() {
    if (props.onClose)
      props.onClose();
  }

  return (
    <AudioContent>
      <PlayList
        open={controls.playlistOpened}
        playlist={playlist.map(src => srcToFileName(decodeURIComponent(src)))}
        playing={src ? playlist.indexOf(src) : undefined}
        onClick={updateSongPlaying}
      />
      <AudioElement>
        <ContentHeader>
          <ControlButton style={{ height: '30px', display: 'flex', marginLeft: 'auto', padding: '5px' }} onClick={() => close()}>
            <FontAwesomeIcon icon={faTimes} style={{ fontSize: '16pt', margin: 'auto' }} />
          </ControlButton>
        </ContentHeader>
        <ControlContent>
          <Col>
            {errorText ? <ErrorText>{errorText}</ErrorText> :
              <AudioTitle>{controls.hideTitle ? "..." : fileName}</AudioTitle>
            }
          </Col>
          <Col>
            <ControlButton onClick={backSong} disabled={playlist.length <= 0}>
              <FontAwesomeIcon icon={faBackwardStep} />
            </ControlButton>
            <ControlButton onClick={togglePlay}>
              {loading ? <LoadingSpin /> : <FontAwesomeIcon icon={errorText ? faRotateRight : controls.playing ? faPause : faPlay} />}
            </ControlButton>
            <ControlButton onClick={nextSong} disabled={playlist.length <= 0}>
              <FontAwesomeIcon icon={faForwardStep} />
            </ControlButton>
          </Col>
          <Col style={{ justifyContent: 'right', paddingRight: '15px' }}>
            <ControlButton onClick={toggleRandon}>
              <FontAwesomeIcon icon={faShuffle} style={{ color: controls.random ? "lightgray" : "white" }} />
            </ControlButton>
            <VolumeControl>
              <ControlButton style={{ display: 'flex' }} onClick={updateMuted}>
                <FontAwesomeIcon icon={controls.muted ? faVolumeMute : faVolumeUp} style={{ fontSize: '16pt' }} />
              </ControlButton>
              <VolumeProgress>
                <Range percent={controls.volume * 100} onInput={updateAudioVolume} live={true} step={'0.1'} />
              </VolumeProgress>
            </VolumeControl>
            <ControlButton onClick={updateHideTitle}>
              <FontAwesomeIcon icon={controls.hideTitle ? faEye : faEyeSlash} style={{ fontSize: '16pt' }} />
            </ControlButton>
            <ControlButton onClick={() => setControls((prev) => ({ ...prev, playlistOpened: !prev.playlistOpened }))}>
              <FontAwesomeIcon icon={faBars} style={{ fontSize: '16pt' }} />
            </ControlButton>
          </Col>
        </ControlContent>
        <AudioDurationContent>
          <AudioDurationCount>{audioCurrentTime}/{audioDuration}</AudioDurationCount>
          <AudioProgress>
            <Range percent={progressPercent} follower={true} onInput={updateAudioTime} step={'0.25'} />
          </AudioProgress>
        </AudioDurationContent>
        <audio
          autoPlay={true}
          src={src}
          onError={setError}
          onPlay={updatePlaying}
          onPause={updatePlaying}
          onCanPlay={loadPlayer}
          onEnded={nextSong}
          onTimeUpdate={(e) => setAudioProps((prev) => ({ ...prev, currentTime: (e.target as HTMLAudioElement | null)?.currentTime ?? 0 }))}
          ref={audioElement}
        />
      </AudioElement>
    </AudioContent>
  );
}
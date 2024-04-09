import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AudioContent, AudioDurationContent, AudioDurationCount, AudioElement, AudioProgress, AudioTitle, ContentHeader, ControlButton, ControlContent, ErrorText, LoadingSpin, VolumeControl, VolumeProgress } from "./styles";
import { faAngleUp, faBackwardStep, faEye, faEyeSlash, faForwardStep, faPause, faPlay, faRotate, faRotateRight, faShuffle, faTimes, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import PlayList from "./PlayList";
import Range from "../../elements/range";
import { numberClockTime, srcToFileName } from "../../helpers/ConverterHelper";

interface PropsInterface {
  src: string, 
  playlist: Array<string> 
}

export default function AudioPlayer(props: PropsInterface) {
  const playlist = props.playlist;

  const [src, setSrc] = useState(props.src);

  const [muted, setMuted] = useState(false);
  const [random, setRandom] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  const [progressPercent, setProgressPercent] = useState(0);
  const [audioVolume, setAudioVolume] = useState(0);

  const [audioDuration, setAudioDuration] = useState('00:00');
  const [audioCurrentTime, setAudioCurrentTime] = useState('00:00');

  const [playlistOpened, setPlayerlistOpened] = useState(false);
  const [randomPlayList, setRandomPlaylist] = useState<Array<string> | null>(null);

  const [hideTitle, setHideTitle] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const audio_element = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (props.src == null)
      return;
    if (props.src == src)
      audio_element.current!.currentTime = 0;
    else
      setSrc(props.src);
  }, [props.src])

  useEffect(() => {
    setLoading(true);
    if (random && !playListIsSameOfRandomList())
      randomizeList(true);
  }, [src])

  const fileName = srcToFileName(decodeURIComponent(src));

  function loadPlayer() {
    if (!loading)
      return;

    setErrorText(null);
    loadMediaSession();

    let volume = getSessionVolume();
    setAudioVolume(volume);

    audio_element.current!.volume = muted ? 0 : volume / 100;

    setLoading(false);
    setAudioDuration(numberClockTime(audio_element.current!.duration));
  }

  function loadMediaSession() {
    if (!navigator.mediaSession.metadata) {
      navigator.mediaSession.metadata = new MediaMetadata();
    }
    navigator.mediaSession.metadata.title = hideTitle ? "Raspadmin Music Player" : fileName;
    navigator.mediaSession.metadata.artwork = [{ src: "/img/icons/music.svg" }];
    navigator.mediaSession.setActionHandler('previoustrack', backSong);
    navigator.mediaSession.setActionHandler('nexttrack', nextSong);
  }

  function updateHideTitle() {
    setHideTitle(isHidetitle => {
      navigator.mediaSession.metadata!.title = !isHidetitle ? "Raspadmin Music Player" : fileName;
      return !isHidetitle;
    });
  }

  function updatePlaying() {
    setPlaying(!audio_element.current!.paused);
  }

  function togglePlay() {
    if (errorText != null) {
      audio_element.current!.load();
      setLoading(true)
    }

    if (playing) {
      audio_element.current!.pause();
    } else {
      audio_element.current!.play();
    }
  }

  function updateAudioProgress() {
    let percent = (audio_element.current!.currentTime * 100 / audio_element.current!.duration);
    setProgressPercent(percent);
    setAudioCurrentTime(numberClockTime(audio_element.current!.currentTime));
  }

  function updateAudioTime(percent: number) {
    audio_element.current!.currentTime = (audio_element.current!.duration / 100 * percent);
    setProgressPercent(percent);
    return true;
  }

  function updateAudioVolume(percent: number) {
    if (!muted)
      audio_element.current!.volume = percent / 100;
    localStorage.setItem('audio_volume', percent.toFixed(2));
    setAudioVolume(percent);
    return true;
  }

  function nextSong() {
    if (playlist.length <= 1) {
      audio_element.current!.currentTime = 0;
      return;
    }
    setLoading(true)
    let list = (random ? randomPlayList : playlist) ?? [];

    let index = list.indexOf(src)
    if (index < 0 || (index + 1) >= list.length) {
      setSrc(list[0]);
      return;
    }
    setSrc(list[index + 1]);
  }

  function backSong() {
    if (audio_element.current!.currentTime > 1 || playlist.length <= 1) {
      audio_element.current!.currentTime = 0;
      return;
    }

    let list = (random ? randomPlayList : playlist) ?? [];

    setLoading(true)
    let index = list.indexOf(src);
    setSrc(() => {
      return index <= 0 ? list[playlist.length - 1] : list[index - 1];
    });
  }

  function updateSongPlaying(index: number) {
    let src = playlist[index];
    setSrc(src);
  }

  function getSessionVolume(): number {
    let volume = localStorage.getItem('audio_volume') ? Number(localStorage.getItem('audio_volume')) : 50;
    return volume < 0 ? 0 : volume;
  }

  function updateMuted() {
    let isMuted = !muted;
    audio_element.current!.volume = isMuted ? 0 : audioVolume / 100;
    setMuted(isMuted);
  }

  function toggleRandon() {
    let isRandom = !random;
    setRandom(isRandom);
    if (isRandom)
      randomizeList();
    else
      setRandomPlaylist(null);
  }

  function randomizeList(reset = false) {
    if (!playlist || playlist.length <= 2)
      return

    let list = (!reset && randomPlayList != null) ? randomPlayList : playlist.map(a => a);
    setRandomPlaylist(list.sort(() => Math.random() - 0.5));
  }

  function playListIsSameOfRandomList(): boolean {
    if (randomPlayList == null || randomPlayList.length != playlist.length)
      return false;

    return playlist.filter(s => !randomPlayList.includes(s)).length == 0;
  }

  function setError() {
    setLoading(false)
    setErrorText("Ocorreu um erro ao reproduzir áudio")
  }

  return (
    <AudioContent>
      <PlayList
        open={playlistOpened}
        playlist={playlist.map(src => srcToFileName(decodeURIComponent(src)))}
        playing={src ? playlist.indexOf(src) : undefined}
        onClick={updateSongPlaying}
      />
      <AudioElement>
        <ContentHeader>
          <ControlButton style={{ height: '16px', display: 'flex', marginLeft: 'auto', padding: '5px' }} onClick={() => { setPlayerlistOpened(!playlistOpened) }} className="playlist-button">
            <FontAwesomeIcon icon={faAngleUp} style={{ fontSize: '16pt', margin: 'auto' }} className={"icon " + (playlistOpened ? "down" : "")} />
          </ControlButton>
        </ContentHeader>
        <ControlContent>
          <ControlButton onClick={backSong} disabled={playlist.length <= 0}>
            <FontAwesomeIcon icon={faBackwardStep} />
          </ControlButton>
          <ControlButton onClick={togglePlay}>
            {loading ? <LoadingSpin /> : <FontAwesomeIcon icon={errorText ? faRotateRight : playing ? faPause : faPlay} />}
          </ControlButton>
          <ControlButton onClick={nextSong} disabled={playlist.length <= 0}>
            <FontAwesomeIcon icon={faForwardStep} />
          </ControlButton>
          <ControlButton onClick={toggleRandon}>
            <FontAwesomeIcon icon={faShuffle} style={{ color: random ? "lightgray" : "white" }} />
          </ControlButton>
          <VolumeControl>
            <ControlButton style={{ display: 'flex' }} onClick={updateMuted}>
              <FontAwesomeIcon icon={muted ? faVolumeMute : faVolumeUp} style={{ fontSize: '16pt' }} />
            </ControlButton>
            <VolumeProgress>
              <Range percent={audioVolume} onInput={updateAudioVolume} live={true} step={'0.1'}/>
            </VolumeProgress>
          </VolumeControl>
          <ControlButton onClick={updateHideTitle}>
            <FontAwesomeIcon icon={hideTitle ? faEye : faEyeSlash} style={{ fontSize: '16pt' }} />
          </ControlButton>
          {errorText ? <ErrorText>{errorText}</ErrorText> :
            <AudioTitle>{hideTitle ? "..." : fileName}</AudioTitle>
          }

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
          onTimeUpdate={updateAudioProgress}
          onEnded={nextSong}
          ref={audio_element}
        />
      </AudioElement>
    </AudioContent>
  );
}
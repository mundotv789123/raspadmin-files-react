import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AudioContent, AudioDurationContent, AudioDurationCount, AudioElement, AudioProgress, AudioTitle, ContentHeader, ControlButton, ControlContent, LoadingSpin, VolumeControl, VolumeProgress } from "./styles";
import { faAngleUp, faBackwardStep, faEye, faEyeSlash, faForwardStep, faPause, faPlay, faShuffle, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import PlayList from "./PlayList";
import Range from "../../elements/range";
import { numberClockTime, srcToFileName } from "../../services/helpers/ConverterHelper";

export default function AudioPlayer(props: { src: string, playlist: Array<string> }) {
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

    const audio_element = useRef<HTMLAudioElement>();

    useEffect(() => {
        if (props.src == null)
            return;
        if (props.src == src)
            audio_element.current.currentTime = 0;
        else
            setSrc(props.src);
    }, [props.src])

    useEffect(() => {
        setLoading(true);
        if (random && !playListIsSameOfRandomList())
            randomizeList(true);
    }, [src])

    const fileName = srcToFileName(src);

    function loadPlayer() {
        if (!loading)
            return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: hideTitle ? "Raspadmin Music Player" : fileName,
            artwork: [{ src: "/img/icons/music.svg" }]
        });
        navigator.mediaSession.setActionHandler('previoustrack', backSong);
        navigator.mediaSession.setActionHandler('nexttrack', nextSong);

        let volume = getSessionVolume();
        setAudioVolume(volume);

        audio_element.current.volume = muted ? 0 : volume / 100;

        setLoading(false);
        setAudioDuration(numberClockTime(audio_element.current.duration));
    }

    function updateHideTitle() {
        navigator.mediaSession.metadata.title = !hideTitle ? "Raspadmin Music Player" : fileName;
        setHideTitle(!hideTitle);
    }

    function updatePlaying() {
        setPlaying(!audio_element.current.paused);
    }

    function togglePlay() {
        if (playing) {
            audio_element.current.pause();
        } else {
            audio_element.current.play();
        }
    }

    function updateAudioProgress() {
        let percent = (audio_element.current.currentTime * 100 / audio_element.current.duration);
        setProgressPercent(percent);
        setAudioCurrentTime(numberClockTime(audio_element.current.currentTime));
    }

    function updateAudioTime(percent: number) {
        audio_element.current.currentTime = (audio_element.current.duration / 100 * percent);
        setProgressPercent(percent);
        return true;
    }

    function updateAudioVolume(percent: number) {
        if (!muted)
            audio_element.current.volume = percent / 100;
        localStorage.setItem('audio_volume', percent.toFixed(2));
        setAudioVolume(percent);
        return true;
    }

    function nextSong() {
        if (playlist.length <= 1) {
            audio_element.current.currentTime = 0;
            return;
        }
        setLoading(true)
        let list = random ? randomPlayList : playlist;

        let index = list.indexOf(src)
        if (index < 0 || (index + 1) >= list.length) {
            setSrc(list[0]);
            return;
        }
        setSrc(list[index + 1]);
    }

    function backSong() {
        if (audio_element.current.currentTime > 1 || playlist.length <= 1) {
            audio_element.current.currentTime = 0;
            return;
        }

        let list = random ? randomPlayList : playlist;

        setLoading(true)
        let index = list.indexOf(src);
        if (index <= 0) {
            setSrc(list[playlist.length - 1]);
            return;
        }
        setSrc(list[index - 1]);
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
        audio_element.current.volume = isMuted ? 0 : audioVolume / 100;
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

    return (
        <AudioContent>
            <PlayList
                open={playlistOpened}
                playlist={playlist.map(src => srcToFileName(src))}
                playing={src ? playlist.indexOf(src) : null}
                onClick={updateSongPlaying}
            />
            <AudioElement>
                <ContentHeader>
                    <ControlButton style={{ height: '16px', display: 'flex', marginLeft: 'auto', padding: '5px' }} onClick={() => { setPlayerlistOpened(!playlistOpened) }} className="playlist-button">
                        <FontAwesomeIcon icon={faAngleUp} style={{ fontSize: '16pt', margin: 'auto' }} className={"icon "+(playlistOpened ? "down" : "")}/>
                    </ControlButton>
                </ContentHeader>
                <ControlContent>
                    <ControlButton onClick={backSong} disabled={playlist.length <= 0}>
                        <FontAwesomeIcon icon={faBackwardStep} />
                    </ControlButton>
                    <ControlButton onClick={togglePlay}>
                        {loading ? <LoadingSpin /> : <FontAwesomeIcon icon={playing ? faPause : faPlay} />}
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
                            <Range percent={audioVolume} onInput={updateAudioVolume} live={true} />
                        </VolumeProgress>
                    </VolumeControl>
                    <ControlButton onClick={updateHideTitle}>
                        <FontAwesomeIcon icon={hideTitle ? faEye : faEyeSlash} style={{ fontSize: '16pt' }} />
                    </ControlButton>
                    <AudioTitle>
                        {hideTitle ? "..." : fileName}
                    </AudioTitle>
                </ControlContent>
                <AudioDurationContent>
                    <AudioDurationCount>{audioCurrentTime}/{audioDuration}</AudioDurationCount>
                    <AudioProgress>
                        <Range percent={progressPercent} follower={true} onInput={updateAudioTime} />
                    </AudioProgress>
                </AudioDurationContent>
                <audio
                    autoPlay={true}
                    src={src}
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
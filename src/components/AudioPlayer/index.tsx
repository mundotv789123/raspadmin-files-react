import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AudioContent, AudioDurationContent, AudioDurationCount, AudioElement, AudioProgress, AudioTitle, ContentHeader, ControlButton, ControlContent, LoadingSpin, VolumeControl, VolumeProgress } from "./styles";
import { faAngleDown, faAngleUp, faBackwardStep, faForwardStep, faPause, faPlay, faShuffle, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
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

    const audio_element = useRef<HTMLAudioElement>();

    useEffect(() => {
        setLoading(true);
        setRandom(false);
        setRandomPlaylist(null);
        setSrc(props.src);
    }, [props.src])

    const fileName = srcToFileName(src);

    function loadPlayer() {
        if (!loading)
            return;
        
        navigator.mediaSession.metadata = new MediaMetadata({
            title: fileName,
        })
        navigator.mediaSession.setActionHandler('previoustrack', backSong);
        navigator.mediaSession.setActionHandler('nexttrack', nextSong);

        let volume = getSessionVolume();
        setAudioVolume(volume);

        audio_element.current.volume = muted ? 0 : volume / 100;

        setLoading(false);
        setAudioDuration(numberClockTime(audio_element.current.duration));
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
        if (audio_element.current.currentTime > 1) {
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
        let volume = localStorage.getItem('audio_volume') ? Number(localStorage.getItem('audio_volume')) : 0.5;
        return volume < 0 ? 0 : volume;
    }

    function updateMuted() {
        let isMuted = !muted;
        audio_element.current.volume = isMuted ? 0 : audioVolume / 100;
        setMuted(isMuted);
    }

    function updateRandon() {
        let isRandom = !random;
        if (!playlist || playlist.length <= 2)
            return
        
        if (isRandom) {
            let list = randomPlayList == null ? playlist.map(a => a) : randomPlayList;
            setRandomPlaylist(list.sort(() => Math.random() - 0.5));
        }

        setRandom(isRandom);
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
                    <ControlButton style={{ height: '16px', display: 'flex', marginLeft: 'auto', padding: '5px' }} onClick={() => { setPlayerlistOpened(!playlistOpened) }}>
                        <FontAwesomeIcon icon={playlistOpened ? faAngleDown : faAngleUp} style={{ fontSize: '16pt', margin: 'auto' }} />
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
                    <ControlButton onClick={updateRandon}>
                        <FontAwesomeIcon icon={faShuffle} style={{color: random ? "lightgray" : "white"}} />
                    </ControlButton>
                    <VolumeControl>
                        <ControlButton style={{ display: 'flex' }} onClick={updateMuted}>
                            <FontAwesomeIcon icon={muted ? faVolumeMute : faVolumeUp} style={{ fontSize: '16pt' }} />
                        </ControlButton>
                        <VolumeProgress>
                            <Range percent={audioVolume} onInput={updateAudioVolume} live={true}/>
                        </VolumeProgress>
                    </VolumeControl>
                    <AudioTitle>
                        {fileName}
                    </AudioTitle>
                </ControlContent>
                <AudioDurationContent>
                    <AudioDurationCount>{audioCurrentTime}/{audioDuration}</AudioDurationCount>
                    <AudioProgress>
                        <Range percent={progressPercent} follower={true} onInput={updateAudioTime}/>
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
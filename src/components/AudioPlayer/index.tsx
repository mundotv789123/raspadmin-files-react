import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AudioContent, AudioDurationContent, AudioDurationCount, AudioElement, AudioProgress, AudioProgressBar, AudioTitle, ControlButton, ControlContent, VolumeControl, VolumeProgress, VolumeProgressBar } from "./styles";
import { faBackwardStep, faForwardStep, faPause, faPlay, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

export default function AudioPlayer(props: { src: string, playlist: Array<string> }) {
    const playlist = props.playlist;

    const [src, setSrc] = useState(props.src);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [audioVolume, setAudioVolume] = useState(0);

    const [audioDuration, setAudioDuration] = useState('00:00');
    const [audioCurrentTime, setAudioCurrentTime] = useState('00:00');

    const audio_element = useRef<HTMLAudioElement>();
    const audio_progress = useRef<HTMLDivElement>();
    const audio_volume = useRef<HTMLDivElement>();

    /* get file name from url, ex: http://exemple.local/video/cool_song.mp3 -> cool_song */
    const fileName = decodeURIComponent(src)
        .replace(/\/+$/, '')
        .replace(/^([a-zA-Z]+:\/\/)?\/?([^\/]+\/)+/, '')
        .replace(/\.[a-zA-Z0-9]+$/, '');

    useEffect(() => {
        setSrc(props.src);
    }, [props.src])

    function loadPlayer() {
        if (!loading)
            return;
        navigator.mediaSession.metadata = new MediaMetadata({
            title: fileName,
        })
        navigator.mediaSession.setActionHandler('previoustrack', backSong);
        navigator.mediaSession.setActionHandler('nexttrack', nextSong);
        setLoading(false);
        setAudioVolume(audio_element.current.volume * 100);
        setAudioDuration(calculateTime(audio_element.current.duration));
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
        setAudioCurrentTime(calculateTime(audio_element.current.currentTime));
    }

    function updateAudioTime(event: any) {
        let rect = audio_progress.current.getBoundingClientRect();
        let percent = ((event.clientX - rect.left) * 100 / (rect.right - rect.left));
        audio_element.current.currentTime = (audio_element.current.duration / 100 * percent);
        setProgressPercent(percent);
    }

    function updateAudioVolume(event: any) {
        let rect = audio_volume.current.getBoundingClientRect();
        let percent = ((event.clientX - rect.left) * 100 / (rect.right - rect.left));
        audio_element.current.volume = percent / 100;
        setAudioVolume(percent);
    }

    function nextSong() {
        setLoading(true)
        let index = playlist.indexOf(src)
        if (index < 0 || (index + 1) >= playlist.length) {
            setSrc(playlist[0]);
            return;
        }
        setSrc(playlist[index + 1]);
    }

    function backSong() {
        setLoading(true)
        let index = playlist.indexOf(src);
        if (index <= 0) {
            setSrc(playlist[playlist.length - 1]);
            return;
        }
        setSrc(playlist[index - 1]);
    }

    function calculateTime(time: number): string {
        let secs = time % 60;
        let min = ((time - secs) / 60) % 60;
        let hours = ((time - secs) / 60) / 60;

        let timer = `${min.toFixed(0).padStart(2, '0')}:${secs.toFixed(0).padStart(2, '0')}`;
        if (hours >= 1) {
            timer = `${hours.toFixed(0).padStart(2, '0')}:${timer}`
        }
        return timer;
    }

    return (
        <AudioContent>
            <AudioElement>
                <ControlContent>
                    <ControlButton onClick={backSong} disabled={playlist.length <= 0}>
                        <FontAwesomeIcon icon={faBackwardStep} />
                    </ControlButton>
                    <ControlButton onClick={togglePlay}>
                        <FontAwesomeIcon icon={playing ? faPause : faPlay} />
                    </ControlButton>
                    <ControlButton onClick={nextSong} disabled={playlist.length <= 0}>
                        <FontAwesomeIcon icon={faForwardStep} />
                    </ControlButton>
                    <VolumeControl>
                        <ControlButton style={{ display: 'flex' }}>
                            <FontAwesomeIcon icon={faVolumeUp} style={{ fontSize: '16pt' }} />
                        </ControlButton>
                        <VolumeProgress onClick={updateAudioVolume} ref={audio_volume}>
                            <VolumeProgressBar style={{ width: `${audioVolume}%` }} />
                        </VolumeProgress>
                    </VolumeControl>
                    <AudioTitle>
                        {fileName}
                    </AudioTitle>
                </ControlContent>
                <AudioDurationContent>
                    <AudioDurationCount>{audioCurrentTime}/{audioDuration}</AudioDurationCount>
                    <AudioProgress onClick={updateAudioTime} ref={audio_progress}>
                        <AudioProgressBar style={{ width: `${progressPercent}%` }} />
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
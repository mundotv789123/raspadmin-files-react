import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AudioContent, AudioDurationContent, AudioDurationCount, AudioElement, AudioProgress, AudioProgressBar, AudioTitle, ControlButton, ControlContent, VolumeControl, VolumeProgress, VolumeProgressBar } from "./styles";
import { faBackwardStep, faForwardStep, faPause, faPlay, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";

export default function AudioPlayer(props: { src: string | undefined }) {

    const [playing, setPlaying] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);

    const audio_element = useRef<HTMLAudioElement>();

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
    }

    if (props.src == null) {
        return <></>
    }

    /* get file name from url, ex: http://exemple.local/video/cool_song.mp3 -> cool_song */
    const fileName = decodeURIComponent(props.src)
        .replace(/\/+$/, '')
        .replace(/^([a-zA-Z]+:\/\/)?\/?([^\/]+\/)+/, '')
        .replace(/\.[a-zA-Z0-9]+$/, '');

    return (
        <AudioContent>
            <AudioElement>
                <ControlContent>
                    <ControlButton><FontAwesomeIcon icon={faBackwardStep} /></ControlButton>
                    <ControlButton onClick={togglePlay}>
                        <FontAwesomeIcon icon={playing ? faPause : faPlay} />
                    </ControlButton>
                    <ControlButton><FontAwesomeIcon icon={faForwardStep} /></ControlButton>
                    <VolumeControl>
                        <ControlButton style={{display: 'flex'}}>
                            <FontAwesomeIcon icon={faVolumeUp} style={{fontSize: '16pt'}}/>
                        </ControlButton>
                        <VolumeProgress>
                            <VolumeProgressBar style={{width: '50%'}}/>
                        </VolumeProgress>
                    </VolumeControl>
                    <AudioTitle>
                        {fileName}
                    </AudioTitle>
                </ControlContent>
                <AudioDurationContent>
                    <AudioDurationCount>00:00/00:35</AudioDurationCount>
                    <AudioProgress>
                        <AudioProgressBar style={{width: `${progressPercent}%`}}/>
                    </AudioProgress>
                </AudioDurationContent>
                <audio 
                    autoPlay={true} 
                    src={props.src} 
                    onPlay={updatePlaying}
                    onPause={updatePlaying}
                    onTimeUpdate={updateAudioProgress}
                    ref={audio_element}
                />
            </AudioElement>
        </AudioContent>
    );
}
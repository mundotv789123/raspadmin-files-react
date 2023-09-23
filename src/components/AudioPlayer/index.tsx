import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AudioContent, AudioDurationContent, AudioDurationCount, AudioElement, AudioProgress, AudioProgressBar, AudioTitle, ControlButton, ControlContent, VolumeControl, VolumeProgress, VolumeProgressBar } from "./styles";
import { faBackwardStep, faForward, faForwardStep, faPause, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

export default function AudioPlayer(props: { src: string | undefined }) {

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
                    <ControlButton><FontAwesomeIcon icon={faPause} /></ControlButton>
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
                        <AudioProgressBar style={{width: '25%'}}/>
                    </AudioProgress>
                </AudioDurationContent>
                <audio autoPlay={true} src={props.src} style={{margin: 'auto', width: '80%'}}/>
            </AudioElement>
        </AudioContent>
    );
}
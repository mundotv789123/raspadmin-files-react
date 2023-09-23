import { AudioElement } from "./styles";

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
        <AudioElement controls={true} autoPlay={true} src={props.src}/>
    );
}
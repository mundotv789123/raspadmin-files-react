import { ImagemContainer, Img } from "./styles";

export default function ImageViewer(props: {src: string}) {
    return (
        <ImagemContainer>
            <Img src={props.src} />
        </ImagemContainer>
    )
} 
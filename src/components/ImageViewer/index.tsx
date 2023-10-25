import { ImagemContainer, Img } from "./styles";

export default function ImageViewer(props: {src: string}) {
    return (
        <ImagemContainer>
            <div style={{alignSelf: 'center', margin: 'auto'}}>
                <Img src={props.src} />
            </div>
        </ImagemContainer>
    )
} 
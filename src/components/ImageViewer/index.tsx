import { ImagemContainer, Img } from "./styles";

export default function ImageViewer(props: {src: string, backUrl?: string }) {
    return (
        <ImagemContainer>
            <a href={props.backUrl} style={{position: 'absolute'}}>Fechar</a>
            <div style={{alignSelf: 'center', margin: 'auto'}}>
                <Img src={props.src} />
            </div>
        </ImagemContainer>
    )
} 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CloseLink, ControlLink, Controls, ImagemContainer, Img } from "./styles";
import { faAngleLeft, faAngleRight, faClose } from "@fortawesome/free-solid-svg-icons";

export default function ImageViewer(props: { src: string, closeUrl?: string, backUrl?: string, nextUrl?: string }) {
  return (
    <ImagemContainer>
      {props.closeUrl && <CloseLink href={props.closeUrl}>
        <FontAwesomeIcon icon={faClose} style={{ margin: 'auto' }} />
      </CloseLink>}
      <Controls>
        {props.backUrl && <ControlLink href={props.backUrl}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </ControlLink>}
        {props.nextUrl && <ControlLink href={props.nextUrl} style={{ marginLeft: 'auto' }}>
          <FontAwesomeIcon icon={faAngleRight} />
        </ControlLink>}
      </Controls>
      <div style={{ alignSelf: 'center', margin: 'auto' }}>
        <Img src={props.src} />
      </div>
    </ImagemContainer>
  )
} 
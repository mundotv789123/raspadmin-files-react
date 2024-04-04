import { useEffect, useRef, useState } from "react";
import { Progress, ProgressBar, ProgressFollower, RangeElement } from "./styles";


interface PropsInterface {
  percent?: number, 
  follower?: boolean, 
  live?: boolean
  onInput?: ((percent: number) => boolean)
}

export default function Range(props: PropsInterface) {
  const [percent, setPercent] = useState(props.percent ?? 0)
  const [followerPercent, setFollowerPercent] = useState(0)
  const [keyPressing, setKeyPressing] = useState(false)

  const progress = useRef<HTMLDivElement>();
  const progress_follower = useRef<HTMLDivElement>();

  useEffect(() => {
    if (keyPressing)
      return;
    setPercent(props.percent);
  }, [props.percent])

  function callEvent(event: any) {
    let perc = getCursorPercent(event);
    if (props.onInput && props.onInput(perc))
      setPercent(perc);
  }

  function updateProgress(event: any) {
    let perc = getCursorPercent(event);

    if (props.live) {
      callEvent(event);
      return;
    }

    setFollowerPercent(0);
    setPercent(perc);
  }

  function eventFollowProgress(event: any) {
    let perc = getCursorPercent(event);
    setFollowerPercent(props.follower && perc);
  }

  function getCursorPercent(event: any): number {
    let rect = progress.current.getBoundingClientRect();
    let perc = ((event.clientX - rect.left) * 100 / (rect.right - rect.left));
    if (perc < 0)
      return 0;
    if (perc > 100)
      return 100;
    return perc;
  }

  return (
    <RangeElement
      draggable={true}
      onDragStart={e => {
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        setKeyPressing(true)
      }}
      onClick={e => callEvent(e)}
      onDragEnd={e => {
        callEvent(e); 
        setKeyPressing(false)
      }}
      onDrag={updateProgress}
      onMouseMove={eventFollowProgress}
      onMouseLeave={e => setFollowerPercent(0)}
    >
      <Progress ref={progress}>
        <ProgressBar style={{ width: `${percent}%` }} />
        <ProgressFollower
          style={{
            marginLeft: `-${percent}%`,
            width: `${followerPercent}%`
          }}
          ref={progress_follower}
        />
      </Progress>
    </RangeElement>
  )
}
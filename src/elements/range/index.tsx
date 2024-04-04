import { useEffect, useRef, useState } from "react";
import { RangeArea, RangeInput, RangeMain, RangeProgress, RangeProgressBar, RangeProgressFollower } from "./styles";


interface PropsInterface {
  percent?: number,
  follower?: boolean,
  live?: boolean,
  step?: string
  onInput?: ((percent: number) => boolean)
}

export default function Range(props: PropsInterface) {
  const [percent, setPercent] = useState(props.percent ?? 0)
  const [followerPercent, setFollowerPercent] = useState(0)
  const [keyPressing, setKeyPressing] = useState(false)

  const range_area = useRef<HTMLDivElement>();

  useEffect(() => {
    if (keyPressing)
      return;
    setPercent(props.percent);
  }, [props.percent])

  function callEvent(perc: number = percent) {
    if (props.onInput && props.onInput(Number(perc)))
      setPercent(perc);
  }

  function updateProgress(event: any) {
    let perc = event.target.value;

    setPercent(() => {
      if (props.live)
        callEvent(perc);
      return perc;
    });

    setFollowerPercent(0);
  }

  function getCursorPercent(event: any): number {
    let rect = range_area.current.getBoundingClientRect();
    let perc = ((event.clientX - rect.left) * 100 / (rect.right - rect.left));
    if (perc < 0)
      return 0;
    if (perc > 100)
      return 100;
    return perc;
  }

  return (
    <RangeMain>
      <RangeArea ref={range_area}>
        <RangeProgress>
          <RangeProgressBar style={{width: `${percent}%`}} />
          <RangeProgressFollower style={{marginLeft: `-${percent}%`, width: `${followerPercent}%`}} />
        </RangeProgress>
      </RangeArea>
      <RangeInput type="range" step={props.step} value={percent} min={0} max={100}
        onInput={updateProgress}
        onMouseLeave={() => setFollowerPercent(0)}
        onMouseDown={() => setKeyPressing(true)}
        onMouseUp={e => { 
          setKeyPressing(false);
          callEvent();
        }}
        onMouseMove={e => {
          let perc = getCursorPercent(event);
          setFollowerPercent(props.follower && perc);
        }}
      />
    </RangeMain>
  )
}
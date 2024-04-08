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
    setPercent(props.percent ?? 0);
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
    if (!range_area.current)
      return 0;
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
          <RangeProgressBar style={{width: `${percent}%`}} className="progressbar"/>
          <RangeProgressFollower style={{marginLeft: `-${percent}%`, width: `${followerPercent}%`}} />
        </RangeProgress>
      </RangeArea>
      <RangeInput type="range" step={props.step} value={percent} min={0} max={100}
        onInput={updateProgress}
        onMouseDown={() => setKeyPressing(true)}
        onTouchStart={() => setKeyPressing(true)}
        onTouchEnd={() => {
          setKeyPressing(false);
          callEvent();
        }}
        onMouseUp={() => { 
          setKeyPressing(false);
          callEvent();
        }}
        onMouseLeave={() => setFollowerPercent(0)}
        onMouseMove={e => {
          let perc = getCursorPercent(event);
          setFollowerPercent(props.follower ? perc : 0);
        }}
      />
    </RangeMain>
  )
}
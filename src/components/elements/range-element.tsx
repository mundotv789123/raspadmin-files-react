import React, { MouseEvent, MouseEventHandler, useEffect, useMemo, useRef, useState } from "react";

type PropsType = {
  percent?: number;
  className?: string;
  progressMouseFoller?: boolean
  onChange?: (percent: number) => boolean;
  onMouseMove?: MouseEventHandler<HTMLInputElement>;
  onMouseEnter?: MouseEventHandler<HTMLInputElement>;
  onMouseLeave?: MouseEventHandler<HTMLInputElement>;
};

export default function Range({
  percent,
  className,
  progressMouseFoller,
  onChange,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
}: PropsType) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [percentState, setPercent] = useState(percent ?? 0);
  const [percentMouseFollower, setPercentMouseFollower] = useState(50);
  
  const percentMouseCalculated = useMemo(() => percentMouseFollower > percentState ? percentMouseFollower - percentState : 0, [percentState, percentMouseFollower]);

  useEffect(() => {
    setPercent(percent ?? 0);
  }, [percent]);

  function handlerChange() {
    const newValue = Number(inputRef.current!.value ?? "0");
    if (onChange && !onChange(newValue)) {
      return;
    }
    setPercent(newValue);
  }

  function handlerMouseMove(e: MouseEvent<HTMLInputElement>) {
    if (progressMouseFoller) {
      const rect = e.currentTarget.getBoundingClientRect();
      const perc = ((e.clientX - rect.left) * 100 / (rect.right - rect.left));
      setPercentMouseFollower(perc < 0 ? 0 : perc > 100 ? 100 : perc);
    } else if (percentMouseFollower > 0) {
      setPercentMouseFollower(0);
    }
    onMouseMove?.(e);
  }

  return (
    <div className={className}>
      <div className="w-full relative">
        <div className="h-5 flex flex-col items-center group">
          <div className="flex w-full h-5 items-center absolute -z-0 px-2">
            <div className="flex w-full h-1/3 bg-zinc-400 rounded-md shadow-md items-center">
              <div
                className="bg-white h-full flex overflow-visible rounded-s-md"
                style={{ width: `${percentState}%` }}
              />
              <div className="rounded-full w-0 h-0 border-8 border-white -mx-2 shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="bg-stone-500 h-full flex opacity-0 group-hover:opacity-100" style={{ width: `${percentMouseCalculated}%` }}></div>
            </div>
          </div>
          <input
            ref={inputRef}
            className="w-full opacity-0 h-full"
            type="range"
            min={0}
            max={100}
            onChange={handlerChange}
            onMouseMove={handlerMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        </div>
      </div>
    </div>
  );
}

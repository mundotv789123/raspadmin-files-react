import React, { MouseEventHandler, useEffect, useRef, useState } from "react";

type PropsType = {
  percent?: number;
  className?: string;
  onChange?: (percent: number) => boolean;
  onMouseMove?: MouseEventHandler<HTMLInputElement>;
  onMouseEnter?: MouseEventHandler<HTMLInputElement>;
  onMouseLeave?: MouseEventHandler<HTMLInputElement>;
};

export default function Range({
  percent,
  className,
  onChange,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
}: PropsType) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [percentState, setPercent] = useState(percent ?? 0);

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

  return (
    <div className={className}>
      <div className="w-full relative">
        <div className="h-5 flex flex-col items-center">
          <div className="flex w-full h-5 items-center absolute -z-0 px-2">
            <div className="flex w-full h-1/3 bg-zinc-400 rounded-md shadow-md items-center">
              <div
                className="bg-white h-full flex overflow-visible rounded-md"
                style={{ width: `${percentState}%` }}
              />
              <div className="rounded-full w-0 h-0 border-8 border-white -mx-2 shadow-sm" />
            </div>
          </div>
          <input
            ref={inputRef}
            className="w-full opacity-0 h-full"
            type="range"
            min={0}
            max={100}
            onChange={handlerChange}
            onMouseMove={onMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        </div>
      </div>
    </div>
  );
}

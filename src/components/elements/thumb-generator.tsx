import { RefObject, useEffect, useRef } from "react";

type PropsType = {
  ref?: RefObject<HTMLDivElement | null>;
  src: string;
  time?: number;
};

export function ThumbGenerator({ ref, src, time }: PropsType) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (time && videoRef.current) {
      const timeRounded = Math.round(time / 2);

      if (videoRef.current.currentTime == timeRounded) {
        return;
      }

      videoRef.current.pause();
      videoRef.current.currentTime = timeRounded;
    }
  }, [time]);

  return (
    <div
      className="fixed bottom-24 bg-black bg-opacity-50 p-3 hidden backdrop-blur-sm shadow-sm border-gray-400 border"
      ref={ref}
    >
      <video
        className="w-32 h-16"
        src={src}
        ref={videoRef}
        preload="metadata"
      ></video>
    </div>
  );
}

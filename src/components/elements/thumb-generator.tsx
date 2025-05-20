import { RefObject, useEffect, useRef } from "react";

export function ThumbGenerator(props: { ref?: RefObject<HTMLDivElement | null>, src: string, time?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (props.time && videoRef.current) {
      videoRef.current.currentTime = props.time;
    }
  }, [props.time])

  return (
    <div className="fixed bottom-24 bg-black bg-opacity-50 p-3 hidden backdrop-blur-sm shadow-sm border-gray-400 border" ref={props.ref}>
      <video className="bg-gray-50 w-32 h-16" src={props.src} ref={videoRef}>

      </video>
    </div>
  )
}
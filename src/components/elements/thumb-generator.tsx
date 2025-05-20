import { RefObject } from "react";

export function ThumbGenerator(props: {ref?: RefObject<HTMLDivElement | null>}) {
  return (
    <div className="fixed bottom-24 bg-black bg-opacity-50 p-3 hidden backdrop-blur-sm shadow-sm border-gray-400 border" ref={props.ref}>
     <div className="bg-gray-50 w-32 h-16">
     </div>
    </div>
  )
}
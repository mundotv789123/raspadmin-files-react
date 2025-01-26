import { FileDTO } from "@/services/models/files-model";
import { useEffect, useState } from "react"
import AudioPlayer from "./players/audio-player";
import EventEmitter from "events";
import VideoPlayer from "./players/video-player";

export default function FileOpener(props: { filesEvent: EventEmitter}) {
  const [filesList, setFileList] = useState<Array<FileDTO>>();

  useEffect(() => {
    const handler = (files: Array<FileDTO>) => {
      setFileList(files);
    }

    props.filesEvent.addListener("list", handler);
    return () => {
      props.filesEvent.removeListener("list", handler);
    }
  }, [props.filesEvent])

  return (
    <>
      <AudioPlayer filesEvent={props.filesEvent} filesList={filesList}/>
      <VideoPlayer filesEvent={props.filesEvent} filesList={filesList}/>
    </>
  )
}
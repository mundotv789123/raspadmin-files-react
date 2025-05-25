import { FileDTO } from "@/services/models/files-model";
import { useEffect, useState } from "react";
import AudioPlayer from "./players/audio-player";
import EventEmitter from "events";
import VideoPlayer from "./players/video-player";
import { SortFactory } from "@/services/strategies/order-by-strategies";
import DocumentViewer from "./viewers/document-viewer";
import ImageViewer from "./viewers/image-viewer";

type PropsType = {
  filesEvent: EventEmitter;
};

export default function FileOpener({ filesEvent }: PropsType) {
  const [filesList, setFileList] = useState<Array<FileDTO>>();

  useEffect(() => {
    const handler = (files: Array<FileDTO>) => {
      const orderBy = localStorage.getItem("sort_by")
        ? JSON.parse(localStorage.getItem("sort_by")!)
        : "name";
      const newPlaylist = SortFactory(orderBy).sort(files);
      setFileList(newPlaylist);
    };

    filesEvent.addListener("list", handler);
    return () => {
      filesEvent.removeListener("list", handler);
    };
  }, [filesEvent]);

  return (
    <>
      <DocumentViewer filesEvent={filesEvent} />
      <ImageViewer filesEvent={filesEvent} filesList={filesList} />
      <AudioPlayer filesEvent={filesEvent} filesList={filesList} />
      <VideoPlayer filesEvent={filesEvent} filesList={filesList} />
    </>
  );
}

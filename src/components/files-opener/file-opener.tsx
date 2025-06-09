import { FileDTO } from "@/services/models/files-model";
import { useEffect, useState } from "react";
import AudioPlayer from "./players/audio-player";
import VideoPlayer from "./players/video-player";
import { SortFactory } from "@/services/strategies/order-by-strategies";
import DocumentViewer from "./viewers/document-viewer";
import ImageViewer from "./viewers/image-viewer";
import fileUpdateEvent from "@/events/FileUpdateEvent";

export default function FileOpener() {
  const [filesList, setFileList] = useState<Array<FileDTO>>();

  useEffect(() => {
    const handler = (files: Array<FileDTO>) => {
      const orderBy = localStorage.getItem("sort_by")
        ? JSON.parse(localStorage.getItem("sort_by")!)
        : "name";
      const newPlaylist = SortFactory(orderBy).sort(files);
      setFileList(newPlaylist);
    };

    fileUpdateEvent.addListener("list", handler);
    return () => {
      fileUpdateEvent.removeListener("list", handler);
    };
  }, []);

  return (
    <>
      <DocumentViewer />
      <ImageViewer filesList={filesList} />
      <AudioPlayer filesList={filesList} />
      <VideoPlayer filesList={filesList} />
    </>
  );
}

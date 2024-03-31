import { useEffect, useState } from "react";
import { FileModel } from "../services/models/FilesModel";
import VideoPlayer from "./VideoPlayer";
import AudioPlayer from "./AudioPlayer";
import ImageViewer from "./ImageViewer";
import { isAudio, isImage, isVideo } from "../helpers/FileTypeHelper";
import { FilesService } from "../services/FilesService";

interface PropsInterface {
  file?: FileModel,
  listedFiles: Array<FileModel>,
  path: string
}

export default function OpenendFile(props: PropsInterface) {
  const [openedVideo, setOpenendVideo] = useState<FileModel>();

  const [openedAudio, setOpenendAudio] = useState<FileModel>();
  const [audioPlayList, setAudioPlaylist] = useState<Array<string>>([]);

  const [openedImage, setOpenendImage] = useState<FileModel>();
  const [imagesList, setImagesList] = useState<Array<string>>([]);

  function closeAllFiles() {
    setOpenendAudio(null);
    setOpenendVideo(null);
    setOpenendImage(null);
  }

  function loadFile() {
    closeAllFiles();

    let fileType = props.file.type;
    if (fileType) {
      if (isVideo(fileType)) {
        setOpenendVideo(props.file);
        return;
      }
      if (isAudio(fileType)) {
        setOpenendAudio(props.file);
        setAudioPlaylist(props.listedFiles ? props.listedFiles.filter(f => f.type && isAudio(f.type))
          .map(f => FilesService.getSrcFile(`${props.file.parent}/${f.name}`)) : []);
        location.hash = encodeURIComponent(props.file.parent);
        return;
      }
      if (isImage(fileType)) {
        setOpenendImage(props.file);
        setImagesList(props.listedFiles ? props.listedFiles.filter(f => f.type && isImage(f.type)).map(f => f.href) : []);
        return;
      }
    }
    location.href = props.file.src;
  }

  function getNextImage() {
    let hashPath = location.hash;
    if (!hashPath || !openedImage || !imagesList)
      return null;
    let index = imagesList.indexOf(hashPath);
    if (index <= (imagesList.length - 1))
      return imagesList[index + 1];
    return null;
  }

  function getBackImage() {
    let hashPath = location.hash;
    if (!hashPath || !openedImage || imagesList.length == 0)
      return null;
    let index = imagesList.indexOf(hashPath);
    if (index > 0)
      return imagesList[index - 1];
    return null;
  }

  useEffect(() => {
    if (props.file == null) {
      setOpenendVideo(null);
      setOpenendImage(null);
    } else {
      loadFile();
    }
  }, [props.file])

  return (
    <>
      {openedVideo && <VideoPlayer src={openedVideo.src} backUrl={`#${openedVideo.parent}`} />}
      {openedAudio && <AudioPlayer src={openedAudio.src} playlist={audioPlayList} />}
      {openedImage && <ImageViewer
        src={openedImage.src}
        closeUrl={`#${openedImage.parent}`}
        nextUrl={getNextImage()}
        backUrl={getBackImage()}
      />}
    </>
  )
}
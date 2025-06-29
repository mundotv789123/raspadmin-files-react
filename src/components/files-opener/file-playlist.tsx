import { FileDTO } from "@/services/models/files-model";
import { faClose, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";

type PropsType = {
  classList?: string;
  title: string;
  playlist: Array<FileDTO>;
  playing: FileDTO | null;
  onClick?: (file: FileDTO) => void;
  onClose?: VoidFunction;
};

export default function Playlist({
  classList,
  title,
  playlist,
  playing,
  onClick,
  onClose,
}: PropsType) {
  const [playlistState, setPlaylist] = useState(playlist);
  const [playingState, setPlaying] = useState(playing);

  useEffect(() => {
    setPlaylist(playlist);
    setPlaying(playing);
  }, [playlist, playing]);

  function handlerClick(file: FileDTO) {
    if (onClick) {
      onClick(file);
    }
  }

  function handlerClose() {
    if (onClose) {
      onClose();
    }
  }

  return (
    <div
      className={`flex flex-grow justify-end overflow-hidden bg-zinc-700 bg-opacity-30 backdrop-blur-sm ${classList}`}
    >
      <div className="flex-grow" onClick={handlerClose} />
      <div className="flex flex-col w-full bg-black bg-opacity-45 animate-transform-from-end sm:max-w-xl">
        <div className="bg-black bg-opacity-30 flex p-3 border-b-1 border-stone-600">
          <p className="w-full text-xl font-bold">{title}</p>
          <button className="float-end end-0 mx-2 absolute text-lg">
            <FontAwesomeIcon icon={faClose} onClick={handlerClose} />
          </button>
        </div>
        <div className="flex flex-col p-2 overflow-y-auto gap-2">
          {playlistState.map((file, key) => (
            <div
              key={key}
              onClick={() => handlerClick(file)}
              className={`grid grid-cols-[2.5rem_calc(100%_-_2.5rem)] cursor-pointer gap-2 bg-opacity-50 p-2 rounded-md hover:bg-stone-600 hover:bg-opacity-50 border-1 ${file.src == playingState?.src ? 'border-emerald-400 bg-stone-600' : 'border-transparent'}` }
            >
              <div className="flex flex-col justify-center items-center w-10 h-10 overflow-hidden rounded-md">
                <Image
                  src={file.icon ?? ""}
                  alt={file.name}
                  className="h-full w-full top-0 left-0 object-cover"
                  width={512}
                  height={512}
                  unoptimized
                />
              </div>
              <div className="flex gap-2 items-center">
                <a
                  href={file.href}
                  onClick={(e) => e.preventDefault()}
                  className="overflow-hidden text-nowrap text-ellipsis"
                >
                  {file.name}
                </a>
                {file.src == playingState?.src && (
                  <FontAwesomeIcon
                    icon={faVolumeHigh}
                    className="ms-auto me-2"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

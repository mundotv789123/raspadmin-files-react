/* eslint-disable @next/next/no-img-element */
import { FileOpenEvent } from "@/app/page";
import { FileDTO } from "@/services/models/files-model";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { EventEmitter } from "stream";

const isImage = (type: string) => type.match(/image\/([a-z]{1,4})/);

type PropsType = {
  filesEvent: EventEmitter;
  filesList?: Array<FileDTO>;
};

export default function ImageViewer({ filesEvent, filesList }: PropsType) {
  const [file, setFile] = useState<FileDTO | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  function handlerCloseFile() {
    if (imageRef.current) {
      imageRef.current.src = "";
    }
    setFile(null);
  }

  useEffect(() => {
    const handlerOpen = (event: FileOpenEvent) => {
      if (!event.file.type || !isImage(event.file.type)) {
        setFile(null);
        return;
      }

      event.eventCalled = true;
      setFile(event.file);
    };

    filesEvent.addListener("open", handlerOpen);
    return () => {
      filesEvent.removeListener("open", handlerOpen);
    };
  }, [filesEvent, filesList]);

  return (
    file && (
      <div className="fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center flex-col bg-black z-20">
        <button onClick={handlerCloseFile} className=" absolute top-0 end-0 m-2">
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <img
          src={file.src}
          className=""
          ref={imageRef}
          alt={file.name}
        />
      </div>
    )
  );
}

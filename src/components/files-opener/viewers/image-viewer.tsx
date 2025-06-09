/* eslint-disable @next/next/no-img-element */
import fileUpdateEvent, { FileOpenEvent } from "@/events/FileUpdateEvent";
import { FileDTO } from "@/services/models/files-model";
import { SortFactory } from "@/services/strategies/order-by-strategies";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

const isImage = (type: string) => type.match(/image\/([a-z]{1,4})/);

type PropsType = {
  filesList?: Array<FileDTO>;
};

export default function ImageViewer({ filesList }: PropsType) {
  const [file, setFile] = useState<FileDTO | null>(null);
  const [imagesList, setImagesList] = useState<Array<FileDTO> | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

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

      if (filesList) {
        setImagesList(
          filesList.filter((file) => file.type && isImage(file.type))
        );
      }
    };

    const changeFileSort = (sort: string) => {
      setImagesList((playlist) => playlist && SortFactory(sort).sort(playlist));
    };

    fileUpdateEvent.addListener("open", handlerOpen);
    fileUpdateEvent.addListener("change-sort", changeFileSort);
    return () => {
      fileUpdateEvent.removeListener("open", handlerOpen);
      fileUpdateEvent.removeListener("change-sort", changeFileSort);
    };
  }, [filesList]);

  function handlerScrollToLeft() {
    imagesRef.current?.scrollBy({
      left: 200,
      behavior: "smooth",
    });
  }

  function handlerScrollToRight() {
    imagesRef.current?.scrollBy({
      left: -200,
      behavior: "smooth",
    });
  }

  return (
    file && (
      <div className="fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center flex-col bg-black z-20">
        <button
          onClick={handlerCloseFile}
          className=" absolute top-0 end-0 m-2"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <img src={file.src} className="h-full" ref={imageRef} alt={file.name} />
        <div className="h-40 flex">
          <button
            className="p-2 hover:text-gray-200"
            onClick={handlerScrollToRight}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="flex gap-2 px-2 py-1 overflow-hidden" ref={imagesRef}>
            {imagesList?.map((image, index) => (
              <img
                key={index}
                alt={file.name}
                src={image.src}
                className={`h-full ${
                  image.src == file?.src ? "outline" : ""
                } hover:outline outline-1`}
                onClick={() => setFile(image)}
              />
            ))}
          </div>
          <button
            className="p-2 hover:text-gray-200"
            onClick={handlerScrollToLeft}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    )
  );
}

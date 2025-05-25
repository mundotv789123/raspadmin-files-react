/* eslint-disable @next/next/no-img-element */
import { FileOpenEvent } from "@/app/page";
import { FileDTO } from "@/services/models/files-model";
import { SortFactory } from "@/services/strategies/order-by-strategies";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
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

    filesEvent.addListener("open", handlerOpen);
    filesEvent.addListener("change-sort", changeFileSort);
    return () => {
      filesEvent.removeListener("open", handlerOpen);
      filesEvent.removeListener("change-sort", changeFileSort);
    };
  }, [filesEvent, filesList]);

  function handlerScrollToLeft() {
    imagesRef.current?.scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  }

  function handlerScrollToRight() {
    imagesRef.current?.scrollBy({
      left: -200,
      behavior: 'smooth'
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
          <button className="p-2 hover:text-gray-200" onClick={handlerScrollToRight}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="flex gap-2 px-2 py-1 overflow-hidden" ref={imagesRef}>
          {imagesList?.map((image, index) => (
            <img
              key={index}
              alt={file.name}
              src={image.src}
              className={`h-full ${image.src == file?.src ? 'outline' : ''} hover:outline outline-1`}
              onClick={() => setFile(image)}
            />
          ))}
          </div>
          <button className="p-2 hover:text-gray-200" onClick={handlerScrollToLeft}>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
        {/* <div
          id="controls-carousel"
          className="relative w-full"
          data-carousel="static"
        >
          <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
            <div className="duration-700 ease-in-out" data-carousel-item>
              <img
                src={file?.src}
                className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                alt="..."
              />
            </div>
          </div>
          <button
            type="button"
            className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-prev
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                className="w-4 h-4 text-white rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>
          <button
            type="button"
            className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-next
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                className="w-4 h-4 text-white rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div> */}
      </div>
    )
  );
}

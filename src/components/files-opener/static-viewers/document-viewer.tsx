import { FileOpenEvent } from "@/app/page";
import { FileDTO } from "@/services/models/files-model";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { EventEmitter } from "stream";

const isDocument = (type: string) => type.match(/application\/(pdf)/);

type PropsType = {
  filesEvent: EventEmitter;
};

export default function DocumentViewer({ filesEvent }: PropsType) {
  const [file, setFile] = useState<FileDTO | null>(null);
  const documentRef = useRef<HTMLIFrameElement>(null);

  function handlerCloseFile() {
    if (documentRef.current) {
      documentRef.current.src = "";
    }
    setFile(null);
  }

  useEffect(() => {
    const handlerOpen = (event: FileOpenEvent) => {
      if (!event.file.type || !isDocument(event.file.type)) {
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
  }, [filesEvent]);

  return (
    file && (
      <div className="fixed top-0 left-0 bottom-0 right-0 bg-black z-20">
        <button onClick={handlerCloseFile} className="float-end me-2">
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <iframe
          src={file.src}
          className="w-full h-full"
          ref={documentRef}
        ></iframe>
      </div>
    )
  );
}

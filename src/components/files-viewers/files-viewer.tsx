import { FileDTO } from "@/services/models/files-model";
import { MouseEvent, useEffect, useState } from "react";
import EventEmitter from "events";
import Image from "next/image";

export default function FilesViewer(props: { filesEvent: EventEmitter, hidden: boolean, filter?: string }) {
  const [filesList, setFileList] = useState<Array<FileDTO>>();

  useEffect(() => {
    const handler = (files: Array<FileDTO>) => {
      setFileList(files);
    }

    props.filesEvent.addListener("list", handler);
    return () => {
      props.filesEvent.removeListener("list", handler);
    };
  }, [props.filesEvent])

  function openFileHandler(event: MouseEvent<HTMLAnchorElement>, file: FileDTO) {
    if (file.is_dir) {
      return;
    }

    event.preventDefault();
    props.filesEvent.emit("open", file);
  }

  if (!filesList)
    return <></>;

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-7 md:grid-cols-5 sm:grid-cols-3 gap-4 p-2`}>
      {(props.hidden ? [] : filesList).filter(file => !props.filter || file.name.toLowerCase().includes(props.filter.toLowerCase())).map((file, index) =>
        <a
          className="p-2 hover:shadow-xl cursor-pointer hover:bg-white hover:bg-opacity-30 hover:z-10 transition-colors duration-300"
          key={index}
          href={file.href}
          onClick={e => openFileHandler(e, file)}
        >
          <div className="items-center text-center h-32 overflow-hidden hover:overflow-visible">
            <div className="flex flex-col justify-center items-center w-20 h-20 overflow-hidden mx-auto">
              <Image src={file.icon!} alt={file.name} className="h-full w-full top-0 left-0 object-cover" unoptimized width={512} height={512}/>
            </div>
            <p className="file-name font-bold" style={{ textShadow: 'black 0px 1px 5px' }}>
              {file.name}
            </p>
          </div>
        </a>
      )}
    </div>
  )
}
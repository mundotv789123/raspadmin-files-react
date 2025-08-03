import { FileDTO } from "@/services/models/files-model";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import moment from "moment";
import { SortFactory } from "@/services/strategies/order-by-strategies";
import { useLocalStorage } from "@/hooks/local-storange-hook";
import { FileDownloadHelper } from "@/helpers/file-download-helper";
import fileUpdateEvent, { FileOpenEvent } from "@/events/FileUpdateEvent";

type PropsType = {
  hidden: boolean;
  filter?: string;
};

export default function FilesViewer({ hidden, filter }: PropsType) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [fileSelected, setFileSelected] = useState<FileDTO | null>(null);

  const [filesListOrig, setFileListOrig] = useState<Array<FileDTO>>();
  const [sortStrategyName, setSortStrategyName] = useLocalStorage<string>(
    "sort_by",
    "name"
  );

  const filesList = useMemo(() => {
    const sortStrategy = SortFactory(sortStrategyName);
    if (filesListOrig) {
      return sortStrategy.sort(
        filesListOrig.filter(
          (file) =>
            !filter || file.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
    return [];
  }, [filesListOrig, sortStrategyName, filter]);

  function changeSortStrategy(sort: string) {
    setSortStrategyName(sort);
    fileUpdateEvent.emit("change-sort", sort);
  }

  useEffect(() => {
    const handler = (files: Array<FileDTO>) => {
      setFileListOrig(files);
    };

    fileUpdateEvent.addListener("list", handler);
    document.addEventListener("click", hideDropDown);

    return () => {
      fileUpdateEvent.removeListener("list", handler);
      document.removeEventListener("click", hideDropDown);
    };
  }, []);

  function openFileHandler(
    event: MouseEvent<HTMLAnchorElement>,
    file: FileDTO
  ) {
    if (file.is_dir) {
      return;
    }

    event.preventDefault();
    const fileOpenEvent: FileOpenEvent = {
      eventCalled: false,
      file: file,
    };
    fileUpdateEvent.emit("open", fileOpenEvent);
    if (!fileOpenEvent.eventCalled) {
      FileDownloadHelper.downloadFile(fileOpenEvent.file);
    }
  }

  function showDropDown(
    event: globalThis.MouseEvent | MouseEvent,
    file: FileDTO | null = null
  ) {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;
    event.preventDefault();

    setFileSelected(file);
    dropdown.classList.remove("hidden");

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const dropdownWidth = dropdown.offsetWidth;
    const dropdownHeight = dropdown.offsetHeight;

    let posX = event.pageX;
    let posY = event.pageY;

    if (posX + dropdownWidth > screenWidth) {
      posX = posX - dropdownWidth;
    }

    if (posY + dropdownHeight > screenHeight) {
      posY = posY - dropdownHeight;
    }

    dropdown.style.left = (posX < 0 ? 0 : posX) + "px";
    dropdown.style.top = posY + "px";
  }

  function hideDropDown(event: globalThis.MouseEvent | MouseEvent) {
    const element = dropdownRef.current;
    if (!element) return;

    if (event.target && element.contains(event.target as Node)) {
      return;
    }

    setFileSelected(null);
    element.classList.add("hidden");
  }

  if (!filesList) return <></>;

  return (
    <>
      <div
        className="fixed z-20 bg-black/50 p-3 hidden shadow-sm border-gray-400 border w-96 max-w-full"
        ref={dropdownRef}
      >
        {fileSelected && (
          <>
            <p>
              <b>Nome:</b> {fileSelected.name}
            </p>
            <p>
              <b>Data Atualização:</b>{" "}
              {moment(fileSelected.updated_at?.toString()).format(
                "DD/MM/yyyy HH:mm"
              )}
            </p>
            <p>
              <b>Data Criação:</b>{" "}
              {moment(fileSelected.created_at?.toString()).format(
                "DD/MM/yyyy HH:mm"
              )}
            </p>
          </>
        )}
        <hr className="my-2" />
        <p>
          <b>Ordenar por:</b>
        </p>
        <div className="flex gap-1">
          <select
            className="bg-black/25 p-1 rounded-sm w-full my-1 border-gray-400 border"
            onChange={(e) => changeSortStrategy(e.target.value)}
            value={sortStrategyName}
          >
            <option value={"name"}>Nome</option>
            <option value={"date"}>Data</option>
          </select>
        </div>
        {fileSelected && !fileSelected.is_dir && (
          <button
            className="bg-black/25 w-full p-1 border-gray-400 border hover:bg-black/40"
            onClick={() =>
              fileSelected && FileDownloadHelper.downloadFile(fileSelected)
            }
          >
            Download
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-7 md:grid-cols-5 sm:grid-cols-3 gap-4 p-2">
        {(hidden ? [] : filesList).map((file, index) => (
          <a
            className="p-2 hover:shadow-xl cursor-pointer hover:bg-white/30 hover:z-10 transition-colors duration-300"
            key={index}
            href={file.href}
            onClick={(e) => openFileHandler(e, file)}
            onContextMenu={(e) => showDropDown(e, file)}
          >
            <div className="items-center text-center h-32 overflow-hidden hover:overflow-visible">
              <div className="flex flex-col justify-center items-center w-20 h-20 overflow-hidden mx-auto">
                <Image
                  src={file.icon!}
                  alt={file.name}
                  className="h-full w-full top-0 left-0 object-cover"
                  unoptimized
                  width={512}
                  height={512}
                />
              </div>
              <p
                className="file-name font-bold"
                style={{ textShadow: "black 0px 1px 5px" }}
              >
                {file.name}
              </p>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}

import { FileDTO } from "@/services/models/files-model";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import EventEmitter from "events";
import Image from "next/image";
import moment from "moment";
import { SortFactory } from "@/services/strategies/order-by-strategies";
import { useLocalStorage } from "@/app-hooks/local-storange-hook";

export default function FilesViewer(props: { filesEvent: EventEmitter, hidden: boolean, filter?: string }) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [fileSelected, setFileSelected] = useState<FileDTO | null>(null);

  const [filesListOrig, setFileListOrig] = useState<Array<FileDTO>>();
  const [sortStrategyName, setSortStrategyName] = useLocalStorage<string>('sort_by', 'name');

  const filesList= useMemo(() => {
    const sortStrategy = SortFactory(sortStrategyName);
    if (filesListOrig) {
      return sortStrategy.sort(filesListOrig.filter(file => 
        !props.filter || file.name.toLowerCase().includes(props.filter.toLowerCase())
      ));
    }
    return []
  }, [filesListOrig, sortStrategyName, props.filter]);

  function changeSortStrategy(sort: string) {
    setSortStrategyName(sort);
  }

  useEffect(() => {
    const handler = (files: Array<FileDTO>) => {
      setFileListOrig(files);
    }

    props.filesEvent.addListener("list", handler);
    document.addEventListener('click', hideDropDown);

    return () => {
      props.filesEvent.removeListener("list", handler);
      document.removeEventListener('click', hideDropDown);
    };
  }, [props.filesEvent])

  function openFileHandler(event: MouseEvent<HTMLAnchorElement>, file: FileDTO) {
    if (file.is_dir) {
      return;
    }

    event.preventDefault();
    props.filesEvent.emit("open", file);
  }

  function showDropDown(event: globalThis.MouseEvent | MouseEvent, file: FileDTO | null = null) {
    const dropdown = dropdownRef.current;
    if (!dropdown)
      return;
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

    dropdown.style.left = posX + 'px';
    dropdown.style.top = posY + 'px';
  }

  function hideDropDown(event: globalThis.MouseEvent | MouseEvent) {
    const element = dropdownRef.current;
    if (!element)
      return;

    if (event.target && element.contains(event.target as Node)) {
      return;
    }

    setFileSelected(null);
    element.classList.add("hidden");
  }

  if (!filesList)
    return <></>;

  return (
    <>
      <div className="fixed z-20 bg-black bg-opacity-50 p-3 hidden backdrop-blur-sm shadow-sm border-gray-400 border w-96" ref={dropdownRef}>
        {fileSelected &&
          <>
            <p><b>Nome:</b> {fileSelected.name}</p>
            <p><b>Data Atualização:</b> {moment(fileSelected.updated_at?.toString()).format("DD/MM/yyyy HH:mm")}</p>
            <p><b>Data Criação:</b> {moment(fileSelected.created_at?.toString()).format("DD/MM/yyyy HH:mm")}</p>
          </>
        }
        <hr className="my-2" />
        <p><b>Ordenar por:</b></p>
        <div className="flex gap-1">
          <select 
            className="bg-black bg-opacity-25 p-1 rounded-sm w-full my-1 border-gray-400 border"
            onChange={e => changeSortStrategy(e.target.value)} value={sortStrategyName}>
            <option value={'name'}>Nome</option>
            <option value={'date'}>Data</option>
          </select>
        </div>
      </div>
      <div className='grid grid-cols-2 lg:grid-cols-7 md:grid-cols-5 sm:grid-cols-3 gap-4 p-2'>
        {(props.hidden ? [] : filesList).map((file, index) =>
          <a
            className="p-2 hover:shadow-xl cursor-pointer hover:bg-white hover:bg-opacity-30 hover:z-10 transition-colors duration-300"
            key={index}
            href={file.href}
            onClick={e => openFileHandler(e, file)}
            onContextMenu={e => showDropDown(e, file)}
          >
            <div className="items-center text-center h-32 overflow-hidden hover:overflow-visible">
              <div className="flex flex-col justify-center items-center w-20 h-20 overflow-hidden mx-auto">
                <Image src={file.icon!} alt={file.name} className="h-full w-full top-0 left-0 object-cover" unoptimized width={512} height={512} />
              </div>
              <p className="file-name font-bold" style={{ textShadow: 'black 0px 1px 5px' }}>
                {file.name}
              </p>
            </div>
          </a>
        )}
      </div>
    </>
  )
}
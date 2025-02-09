'use client';

import FileOpener from "@/components/files-opener/file-opener";
import FilesViewer from "@/components/files-viewers/files-viewer";
import LoginFormModal from "@/components/login-form-modal/login-form-modal";
import { FileDTO } from "@/services/models/files-model";
import FilesService from "@/services/services/files-service";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EventEmitter from "events";
import { useEffect, useMemo, useRef, useState } from "react";

const fileUpdateEvent = new EventEmitter();
const filesService = new FilesService();

export default function Home() {

  const [path, setPath] = useState<string>();
  const pathSplited = useMemo(() => path?.split("/").filter((path, key) => ((path == "") == (key == 0))), [path]);

  const [filesTab, setFilesTab] = useState<Array<FileDTO>>();

  const [loading, setLoading] = useState(true);
  const [loginRequired, setLoginRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [filesBar, setFilesBar] = useState(false);

  const [filter, setFilter] = useState<string>();
  const filterInputRef = useRef<HTMLInputElement>(null);

  function updateHashHandler() {
    setPath(location.hash ? decodeURIComponent(location.hash.substring(1)) : '/');
  }

  useEffect(() => {
    filesService.getFiles("/").then(files => {
      setFilesTab(files);
    }).catch(error => {
      if (error.status == 401) {
        setLoginRequired(true);
      }
    });

    updateHashHandler();
    window.addEventListener('hashchange', updateHashHandler);
    return () => window.removeEventListener('hashchange', updateHashHandler);
  }, []);

  useEffect(() => {
    if (!path) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    filesService.getFiles(path).then(files => {
      fileUpdateEvent.emit("start", null);
      if (files.length == 0) {
        setErrorMessage("Pasta vazia");
        return;
      }
      if (files.length == 1 && files[0].open) {
        fileUpdateEvent.emit("open", files[0]);
        location.href = `#/${files[0].parent}`
        return;
      }
      fileUpdateEvent.emit("list", files);
      setFilter("");
      if (filterInputRef.current) 
        filterInputRef.current.value = "";
    }).catch(error => {
      if (error.status == 401) {
        setLoginRequired(true);
        return;
      }
      setErrorMessage(error.message);
    }).finally(() => {
      setLoading(false);
    })
  }, [path])

  return (
    <div className="grid grid-cols-[0_auto] md:grid-cols-[14rem_auto] grid-rows-[64px_auto] h-screen bg-black bg-opacity-40 transition-all ease-in-out">
      <header className="flex items-center justify-center bg-black bg-opacity-50 overflow-hidden">
        <a className="text-2xl text-center font-bold" href="#">RaspAdmin</a>
      </header>
      <nav className="grid grid-cols-[1.75rem_calc(100%-8.75rem)_7rem] items-center px-8 bg-black bg-opacity-50 overflow-x-auto">
        <div>
          <button onClick={() => setFilesBar(!filesBar)} className="text-lg me-2">
            <FontAwesomeIcon icon={faBars} className="md:hidden" />
          </button>
        </div>
        <div className="flex">
          {pathSplited?.map((path, key) =>
            <p className="font-bold md:text-lg max-w-44 min-w-6 overflow-hidden text-nowrap text-ellipsis" key={key}>/
              <a href={`#${pathSplited.map(p => p).splice(0, key + 1).join("/")}`} className="hover:bg-slate-500 p-0.5 rounded-md">
                {path == '' ? 'home' : path}
              </a>
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <input
            type="text"
            placeholder="pesquisar"
            className="w-28 focus:w-44 transition-all ease-in-out outline-none bg-zinc-600 p-1 py-0.5 text-white bg-opacity-45 border border-white backdrop-blur-sm rounded-md"
            onInput={(e) => setFilter(e.currentTarget.value)}
            ref={filterInputRef}
          />
        </div>
      </nav>
      <aside className="bg-black bg-opacity-50 overflow-y-auto">
        <div className="flex flex-col">
          {filesTab?.map((file, key) =>
            (<a href={file.href} className="text-lg font-bold hover:bg-white hover:bg-opacity-30 p-2" key={key}>{file.name}</a>)
          )}
        </div>
        <div className={`fixed top-0 bottom-0 left-0 right-0 transform md:hidden bg-black bg-opacity-30 backdrop-blur-sm flex z-30 ${filesBar ? '' : 'hidden'}`}>
          <div className={`w-56 flex flex-col bg-black h-screen bg-opacity-40 ${filesBar ? 'animate-transform-from-start' : ''}`}>
            {filesTab?.map((file, key) =>
              (<a href={file.href} className="text-lg font-bold hover:bg-white hover:bg-opacity-30 p-2" key={key}>{file.name}</a>)
            )}
          </div>
          <div onClick={() => setFilesBar(false)} className="flex-grow" />
        </div>
      </aside>
      <main className="overflow-y-auto bg-zinc-800 bg-opacity-30">
        <FileOpener filesEvent={fileUpdateEvent} />
        {!loading && errorMessage && <h1 className="text-xl font-bold text-center mt-1">{errorMessage}</h1>}
        {loading && <div className="m-2"><div className="bg-white h-2 animate-loading"></div></div>}
        <FilesViewer filesEvent={fileUpdateEvent} hidden={loading || errorMessage != null} filter={filter} />
      </main>
      {loginRequired && <LoginFormModal />}
    </div>
  );
}

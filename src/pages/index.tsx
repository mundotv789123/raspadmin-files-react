import FilesMain from "../components/FilesMain"
import FilesList from "../components/FilesList"
import { useEffect, useState } from "react";
import LoginMenu from "../components/LoginMenu"
import { FilesService } from "../services/FilesService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Aside, CollapseButtom, Container, Header, Main, Nav, PathLink, SearchInput } from "./styles";
import OpenedFile from "../components/OpenedFile";
import { FileModel } from "../services/models/FilesModel";
import { FileError } from "../services/exceptions/FilesErros";

export default function App() {
  const service = new FilesService();

  const [hash, setHash] = useState<string>("");

  const [tabFiles, setTabFiles] = useState<Array<FileModel>>(null);
  const [mainFiles, setMainFiles] = useState<FileModel[] | null>(null);
  const [fileLoading, setFileLoading] = useState<number>(-1);

  const [login, setLogin] = useState<boolean>(false);
  const [text, setText] = useState<string>();

  const [openedFile, setOpenedFile] = useState<FileModel>(null);

  const [barOpen, setBarOpen] = useState(false);
  const [path, setPath] = useState<string>(null);
  const [search, setSearch] = useState<string>('');

  function loadPage() {
    if (tabFiles == null) {
      loadTabFiles();
    }
  }

  function loadTabFiles() {
    service.getFiles("/").then((files) => {
      setTabFiles(files);
    }).catch((ex: FileError) => {
      if (ex.code == 401) {
        setLogin(true);
      }
      if(ex.code == 503 || ex.code == 502) {
        setTimeout(() => {
          loadPage();
        }, 5000);
      }
      setText(ex.message);
    });
  }

  function loadMainFiles(path: string = decodeURIComponent(location.hash.substring(1))) {
    if (mainFiles !== null) {
      let fileFind = mainFiles.filter(f => decodeURIComponent(f.href) == decodeURIComponent(hash));
      if (fileFind.length == 1 && !fileFind[0].is_dir)
        setFileLoading(mainFiles.indexOf(fileFind[0]));
      else {
        if (path != openedFile?.parent) {
          setMainFiles(null);
        }
      }
    }

    service.getFiles(path).then((files) => {
      setFileLoading(-1);
      if (files.length == 1 && files[0].open) {
        setOpenedFile(files[0]); 
        loadMainFiles(files[0].parent);
        return;
      }
      setMainFiles(files);
    }).catch((ex: FileError) => {
      if (ex.code == 401) 
        setLogin(true);
      setText(ex.message);
    });
  }

  function toggleBar() {
    setBarOpen(!barOpen);
  }

  useEffect(() => {
    window.onhashchange = () => setHash(location.hash);
    loadTabFiles();
  }, [])

  useEffect(() => {
    setPath(decodeURIComponent(hash.substring(1)));
    setOpenedFile(null);
    loadMainFiles();
  }, [hash]);

  return (
    <Container style={{ gridTemplateColumns: (barOpen ? "220px auto" : null) }}>
      <Header>
        <h2 className={"title"}><a href={"#"}>{process.env.NEXT_PUBLIC_APP_NAME ?? 'RaspAdmin'}</a></h2>
      </Header>

      <Nav>
        <CollapseButtom onClick={toggleBar}>
          <FontAwesomeIcon icon={faBars} />
        </CollapseButtom>
        <PathLink>
          <p>/</p><a href="#/" title="home">home</a>
          {path && path.split("/").filter(p => p).map((p, i) => {
            let link = '';
            path.split('/').filter(p => p).forEach((l, li) => { if (li <= i) link += `/${l}` });
            return (<><p>/</p><a key={i} href={`#${encodeURIComponent(link)}`} title={p}>{p}</a></>)
          })}
        </PathLink>
        <SearchInput placeholder="Pesquisar" onChange={(e) => setSearch(e.currentTarget.value)} value={search} />
      </Nav>
      <Main>
        {tabFiles && <FilesList files={tabFiles.filter(e => e.is_dir)} />}
      </Main>
      <Aside>
        <FilesMain files={mainFiles} text={text} search={search} fileLoading={fileLoading} />
      </Aside>
      <OpenedFile file={openedFile} path={path} listedFiles={mainFiles}/>
      {login && <LoginMenu onSuccess={loadPage} />}
    </Container>
  )
}
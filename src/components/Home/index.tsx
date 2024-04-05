import { useEffect, useState } from "react";
import { FilesService } from "../../services/FilesService";
import { FileModel } from "../../services/models/FilesModel";
import { FileError } from "../../services/exceptions/FilesErros";
import { Aside, CollapseButtom, Container, Header, Main, Nav, SearchInput, SideBar, SideBarContainer } from "./styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PathNavigator from "../../elements/PathNavigator";
import FilesList from "../FilesList";
import FilesMain from "../FilesMain";
import OpenendFile from "../OpenedFile";
import LoginMenu from "../LoginMenu";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    const service = FilesService.getInstance();
  
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
      setLogin(false);
      if (tabFiles == null) {
        loadTabFiles();
      }
      loadMainFiles();
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

      setText(null);

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
      setHash(location.hash);
      window.onhashchange = () => setHash(location.hash);
      loadTabFiles();
    }, [])
  
    useEffect(() => {
      setPath(decodeURIComponent(hash.substring(1)));
      setOpenedFile(null);
      loadMainFiles();
    }, [hash]);
  
    return (
      <Container>
        <Header>
          <h2 className={"title"}><a href={"#"}>{process.env.NEXT_PUBLIC_APP_NAME ?? 'RaspAdmin'}</a></h2>
        </Header>
        <Nav>
          <CollapseButtom onClick={toggleBar}>
            <FontAwesomeIcon icon={faBars} />
          </CollapseButtom>
          <PathNavigator path={path}/>
          <SearchInput placeholder="Pesquisar" onChange={(e) => setSearch(e.currentTarget.value)} value={search} />
        </Nav>
        <Main>
          {tabFiles && <FilesList files={tabFiles.filter(e => e.is_dir)} />}
        </Main>
        <SideBarContainer style={{display: (barOpen ? null : "none") }}>
          <SideBar>
            {tabFiles && <FilesList files={tabFiles.filter(e => e.is_dir)} />}
          </SideBar>
          <div style={{width: "100%"}} onClick={() => setBarOpen(false)}>
          </div>
        </SideBarContainer>
        <Aside>
          <FilesMain files={mainFiles} text={text} search={search} fileLoading={fileLoading} />
        </Aside>
        <OpenendFile file={openedFile} path={path} listedFiles={mainFiles}/>
        {login && <LoginMenu onSuccess={loadPage} />}
      </Container>
    )
  }
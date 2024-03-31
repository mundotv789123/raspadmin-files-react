import FilesBlocks from "../components/FilesMain"
import FilesList from "../components/FilesList"
import { useEffect, useState } from "react";
import LoginMenu from "../components/LoginMenu"
import VideoPlayer from "../components/VideoPlayer"
import { FilesService } from "../services/FilesService";
import { FileLinkModel, FileModel } from "../services/models/FilesModel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import AudioPlayer from "../components/AudioPlayer";
import { isAudio, isImage, isVideo } from "../helpers/FileTypeHelper";
import ImageViewer from "../components/ImageViewer";
import { Aside, CollapseButtom, Container, Header, Main, Nav, PathLink, SearchInput } from "./styles";

export default function App() {
  const service = new FilesService();

  const [hash, setHash] = useState<string>("");

  const [tabFiles, setTabFiles] = useState<FileModel[]>([]);
  const [mainFiles, setMainFiles] = useState<FileModel[] | null>(null);
  const [fileLoading, setFileLoading] = useState<number>(-1);

  const [login, setLogin] = useState<boolean>(false);
  const [text, setText] = useState<string>();

  const [openedVideo, setOpenendVideo] = useState<FileLinkModel>();

  const [openedAudio, setOpenendAudio] = useState<FileLinkModel>();
  const [audioPlayList, setAudioPlaylist] = useState<Array<string>>([]);

  const [openedImage, setOpenendImage] = useState<FileLinkModel>();
  const [imagesList, setImagesList] = useState<Array<string>>([]);

  const [barOpen, setBarOpen] = useState(false);

  const [path, setPath] = useState<string>(null);

  const [search, setSearch] = useState<string>('');

  function loadPage() {
    setLogin(false);
    service.getFiles(null, (files) => {
      setTabFiles(files.filter(file => file.is_dir).map(file => {
        file.href = `#/${file.name}`;
        return file;
      }));
      loadMainFiles();
    }, (status, message) => {
      if (status == 401)
        return setLogin(true);

      if (status == 503 || status == 502)
        setTimeout(() => {
          setText(null);
          loadPage();
        }, 5000);
      console.log(message);
      setText(message);
    });
  }

  function loadMainFiles(hashPath: string = location.hash.substring(1), callback: ((files: Array<FileModel>) => void) | null = null) {
    if (mainFiles !== null) {
      if (openedAudio == null || openedAudio.parent != decodeURIComponent(hashPath)) {
        let fileFind = mainFiles.filter(f => decodeURIComponent(f.href) == decodeURIComponent(hash));
        if (fileFind.length == 1 && !fileFind[0].is_dir) {
          setFileLoading(mainFiles.indexOf(fileFind[0]));
        } else {
          setSearch("");
          setMainFiles(null);
        }
      }
    }

    setText(null);
    if (openedAudio)
      openedAudio.src = null;

    service.getFiles(decodeURIComponent(hashPath), (files, path) => {
      setFileLoading(-1);
      if (files.length == 1 && files[0].open) {
        let link = service.openFile(files[0], path);
        loadMainFiles(link.parent, (main_files) => openFile(link, main_files));
        return;
      }

      setPath(path);
      let main_files = files.map(file => {
        file.href = `#/${encodeURIComponent(path ? `${path}/${file.name}` : `${file.name}`)}`;
        return file;
      });

      setMainFiles(main_files);
      if (callback)
        callback(main_files);
    }, (status, message) => {
      if (status == 401)
        return setLogin(true);
      setText(message);
    })
  }

  function openFile(file: FileLinkModel, main_files: Array<FileModel>) {
    closeAllFiles();
    if (file.type) {
      if (isVideo(file.type)) {
        setOpenendVideo(file);
        return;
      }
      if (isAudio(file.type)) {
        setOpenendAudio(file);
        setAudioPlaylist(main_files ? main_files.filter(f => f.type && isAudio(f.type))
          .map(f => service.getFileSrc(`${file.parent}/${f.name}`)) : []);
        location.hash = file.parent;
        return;
      }
      if (isImage(file.type)) {
        setOpenendImage(file);
        setImagesList(main_files ? main_files.filter(f => f.type && isImage(f.type)).map(f => f.href) : []);
        return;
      }
    }
    location.href = file.src;
  }

  function closeAllFiles() {
    setOpenendAudio(null);
    setOpenendVideo(null);
    setOpenendImage(null);
  }

  function toggleBar() {
    setBarOpen(!barOpen);
  }

  function getNextImage() {
    let hashPath = location.hash;
    if (!hashPath || !openedImage || !imagesList)
      return null;
    let index = imagesList.indexOf(hashPath);
    if (index <= (imagesList.length - 1))
      return imagesList[index + 1];
    return null;
  }

  function getBackImage() {
    let hashPath = location.hash;
    if (!hashPath || !openedImage || imagesList.length == 0)
      return null;
    let index = imagesList.indexOf(hashPath);
    if (index > 0)
      return imagesList[index - 1];
    return null;
  }

  useEffect(() => {
    window.onhashchange = () => setHash(location.hash);
    loadPage();
  }, [])

  useEffect(() => {
    setOpenendVideo(null);
    setOpenendImage(null);
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
          {path && path.split("/").map((p, i) => {
            let link = '';
            path.split('/').forEach((l, li) => { if (li <= i) link += `/${l}` });
            return (<><p>/</p><a key={i} href={`#${link}`} title={p}>{p}</a></>)
          })}
        </PathLink>
        <SearchInput placeholder="Pesquisar" onChange={(e) => setSearch(e.currentTarget.value)} value={search} />
      </Nav>
      <Main>
        <FilesList files={tabFiles.filter(e => e.is_dir)} />
      </Main>
      <Aside>
        <FilesBlocks files={mainFiles} text={text} search={search} fileLoading={fileLoading} />
      </Aside>
      {openedVideo && <VideoPlayer src={openedVideo.src} backUrl={`#${openedVideo.parent}`} />}
      {openedAudio && <AudioPlayer src={openedAudio.src} playlist={audioPlayList} />}
      {openedImage && <ImageViewer
        src={openedImage.src}
        closeUrl={`#${openedImage.parent}`}
        nextUrl={getNextImage()}
        backUrl={getBackImage()}
      />}
      {login && <LoginMenu onSuccess={loadPage} />}
    </Container>
  )
}
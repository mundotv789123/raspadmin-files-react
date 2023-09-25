import styled from "styled-components"
import FilesBlocks from "../components/FilesBlocks"
import FilesList from "../components/FilesList"
import { useEffect, useState } from "react";
import LoginMenu from "../components/LoginMenu"
import VideoPlayer from "../components/VideoPlayer"
import { FilesService } from "../services/FilesService";
import { FileLinkModel, FileModel } from "../services/models/FilesModel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import AudioPlayer from "../components/AudioPlayer";

const Container = styled.div`
    display: grid;
    grid-template-columns: 220px auto;
    grid-template-rows: 64px auto;
    grid-template-areas: "h n" "m a";
    height: 100vh;
    transition: grid-template-columns .2s;
    @media(max-width:950px) {
        grid-template-columns:0 auto
    }
`

const Header = styled.header`
    grid-area: h;
    display: flex;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.5);
    & .title {
        margin: auto;
    }
`

const CollapseButtom = styled.button`
    display: none;
    color: white;
    background-color: transparent;
    border: none;
    font-size: 15pt;
    margin: auto 20px;
    cursor: pointer;
    &:hover {
        color: #dddddd;
    }
    @media(max-width:950px) {
        display: block;
    }
`

const Nav = styled.nav`
    grid-area: n;
    display: flex;
    background: rgba(0, 0, 0, 0.5);
    overflow-x: scroll;
    white-space: nowrap;
`

const Main = styled.main`
    grid-area: m;
    overflow-y: scroll;
    background: rgba(0, 0, 0, 0.5);
`

const Aside = styled.aside`
    grid-area: a;
    overflow-y: scroll;
    background: rgba(9, 9, 9, 0.3);
`

const PathLink = styled.div`
    font-size: 11pt;
    font-weight: bold;
    margin: auto 25px;
    color: white;
    & a {
        color: white;
        margin: 0 2px;
        padding: 2px;
        border-radius: 5px;
        &:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }
    }
`

export default function App() {
    const service = new FilesService();

    const [tabFiles, setTabFiles] = useState<FileModel[]>([])
    const [mainFiles, setMainFiles] = useState<FileModel[] | null>(null)

    const [login, setLogin] = useState<boolean>(false)
    const [text, setText] = useState<string>()

    const [openedVideo, setOpenendVideo] = useState<FileLinkModel>()
    const [openedAudio, setOpenendAudio] = useState<FileLinkModel>()
    const [audioPlayList, setAudioPlaylist] = useState<Array<string>>([]);

    const [barOpen, setBarOpen] = useState(false);

    const [path, setPath] = useState<string>(null);

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
            setText(message);
        });
    }

    function loadMainFiles(hashPath: string = location.hash.substring(1), callback: ((files: Array<FileModel>) => void) | null = null) {
        setMainFiles(null);
        setText(null);
        service.getFiles(hashPath, (files, path) => {
            if (files.length == 1 && files[0].open) {
                let link = service.openFile(files[0], path);
                loadMainFiles(link.parent, (main_files) => openFile(link, main_files));
                return;
            }

            setPath(path);
            let main_files = files.map(file => {
                file.href = path ? `#/${path}/${file.name}` : `#/${file.name}`;
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
            if (file.type.match(/video\/(mp4|webm|ogg|mkv)/)) {
                setOpenendVideo(file);
                return;
            } 
            if (file.type.match(/audio\/(mpeg|mp3|ogg|(x-(pn-)?)?wav)/)) {
                setOpenendAudio(file);
                setAudioPlaylist(main_files ? main_files.filter(f => 
                    f.type.match(/audio\/(mpeg|mp3|ogg|(x-(pn-)?)?wav)/)).map(
                        f => service.getFileSrc(`${file.parent}/${f.name}`)
                    )
                : [])
                return;
            } 
        }
        location.href = file.src;
    }

    function closeAllFiles() {
        setOpenendAudio(null);
        setOpenendVideo(null);
    }

    function toggleBar() {
        setBarOpen(!barOpen);
    }
    
    useEffect(() => {
        window.onhashchange = () => {
            setOpenendVideo(null);
            loadMainFiles();
        }
        loadPage();
    }, [])

    return (
        <Container style={{gridTemplateColumns: (barOpen ? "220px auto" : null)}}>
            <Header>
                <h2 className={"title"}><a href={"#"}>RaspAdmin</a></h2>
            </Header>
            
            <Nav>
                <CollapseButtom onClick={toggleBar}>
                    <FontAwesomeIcon icon={faBars} />
                </CollapseButtom>
                <PathLink>
                    /<a href="#/">home</a>
                    {path && path.split("/").map((p, i) => {
                        let link = '';
                        path.split('/').forEach((l, li) => { if (li <= i) link += `/${l}` });
                        return (<>/<a key={i} href={`#${link}`}>{p}</a></>)
                    })}
                </PathLink>
            </Nav>
            <Main>
                <FilesList files={tabFiles.filter(e => e.is_dir)} />
            </Main>
            <Aside>
                <FilesBlocks files={mainFiles} text={text} />
            </Aside>
            {openedVideo && <VideoPlayer src={openedVideo.src} backUrl={`#${openedVideo.parent}`} />}
            {openedAudio && <AudioPlayer src={openedAudio.src} playlist={audioPlayList} />}
            {login && <LoginMenu onSuccess={loadPage} />}
        </Container>
    )
}
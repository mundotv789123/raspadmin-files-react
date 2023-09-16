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

    function loadMainFiles(hashPath: string = location.hash.substring(1)) {
        setMainFiles(null);
        setText(null);
        service.getFiles(hashPath, (files, path) => {
            if (files.length == 1 && files[0].open) {
                let link = service.openFile(files[0], path);
                openFile(link);
                loadMainFiles(link.parent);
                return;
            }

            setPath(path);
            setMainFiles(files.map(file => {
                file.href = path ? `#/${path}/${file.name}` : `#/${file.name}`;
                return file;
            }));
        }, (status, message) => {
            if (status == 401) 
                return setLogin(true);
            setText(message);
        })
    }

    function openFile(file: FileLinkModel) {
        if (file.type && file.type.match(/video\/(mp4|webm|ogg|mkv)/)) {
            setOpenendVideo(file);
        } else {
            location.href = file.src;
        }
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
                        return (<>/<a href={`#${link}`}>{p}</a></>)
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
            {login && <LoginMenu onSuccess={loadPage} />}
        </Container>
    )
}
import styled from "styled-components"
import FilesBlocks from "../components/FilesBlocks"
import FilesList from "../components/FilesList"
import { useEffect, useState } from "react";
import LoginMenu from "../components/LoginMenu"
import VideoPlayer from "../components/VideoPlayer"
import { fileFormat, getErrorMessage, getFiles, openFile } from "../libs/api";

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

const Nav = styled.nav`
    grid-area: n;
    display: flex;
    background: rgba(0, 0, 0, 0.5);
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

export default function App() {
    const [tabFiles, setTabFiles] = useState<fileFormat[]>([])
    const [files, setFiles] = useState<fileFormat[] | null>(null)
    const [login, setLogin] = useState<boolean>(false)
    const [text, setText] = useState<string>()
    const [video, setVideo] = useState<openFile>()

    function errorMessage(e: any) {
        let json: { status: number };
        try {
            json = e.toJSON();
        } catch {
            json = { status: 500 }
        }
        if (json.status == 401) {
            setLogin(true);
            return;
        }
        setText(getErrorMessage(json.status));
    }

    function updateTabFiles() {
        getFiles('', setTabFiles, errorMessage);
    }

    function updateFiles(hash: (string | null) = null, open = true) {
        hash = (hash == null || hash === '') ? '#' : hash
        setFiles(null);
        setText(null);
        getFiles(hash.substring(1), (files, file) => {
            if (file) {
                if (!open || hash == null)
                    return
                updateFiles(`#${file.parent}`, false);
                if (file.type.match(/video\/(mp4|webm|ogg|mkv)/)) {
                    setVideo(file)
                } else {
                    location.href = file.src;
                }
                return;
            }
            if (files.length === 0) {
                setText('Essa pasta está vazia!');
                return;
            }
            if (open)
                setVideo(null);
            setFiles(files)
        }, errorMessage)
    }

    function reloadPage() {
        setLogin(false)
        updateTabFiles()
        updateFiles(location.hash)
    }

    useEffect(() => {
        window.onhashchange = () => {
            updateFiles(location.hash)
        }
        updateTabFiles()
        updateFiles(location.hash)
    }, [])

    return (
        <Container>
            <Header>
                <h2 className={"title"}><a href={"#"}>RaspAdmin</a></h2>
            </Header>
            <Nav />
            <Main>
                <FilesList files={tabFiles.filter(e => e.is_dir)} />
            </Main>
            <Aside>
                <FilesBlocks files={files} text={text} />
            </Aside>
            {video && <VideoPlayer src={video.src} backUrl={`#${video.parent}`} />}
            {login && <LoginMenu onSuccess={reloadPage} />}
        </Container>
    )
}
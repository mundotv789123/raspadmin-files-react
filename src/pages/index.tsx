import styled from "styled-components"
import FilesBlocks from "../components/FilesBlocks"
import FilesList from "../components/FilesList"
import { useEffect, useState } from "react";
import LoginMenu from "../components/LoginMenu"
import VideoPlayer from "../components/VideoPlayer"
import { api, fileFormat, getErrorMessage, getFiles } from "../libs/api";

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
    const [files, setFiles] = useState<fileFormat[]>(null)
    const [video, setVideo]: any = useState(null)
    const [login, setLogin]: any = useState(false)
    const [loginError, setLoginError]: any = useState(null)
    const [text, setText]: any = useState(null)

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
                if (file.type === 'video') {
                    setVideo(file);
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

    const doLogin = event => {
        event.preventDefault();
        let username = event.target.username.value;
        let password = event.target.password.value;
        if (username === '' || password === '') {
            setLoginError('Preencha todos os campos');
            return;
        }
        api.post(`/login`, {
            username: username,
            password: password
        }).then(() => {
            setLogin(false)
            setLoginError(null)
            updateTabFiles()
            updateFiles(location.hash)
        }).catch((error) => {
            let data: { message: string };
            try {
                data = JSON.parse(error.request.response);
            } catch {
                setLoginError('Erro interno ao processar requisição')
                return;
            }
            if (data.message) {
                setLoginError(data.message)
            } else {
                setLoginError('Erro interno ao processar requisição')
            }
        })
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
                <FilesList files={tabFiles} />
            </Main>
            <Aside>
                <FilesBlocks files={files} text={text} />
            </Aside>
            <VideoPlayer src={video == null ? null : video.src} backUrl={video == null ? null : `#${video.parent}`} />
            <LoginMenu do={login} error={loginError} onSubmit={doLogin} />
        </Container>
    )
}
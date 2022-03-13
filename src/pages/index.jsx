import styled from "styled-components"
import FilesBlocks from "../components/FilesBlocks"
import FilesList from "../components/FilesList"
import { useEffect, useState } from "react";
import LoginMenu from "../components/LoginMenu"
import VideoPlayer from "../components/VideoPlayer"
import axios from "axios";

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
    background: rgba(9, 9, 9, 0.3);
`

export default () => {
    const [tabFiles, setTabFiles] = useState(null)
    const [files, setFiles] = useState(null)
    const [video, setVideo] = useState(null)
    const [login, setLogin] = useState(false)
    const [loginError, setLoginError] = useState(null)
    const [text, setText] = useState(null)

    const api_url = process.env.NEXT_PUBLIC_API_URL;

    const api = axios.create({
        baseURL: api_url,
        timeout: 1000
    })

    function updateTabFiles() {
        api.get('files').then((response) => {
            let lfiles = Object.values(response.data.files).filter(file => { return file.is_dir }).map(file => { return { url: `#/${file.name}`, is_dir: file.is_dir } });
            setTabFiles(lfiles)
        }).catch((error) => {
            switch (error.toJSON().status) {
                case 401:
                    setLogin(true);
                    break;
            }
        })
    }

    function updateFiles(hash = null, open = true) {
        if (!hash || hash === '')
            hash = '#'
        setFiles(null);
        setText(null);
        api.get(`files?path=${hash.substring(1)}`).then((response) => {
            let type = response.headers['content-type'];
            if (!type.startsWith('application/json')) {
                if (!open)
                    return
                let src_splited = hash.split('/');
                let parent_src = hash.substring(0, (hash.length - src_splited[src_splited.length - 1].length) - 1);
                if (type.split('/')[0] === 'video') {
                    setVideo({
                        src: `${api_url}/files?path=${hash.substring(1)}`,
                        backUrl: parent_src
                    });
                } else {
                    location.href = `${api_url}/files?path=${hash.substring(1)}`;
                }
                updateFiles(parent_src, false)
                return;
            }
            if (open)
                setVideo(null);

            setFiles(Object.values(response.data.files).map(file => { return { url: (`${hash}/${file.name}`), is_dir: file.is_dir } }))
        }).catch((error) => {
            switch (error.toJSON().status) {
                case 401:
                    setLogin(true)
                    break
                case 404:
                    setText('Arquivo ou diretório não encontrado!')
                    break
                case 403:
                    setText('Você não tem permissão para acessar esse arquivo ou diretório!')
                    break
            }
        })
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
            let data = null;
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
        updateTabFiles()
        window.onhashchange = () => {
            updateFiles(location.hash)
        }
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
            <VideoPlayer src={video == null ? null : video.src} backUrl={video == null ? null : video.backUrl} />
            <LoginMenu do={login} error={loginError} onSubmit={doLogin} />
        </Container>
    )
}
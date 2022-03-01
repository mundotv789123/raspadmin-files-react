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

function AppFunction() {
    const [tabFiles, setTabFiles] = useState(null)
    const [files, setFiles] = useState(null)
    const [login, setLogin] = useState(false)
    const [video, setVideo] = useState(null)

    useEffect(() => {
        updateTabFiles()
        window.onhashchange = () => {
            updateFiles(location.hash)
        }
        updateFiles(location.hash)
    }, [])

    function updateTabFiles() {
        axios.get('https://arquivos.raspadmin.tk/api').then((response) => {
            let lfiles = Object.values(response.data.files).filter(file => {return file.is_dir}).map(file => {return {url: `#/${file.name}`, is_dir: file.is_dir}});
            setTabFiles(lfiles)
        }).catch((error) => {
            console.error(error);
        })
    }

    function updateFiles(hash = null) {
        if (!hash || hash === '') 
            hash = '#'
        setFiles(null);
        axios.get(`https://arquivos.raspadmin.tk/api${hash.substring(1)}`).then((response) => {
            let type = response.headers['content-type'];
            if (type !== 'application/json') {
                if (type.split('/')[0] === 'video') {
                    let src_splited = hash.split('/');
                    setVideo({
                        src: `https://arquivos.raspadmin.tk/api${hash.substring(1)}`,
                        backUrl: hash.substring(0, hash.length - src_splited[src_splited.length - 1].length)
                    });
                }
                return;
            }

            setVideo(null);
            setFiles(Object.values(response.data.files).map(file => {return {url: (`${hash}/${file.name}`), is_dir: file.is_dir}}))
        }).catch((error) => {
            console.error(error);
        })
    }

    return (
        <Container>
            <Header>
                <h2 className={"title"}><a href={"#"}>RaspAdmin</a></h2>
            </Header>
            <Nav/>
            <Main>
                <FilesList files={tabFiles}/>
            </Main>
            <Aside>
                <FilesBlocks files={files}/>
            </Aside>
            <LoginMenu do={login}/>
            <VideoPlayer video={video}/>
        </Container>
    )
}

export default AppFunction;
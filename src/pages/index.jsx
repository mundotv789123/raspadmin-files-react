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
    /* componentes */
    var [tabFiles, setTabFiles] = useState([{url: '#teste123', dir: true}, {url: '#teste123.mp4', dir: false}])
    var [files, setFiles] = useState(null)
    /* páginas */
    var [login, setLogin] = useState(false)
    var [videoUrl, setVideoURL] = useState(null)
    

    function updateTabFiles() {
        axios.get('https://arquivos.raspadmin.tk/api').then((response) => {
            let files = [];
            let rFiles = Object.values(response.data.files);
            rFiles.map((file => {
                if (file.is_dir) {
                    files.push({url: ('#/'+file.name), is_dir: file.is_dir})
                }
            }))
            setTabFiles(files)
        }).catch((error) => {
            console.error(error);
        })
    }

    function updateFiles(hash = null) {
        if (!hash || hash === '') 
            hash = '#'
        setFiles(null);
        axios.get('https://arquivos.raspadmin.tk/api'+hash.substring(1)).then((response) => {
            let type = response.headers['content-type'];
            if (type !== 'application/json') {
                if (type.split('/')[0] === 'video') {
                    setVideoURL('https://arquivos.raspadmin.tk/api'+hash.substring(1));
                }
                return;
            }

            setVideoURL(null);
            let data = response.data;
            let rFiles = Object.values(data.files);
            let files = [];
            rFiles.map((file => {
                files.push({url: (hash+'/'+file.name), is_dir: file.is_dir})
            }))
            setFiles(files)
        }).catch((error) => {
            console.error(error);
        })
    }

    useEffect(() => {
        updateTabFiles()
        window.onhashchange = () => {
            console.log(location.hash)
            updateFiles(location.hash)
        }
        updateFiles(location.hash)
    }, [])

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
            <VideoPlayer src={videoUrl}/>
        </Container>
    )
}

export default AppFunction;
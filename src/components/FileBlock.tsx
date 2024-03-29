import styled, { keyframes } from "styled-components"
import { FileModel } from "../services/models/FilesModel";

const iconsPath = "/img/icons/";

const getFileIcon = (file: FileModel): string => {
    if (file.is_dir)
        return 'folder.svg'
    if (!file.type)
        return 'document.svg';
    let [type, format] = file.type.toString().split('/');
    switch (type) {
        case 'video':
            return 'video.svg';
        case 'audio':
            return 'music.svg';
        case 'image':
            return 'image.svg';
        case "application":
            switch(format) {
                case 'java-archive':
                    return 'java.svg'
                case 'x-msdos-program':
                    return 'exe.svg';
                case 'x-iso9660-image':
                case 'octet-stream':
                    return 'iso.svg';
                case 'x-msdownload':
                case 'x-sh':
                    return 'document.svg';
            }
            return 'compact.svg';
        case 'text':
            switch(format) {
                case 'x-java-source':
                    return 'java.svg'
            }
            return 'document.svg';
    }
    return 'document.svg';
}

const FileCont = styled.a`
    height: 130px;
    margin: 5px;
    text-align: center;
    overflow: hidden;
    font-weight: 600;
    word-wrap: break-word;
    text-shadow: 0 1px 5px black;
    transition: background-color 0.5s;
    border-radius: 5px;
    &:hover {
        background: rgba(255, 255, 255, 0.3);
        overflow: inherit;
        z-index: 1;
        transition: background-color 0.1s;
    }
`

const FileIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    margin: 5px auto;
    border-radius: 5px;
    background-size: cover;
    background-position: center;
`

const Name = styled.p`
    text-align: center;
    font-weight: bold;
`
const Spin = keyframes`
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
`

const Loading = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: solid 5px transparent;
    border-top: solid 5px cyan;
    animation: ${Spin} 500ms linear infinite;
`

export default function FileBlock(props: {file: FileModel, key: number, loading: boolean}) {
    return (
        <FileCont href={props.file.href}>
            <FileIcon style={{ backgroundImage: "url('" + (props.file.icon ? props.file.icon : (iconsPath + getFileIcon(props.file))) + "')" }}>
                {props.loading && <Loading/>}
            </FileIcon>
            <Name>{props.file.name}</Name>
        </FileCont>
    )
}
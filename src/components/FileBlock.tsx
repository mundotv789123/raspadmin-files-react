import styled from "styled-components"
import { lookup } from 'mime-types'

const iconsPath = "/img/icons/";

const getFileIcon = (fileName: string, isDir: boolean = false): string => {
    if (isDir)
        return 'folder.png'
    let [type, format] = lookup(fileName).toString().split('/');
    switch (type) {
        case 'video':
            return 'video.png';
        case 'audio':
            return 'music.png';
        case 'image':
            return 'image.png';
        case "application":
            switch(format) {
                case 'java-archive':
                    return 'java.png'
                case 'x-msdos-program':
                    return 'exe.png';
                case 'x-iso9660-image':
                case 'octet-stream':
                    return 'iso.png';
                case 'x-msdownload':
                case 'x-sh':
                    return 'document.png';
            }
            return 'compact.png';
        case 'text':
            switch(format) {
                case 'x-java-source':
                    return 'java.png'
            }
            return 'document.png';
    }
    return 'document.png';
}

const FileCont = styled.a`
    height: 130px;
    margin: 5px;
    text-align: center;
    overflow: hidden;
    font-weight: 600;
    word-wrap: break-word;
    &:hover {
        background: rgba(255, 255, 255, 0.3);
        overflow: inherit;
        z-index: 1;
    }
`

const FileIcon = styled.div`
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

export default function FileBlock(props) {
    const srcSplited = props.src.split("/");
    const fileName = srcSplited[srcSplited.length - 1];
    return (
        <FileCont href={props.src}>
            <FileIcon style={{ backgroundImage: "url('" + (props.icon ? props.icon : (iconsPath + getFileIcon(fileName, props.dir))) + "')" }} />
            <Name>{fileName}</Name>
        </FileCont>
    )
}
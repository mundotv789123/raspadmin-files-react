import styled from "styled-components"
import { FileModel } from "../services/models/FilesModel";

const iconsPath = "/img/icons/";

const getFileIcon = (file: FileModel): string => {
    if (file.is_dir)
        return 'folder.png'
    if (!file.type)
        return 'document.png';
    let [type, format] = file.type.toString().split('/');
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

export default function FileBlock(props: {file: FileModel, key: number}) {
    return (
        <FileCont href={props.file.href}>
            <FileIcon style={{ backgroundImage: "url('" + (props.file.icon ? props.file.icon : (iconsPath + getFileIcon(props.file))) + "')" }} />
            <Name>{props.file.name}</Name>
        </FileCont>
    )
}
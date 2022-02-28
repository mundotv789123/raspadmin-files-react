import styled from "styled-components"

const iconsPath = "/img/icons/";

const getFileIcon = (fileName, isDir = false) => {
    if (isDir)
        return 'folder.png'
    let fileNameSplited = fileName.split("\.");
    switch (fileNameSplited[fileNameSplited.length - 1]) {
        case 'mp4':
        case 'mkv':
        case 'avi':
        case 'm4v':
            return 'video.png';
        case "exe":
            return 'exe.png';
        case "zip":
        case "rar":
        case "tar":
        case "gz":
            return 'compact.png';
        case "java":
        case "jar":
        case "class":
            return 'java.png';
        case 'iso':
        case 'img':
            return 'iso.png';
        case "mp3":
            return 'music.png';
        case "part":
            return 'part.png';
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
    return(
        <FileCont href={props.src}>
            <FileIcon style={{backgroundImage: 'url(' + (props.icon ? props.icon : (iconsPath+getFileIcon(fileName, props.dir))) + ')'}}/>
            <Name>{fileName}</Name>
        </FileCont>
    )
}
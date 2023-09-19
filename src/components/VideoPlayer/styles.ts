import styled, { keyframes } from "styled-components";

export const VideoCont = styled.div`
    display: flex;
    background-color: black;
    color: white;
    overflow: hidden;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    & .hide {
        transition: 0.5s;
        opacity: 0;
        cursor: none;
    }
`

export const VideoElement = styled.video`
    width: 100%;
    height: 100%;
    margin: auto;
`

export const VideoMain = styled.div`
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    display: flex;
    flex-direction: column;
`

export const VideoTop = styled.div`
    color: white;
    padding: 15px;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
    user-select: none;
`

export const VideoTitle = styled.h2`
    text-align: center;
    margin: 0 60px;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
`

export const VideoCenter = styled.div`
    height: 100%;
    display: flex;
`

export const VideoLoadingSpin = keyframes`
    to {
        transform: rotate(0);
    }
    from {
        transform: rotate(-360deg);
    }
`

export const VideoLoading = styled.div`
    margin: auto;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    border: solid 10px transparent;
    border-left-color: white;
    animation: ${VideoLoadingSpin} 0.7s linear infinite;
`

export const VideoBottom = styled.div`
    padding: 10px;
    display: flex;
    background-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8));
`

export const VideoButton = styled.button`
    background-color: transparent;
    border: none;
    color: white;
    font-size: 13pt;
    margin: 0 5px;
    font-size: 20px;
    text-align: center;
    width: 28px;
    &:hover {
        color: lightgray;
        transform: translateY(-1px);
    }
`

export const CenterButtons= styled.div`
    margin: auto;
    display: flex;
    & button {
        color: white;
        background-color: rgba(0, 0, 0, 0.5);
        border: none;
        border-radius: 50%;
        transition: 0.1s;
        margin: auto 10px;
        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 5px 1px black;
        }
    }
    & .buttonBig {
        font-size: 50px;
        width: 100px;
        height: 100px;
        &:hover {
            font-size: 52px;
        }
    }
    & .buttonSmall {
        width: 50px;
        height: 50px;
        font-size: 25px;
        &:hover {
            font-size: 26px;
        }
    }
    
`

export const VideoCloseButton = styled.a`
    background-color: transparent;
    border: none;
    color: white;
    font-size: 13pt;
    font-size: 20px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    margin: 10px 15px; 
    &:hover {
        color: lightgray;
        transform: translateY(-1px);
    }
`

export const VideoProgress = styled.div`
    width: 100%;
    padding: 2px 0;
    display: flex;
    cursor: pointer;
    & .background {
        width: 100%;
        margin: auto 5px;
        background: rgb(100,100,100);
        height: 7px;
        border-radius: 5px;
        display: flex;
    }
    &:hover .follower {
        opacity: 100;
    }
`

export const VideoProgressBar = styled.div`
    background-color: white;
    height: 100%;
    border-radius: 5px 0 0 5px;
    display: flex;
    z-index: 1;
    &::after {
        content: "";
        display: block;
        border: solid 7px white;
        top: -3px;
        margin-right: -5px;
        margin-left: auto;
        position: relative;
        border-radius: 50%;
    }
`

export const VideoProgressFollower = styled.div`
    border-radius: 5px 0px 0px 5px;
    height: 100%;
    width: 50%;
    background-color: gray;
    display: flex;
    opacity: 0;
`

export const VideoVolume = styled.div`
    border-radius: 10px;
    overflow: show;
    display: flex;
    flex-direction: column;
    transition: 320ms;
    & .volume {
        height: 100%;
        width: 10px;
        background-color: #999;
        margin: 0 auto;
        border-radius: 15px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        cursor: pointer;
    }
    & .volume .volume_percent {
        width: 100%;
        margin-top: auto;
        background-color: white;
        transition: all 0.2s ease 0s;
    }
    &:hover {
        background-color: #444;
        padding: 10px 0 5px 0;
        margin-top: -105px;
    }
    & button {
        margin: 0 !important; 
    }
`

export const Error = styled.h1`
    margin: auto;
    color: #ff5b5b;
`
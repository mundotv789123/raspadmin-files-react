import styled, { keyframes } from "styled-components";

export const ImagemContainer = styled.div`
    position: fixed;
    display: flex;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
    background-color: rgb(0, 0, 0);
`

const ImgLodingAnimation = keyframes`
    0% {
        background-color: rgb(120, 120, 120);
    }
    25% {
        background-color: rgb(80, 80, 80);
    }
    50% {
        background-color: rgb(80, 80, 80);
    }
    75% {
        background-color: rgb(120, 120, 120);
    }
`

export const Img = styled.img`
    max-width: 100%;
    max-height: 100vh;
    background-color: rgb(120, 120, 120);
    animation: ${ImgLodingAnimation} 2s linear infinite;
`

export const Controls = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
`

export const CloseLink = styled.a`
    display: flex;
    z-index: 1;
    position: absolute;
    text-align: right;
    font-size: 18pt;
    right: 5px;
    top: 5px;
    border-radius: 25%;
    width: 32px;
    height: 32px;
    background-color: rgba(0, 0, 0, 0.5);
`

export const ControlLink = styled.a`
    margin-top: auto;
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: auto;
    font-size: 35pt;
    padding: 5px;
    border-radius: 25%;
    background-color: rgba(0, 0, 0, 0.5);
`
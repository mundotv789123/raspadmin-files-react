import styled, { keyframes } from "styled-components";

export const ImagemContainer = styled.div`
    position: fixed;
    display: flex;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5);
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
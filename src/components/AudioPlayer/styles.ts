import styled, { keyframes } from "styled-components";


export const ShowElement = keyframes`
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateY(0);
    }
`

export const AudioContent = styled.div`
    position: fixed;
    bottom: 0;
    right: 0;
    width: 580px;
    transition: 200ms;
    animation: ${ShowElement} 200ms linear normal;
    display: flex;
    @media(max-width: 780px) {
        width: 100vw;
        animation: none;
    }
`

export const AudioElement = styled.div`
    display: flex;
    background: linear-gradient(90deg, #006DAC, #00A2FF);
    box-shadow: 0 4px 4px 0px rgba(0, 0, 0, 0.25);
    height: 90px;
    border-radius: 15px;
    margin: 10px;
    width: 100%;
`
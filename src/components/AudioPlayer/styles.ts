import styled, { keyframes } from "styled-components";


export const AudioContent = styled.div`
    position: fixed;
    bottom: 0;
    right: 0;
    width: 580px;
    transition: 200ms;
    @media(max-width: 780px) {
        width: 100vw;
    }
`

export const AudioElement = styled.audio`
    width: 100%;
`
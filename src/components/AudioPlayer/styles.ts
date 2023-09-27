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
    bottom: 10px;
    right: 10px;
    width: 580px;
    transition: 200ms;
    animation: ${ShowElement} 200ms linear normal;
    display: flex;
    z-index: 1;
    @media(max-width: 780px) {
        width: auto;
        left: 10px;
    }
`

export const AudioElement = styled.div`
    background: linear-gradient(90deg, #006DAC, #00A2FF);
    box-shadow: 0 4px 4px 0px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    height: 90px;
    border-radius: 15px;
    width: 100%;
`

export const ControlContent = styled.div`
    display: flex;
    margin: 15px 0 0 15px;
`

export const ControlButton = styled.button`
    background-color: transparent;
    cursor: pointer;
    border: none;
    color: white;
    margin: auto 6px;
    font-size: 22pt;
    transition: 200ms;
    &:hover {
        color: #d9d9d9;
        transform: translateY(-1px);
    }
`

export const SpinAnimation = keyframes`
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
`

export const LoadingSpin = styled.div`
    display: flex;
    &:before {
        content: "";
        width: 15px;
        height: 15px;
        margin: auto;
        border-radius: 50%;
        border: solid 5px transparent;
        border-top-color: white; 
        animation: ${SpinAnimation} 500ms linear infinite;
    }
`

export const VolumeControl = styled.div`
    display: flex;
`

export const VolumeProgress = styled.div`
    background-color: #D9D9D9;
    cursor: pointer;
    height: 5px;
    width: 75px;
    margin: auto 0;
    border-radius: 5px;
    display: flex;
    &::after {
        content: "";
        display: block;
        margin: -5px -5px 0 -5px;
        width: 5px;
        height: 5px;
        background-color: white;
        border: solid 5px white;
        border-radius: 50%;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
    }
`

export const VolumeProgressBar = styled.div`
    background-color: white;;
    height: 100%;
    display: flex;
    border-radius: 5px;
`

export const AudioTitle = styled.h3`
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
    text-align: center;
    width: 100%;
    margin: auto 15px;
`

export const AudioDurationContent = styled.div`
    display: flex;
    flex-direction: column;
`

export const AudioDurationCount = styled.p`
    color: white;
    font-size: 10pt;
    margin: 0 15px;
    text-align: right; 
`

export const AudioProgress = styled.div`
    background-color: #D9D9D9;
    cursor: pointer;
    display: flex;
    height: 5px;
    margin: auto 15px;
    border-radius: 5px;
    &::after {
        content: "";
        display: block;
        position: relative;
        margin: -5px -5px 0 -5px;
        width: 5px;
        height: 5px;
        background-color: white;
        border: solid 5px white;
        border-radius: 50%;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
    }
`

export const AudioProgressBar = styled.div`
    background-color: white;;
    height: 100%;
    display: flex;
    border-radius: 5px;
`
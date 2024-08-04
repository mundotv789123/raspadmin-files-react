import styled, { keyframes } from "styled-components";

export const ShowElement = keyframes`
  from {
    transform: translateY(100%);
  }
`

export const AudioContent = styled.div`
  position: fixed;
  max-height: 100vh;
  bottom: 1px;
  right: 2px;
  left: 0;
  animation: ${ShowElement} 200ms linear normal;
  display: flex;
  flex-direction: column;
  z-index: 1;
`

export const AudioElement = styled.div`
  backdrop-filter: blur(5px);
  background: linear-gradient(90deg, rgba(49, 49, 49, 0.5), rgba(0, 0, 0, 0.8));
  border: solid 1px gray;
  box-shadow: 0 4px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  height: 110px;
  width: 100%;
`

export const ContentHeader = styled.div`
  display: flex;
  & .playlist-button {
    & .icon {
      transition: transform 500ms;
    }
    & .down {
      transform: rotate(-180deg);
    }
  }
`

export const ControlContent = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0 0 15px;
`

export const Col = styled.div`
  width: 33.33%;
  display: flex;
  justify-content: center;
  overflow: hidden;
`

export const ControlButton = styled.button`
  background-color: transparent;
  cursor: pointer;
  border: none;
  color: white;
  margin: auto 6px;
  font-size: 22pt;
  transition: 200ms;
  width: 25px;
  min-width: 25px;
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
  width: 75px;
  margin: auto 0;
`

export const AudioTitle = styled.h3`
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  width: 100%;
  margin: auto 5px;
`

export const AudioDurationContent = styled.div`
  display: flex;
  flex-direction: column;
`

export const AudioDurationCount = styled.p`
  color: white;
  font-size: 10pt;
  margin: 0 15px;
  margin: 0 20px;
`

export const AudioProgress = styled.div`
  margin: auto 10px;
`

export const ErrorText = styled.h5`
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  text-align: center;
  width: 100%;
  margin: auto 15px;
  color: red;
`
import styled, { keyframes } from "styled-components"

export const Panel = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  padding: 10px;
  text-align: center;
  align-content: start;
  & a {
    width: calc(20% - 10px);
  }
  @media(min-width:1400px) {
    & a {
      width: calc(14.2% - 10px);
    }
  }
  @media(max-width:680px) {
    & a {
      width: calc(50% - 10px);
    }
  }
`

export const Text = styled.h1`
  color: white;
  text-align: center;
  width: 100%;
`

export const LoadingAnimation = keyframes`
  0% {
    margin-left: 0;
    width: 0;
  }
  50% {
    margin-left: 0;
    width: 100%;
  }
  100% {
    margin-left: 100%;
    width: 0;
  }
`

export const LoadingCont = styled.div`
  width: 100%;
  &::before {
    content: "";
    display: block;
    height: 10px;
    background-color: white;
    animation: ${LoadingAnimation} 1s ease infinite;
  }
`

export const FileCont = styled.a`
  height: 130px;
  margin: 5px;
  text-align: center;
  overflow: hidden;
  font-weight: 600;
  word-wrap: break-word;
  text-shadow: 0 1px 5px black;
  transition: background-color 0.5s;
  border-radius: 5px;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    overflow: inherit;
    z-index: 1;
    transition: background-color 0.1s;
  }
`

export const FileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 5px auto;
  border-radius: 5px;
  background-size: cover;
  background-position: center;
`

export const FileName = styled.p`
  text-align: center;
  font-weight: bold;
`
export const Spin = keyframes`
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
`

export const FileLoading = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: solid 5px transparent;
  border-top: solid 5px cyan;
  animation: ${Spin} 500ms linear infinite;
`

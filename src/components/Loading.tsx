import styled from "styled-components"
import { keyframes } from "styled-components"

const LoadingAnimation = keyframes`
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

const LoadingCont = styled.div`
  width: 100%;
`

const LoadingBar = styled.div`
  height: 10px;
  background-color: white;
  animation: ${LoadingAnimation} 1s ease infinite;
`

export default function Loading() {
  return (
    <LoadingCont>
      <LoadingBar />
    </LoadingCont>
  )
}
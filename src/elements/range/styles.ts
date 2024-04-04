import styled from "styled-components"

export const RangeElement = styled.div`
  cursor: pointer;
  user-select: none;
  display: flex;
  flex-direction: column;
`

export const Progress = styled.div`
  background-color: #D9D9D9;
  display: flex;
  height: 5px;
  margin: 5px 6px;
  border-radius: 5px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
`

export const ProgressBar = styled.div`
  background-color: white;
  height: 100%;
  border-radius: 5px;
  z-index: 1;
  &::before {
    content: "";
    display: block;
    position: relative;
    margin: -5px -7px 0 calc(100% - 7.5px);
    width: 5px;
    height: 5px;
    background-color: white;
    border: solid 5px white;
    border-radius: 50%;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  }
`

export const ProgressFollower = styled.div`
  border-radius: 5px 0px 0px 5px;
  height: 100%;
  width: 50%;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
`
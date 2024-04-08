import styled from "styled-components"

export const RangeMain = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 20px;
  &:active .progressbar::before {
    border-width: 7px;
    margin: -7px -7px -7px calc(100% - 7px);
  }
`

export const RangeArea = styled.div`
  height: 100%;
  width: calc(100% - 16px);
  position: absolute;
  display: flex;
  margin: 0 8px;
`;

export const RangeProgress = styled.div`
  background-color: rgb(160, 160, 160);
  display: flex;
  height: 25%;
  margin: auto 0;
  width: 100%;
  border-radius: 15px;
`

export const RangeProgressBar = styled.div`
  height: 100%;
  background-color: white;
  display: flex;
  z-index: 1;
  border-radius: 15px;
  &::before {
    content: "";
    background-color: white;
    height: 100%;
    aspect-ratio: 1/1;
    border: solid 5px white;
    margin: -5px;
    border-radius: 50%;
    margin-left: calc(100% - 5px);
    transform: translateX(-20%);
  }
`

export const RangeProgressFollower = styled.div`
  height: 100%;
  background-color: rgba(0,0,0,0.2);
`

export const RangeInput = styled.input`
  display: block;
  opacity: 0;
  margin: 0;
  top: 0;
  border: none;
  width: 100%;
  z-index: 1;
`;

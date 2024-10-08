import styled, { keyframes } from "styled-components"

export const LoginCont = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background: rgba(9, 9, 9, 1);
`

export const PopUpAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-500px);
  }
  90% {
    opacity: 100;
    transform: translateY(5px);
  }
  100% {
    opacity: 100;
    transform: translateY(0);
  }
`

export const LoginForm = styled.form`
  margin: auto;
  background: rgb(48, 48, 48);
  padding: 15px 25px;
  display: block;
  border-radius: 10px;
  animation: ${PopUpAnimation} 0.8s normal; 
`

export const Title = styled.h2`
  text-align: center;
  margin: 15px 0;
`

export const Input = styled.input`
  display: block;
  background: rgb(50, 50, 50);
  border: solid 1px gray;
  margin: 10px auto;
  padding: 5px;
  color: white;
  text-align: center;
  border-radius: 5px;
  &:focus {
    border: solid 1px white;
    outline: none;
  }
`

export const ErrorArea = styled.div`
  background-color: red;
  text-align: center;
  width: 220px;
  border-radius: 5px;
  padding: 3px;
  & p {
    font-size: 10pt;
  }
`

export const Button = styled.button`
  display: block;
  background: rgb(50, 50, 50);
  border: solid 1px gray;
  margin: 5px auto;
  padding: 7px;
  color: white;
  &:focus {
    outline: none;
  }
  &:hover:not(:disabled) {
    background: rgb(80, 80, 80);
  }
  &:active:not(:disabled) {
    border: solid 1px white;
  }
  &:disabled {
    color: gray;
    cursor: not-allowed;
  }
`

export const LoadingAnimation = keyframes`
  0% {
    margin-left: 0;
    width: 0%;
  }
  50% {
    margin-left: 0;
    width: 100%;
  }
  51% {
    margin-left: auto;
  }
  100% {
    margin-left: auto;
    width: 0;
  }
`

export const Loading = styled.div`
  height: 2px;
  display: flex;
  &::before {
    content: "";
    display: block;
    background-color: white;
    width: 0%;
    height: 100%;
    animation: ${LoadingAnimation} 1s infinite;
  }
`
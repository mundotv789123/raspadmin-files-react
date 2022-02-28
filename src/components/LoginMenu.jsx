import styled from "styled-components";
import { keyframes } from "styled-components";

const LoginCont = styled.div`
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(9, 9, 9, 1);
`

const PopUpAnimation = keyframes`
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

const LoginForm = styled.form`
    margin: auto;
    background: rgb(48, 48, 48);
    padding: 15px 25px;
    display: block;
    border: solid 1px white;
    border-radius: 15px;
    animation: ${PopUpAnimation} 0.8s normal; 
`

const Title = styled.h1`
    text-align: center;
    margin: 15px 0;
`

const Input = styled.input`
    display: block;
    background: rgb(50, 50, 50);
    border: solid 1px gray;
    margin: 10px;
    padding: 5px;
    color: white;
    text-align: center;
    border-radius: 5px;
    &:focus {
        border: solid 1px white;
        outline: none;
    }
`

const Button = styled.button`
    display: block;
    background: rgb(50, 50, 50);
    border: solid 1px gray;
    margin: 15px auto;
    padding: 7px;
    color: white;
    &:focus {
        outline: none;
    }
    &:hover {
        background: rgb(80, 80, 80);
    }
    &:active {
        border: solid 1px white;
    }
`

export default function LoginMenu(props) {
    if (!props.do) {
        return <></>
    }
    return(
        <LoginCont>
            <LoginForm>
                <Title>Login</Title>
                <Input placeholder={"Username"}/>
                <Input placeholder={"Password"}/>
                <Button type={"button"}>Login</Button>
            </LoginForm>
        </LoginCont>
    )
}
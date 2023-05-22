import { useState } from "react";
import styled from "styled-components";
import { keyframes } from "styled-components";
import { api } from "../libs/api";

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
    border-radius: 10px;
    animation: ${PopUpAnimation} 0.8s normal; 
`

const Title = styled.h2`
    text-align: center;
    margin: 15px 0;
`

const Input = styled.input`
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

const ErrorArea = styled.div`
    background-color: red;
    text-align: center;
    width: 220px;
    border-radius: 5px;
    padding: 3px;
    transition: 0.5s;
    & p {
        font-size: 10pt;
    }
`

const Button = styled.button`
    display: block;
    background: rgb(50, 50, 50);
    border: solid 1px gray;
    margin: 5px auto;
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

export default function LoginMenu(props: any) {
    const [errorText, setErroText] = useState<string>();

    function submit(event: any) {
        event.preventDefault();
        let username = event.target.username.value;
        let password = event.target.password.value;
        if (username === '' || password === '') {
            setErroText('Preencha todos os campos');
            return;
        }
        api.post(`/auth/login`, {username,password}).then(props.onSuccess).catch((error) => {
            let data: { message: string };
            try {
                data = JSON.parse(error.request.response);
            } catch {
                setErroText('Erro interno ao processar requisição')
                return;
            }
            if (data.message) {
                setErroText(data.message)
            } else {
                setErroText('Erro interno ao processar requisição')
            }
        })
    }

    return (
        <LoginCont>
            <LoginForm onSubmit={submit}>
                <Title>Login</Title>
                <Input placeholder={"Username"} id={'username'} required />
                <Input placeholder={"Password"} id={'password'} type={'password'} required />
                {errorText && <ErrorArea><p>{errorText}</p></ErrorArea>}
                <Button>Login</Button>
            </LoginForm>
        </LoginCont>
    )
}
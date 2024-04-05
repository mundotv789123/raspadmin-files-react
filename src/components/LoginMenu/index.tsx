import { useState } from "react";
import { LoginService } from "../../services/LoginService";
import { Button, ErrorArea, Input, Loading, LoginCont, LoginForm, Title } from "./styles";

interface PropsInterface {
  onSuccess: (() => void) | null 
}

export default function LoginMenu(props: PropsInterface) {
  const service = new LoginService();

  const [errorText, setErroText] = useState<string>();
  const [loading, setLoding] = useState(false);

  function submit(event: any) {
    event.preventDefault();
    let username = event.target.username.value;
    let password = event.target.password.value;
    if (username === '' || password === '') {
      setErroText('Preencha todos os campos');
      return;
    }

    setLoding(true);
    service.login(username, password, props.onSuccess, (message) => {
      setLoding(false);
      setErroText(message);
    })
  }

  return (
    <LoginCont>
      <LoginForm onSubmit={submit}>
        <Title>Login</Title>
        <Input placeholder={"Username"} id={'username'} required />
        <Input placeholder={"Password"} id={'password'} type={'password'} required />
        {errorText && !loading && <ErrorArea><p>{errorText}</p></ErrorArea>}
        {loading && <Loading />}
        <Button disabled={loading}>Login</Button>
      </LoginForm>
    </LoginCont>
  )
}
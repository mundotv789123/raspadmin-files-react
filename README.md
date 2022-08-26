## Raspadmin Files
Um sistema para listagem de arquivos e reprodução de mídia.

Site demo para desmonstração: [raspadmin-files-react.vercel.app](https://arquivos.raspadmin.tk/)

## Tutorial de instalação

- Primeiro vamos clonar o repositório `raspadmin-files-react`.
- Para isso vamos executar os seguintes comandos.

```bash
sudo apt install git
cd /srv
git clone https://github.com/mundotv789123/raspadmin-files-react.git
```

- Após isso basta entrar na pasta e executar o script de instalação

```bash
cd raspadmin-files-react/
bash ./install.sh
```

- Vamos configurar, para isso basta acessar o arquivo `docker-compose.yml`.

- Aqui você irá definir a pasta onde os arquivos serão armazenados
```yml
volumes:
- './:/app'
- '/mnt/files:/mnt/files'
```

- Exemplo caso você queira armazenar na pasta /root/arquivos
```yml
volumes:
- './:/app'
- '/root/arquivos:/mnt/files'
```
> Você só irá editar o caminho da primeira pasta.

- Você também pode definir uma senha de usuário, caso queira restringir o acesso

```yml
environment:
  NEXT_PUBLIC_API_URL: '/api'
  API_AUTH: 'false'
  API_USERNAME: 'admin'
  API_PASSWORD: 'admin'
  API_DIR: '/mnt/files'
```

- Basta mudar as seguintes linhas
```yml
API_AUTH: 'true'
API_USERNAME: 'seu usuário'
API_PASSWORD: 'sua senha aqui'
```

- Após configurar basta reiniciar o projeto.

```bash
service raspadmin restart
```

- Para acessar basta informar a seguinte url.
- `http://127.0.0.1/8080` ou `http://(endereço ip do servidor)/8080`.

> Lembrando que a primeira inicialização pode demorar um pouco, caso queira ver os logs de inicialização basta executar `docker-compose logs` ou `docker-compose logs -f` para visualizar em tempo real.

# Usando ssl com nginx (opicional)

- Aqui vamos configurar um proxy com nginx para ativar o ssl.
- Primeiro vamos instalar o nginx.

```bash
apt install nginx
```

- Após instalamos vamos criar um arquivo chamado `raspadmin.conf` na pasta `/etc/nginx/sites-available/`.
- Nesse arquivo vamos informar copiar os seguintes textos, lembrando de mudar o `<dominio>` para o domínio que você deseja usar.

```conf
server {
        listen 443 ssl;
        listen [::]:443 ssl;
        server_name <dominio>;

        location / {
                proxy_pass http://127.0.0.1:8080;
        }
        
        # informe aqui seus arquivos ssl
        ssl_certificate /etc/nginx/certificates/certificate.cert;
        ssl_certificate_key /etc/nginx/certificates/certificate.key;
}
```

- Caso não queira usar certificado ssl mas deseja usar a porta padrão 80 basta copiar esse texto no lugar do texto a cima.

```conf
server {
        listen 80;
        listen [::]:80;
        server_name <dominio>;

        location / {
                proxy_pass http://127.0.0.1:8080;
        }
}
```

- Agora vamos habilitar o site e reiniciar o nginx

```bash
ln -s /etc/nginx/sites-available/raspadmin.conf /etc/nginx/sites-enabled/raspadmin.conf
systemctl restart nginx
```

## Pronto! seu site foi configurado e está pronto para funcionar!

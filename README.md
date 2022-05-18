## Tutorial de instalação

- Primeiro temos que instalar o nodejs 17.
- Para isso basta executar os seguintes comandos.


```bash
curl -sL https://deb.nodesource.com/setup_17.x | sudo -E bash -
sudo apt install nodejs
```

- Agora vamos clonar o repositório `raspadmin-files-react`.
- Para isso vamos executar os seguintes comandos.


```bash
sudo apt install git
cd /srv
git clone https://github.com/mundotv789123/raspadmin-files-react.git
```

- Após isso basta instalar os módulos do nodejs.

```bash
cd raspadmin-files-react/
npm install
```

- Vamos configurar, para isso basta renomear o arquivo `.env.example` para `.env`.
- Após isso basta abrir o arquivo com um editor de texto configura-lo.

```
#aqui não vamos editar
NEXT_PUBLIC_API_URL='/api' 

#configuração de autenticação, caso queira usar uma senha basta mudar o API_AUTH para true e definir um usuário/senha
API_AUTH=false
API_USERNAME='admin'
API_PASSWORD='admin'

#aqui vc irá definir a pasta que a aplicação irá listar os arquivos
API_DIR='./files'
```

- Depois de tudo configurado vamos compilar nossa aplicação.

```bash
npm run build
```

- Agora vamos iniciar nosso servidor.

```bash
npm run start
```

- Para acessar basta informar a seguinte url.
- `http://127.0.0.1/3000` ou `http://(endereço ip do servidor)/3000`.

# Vamos configurar um serviço para nossa aplicação

Isso ira manter a aplicação rodando em segundo plano e fará ela iniciar autom

- Para isso basta criar um arquivo chamado `raspadmin.service` na pasta `/etc/systemd/system`.
- Nesse arquivo você ira copiar o seguinte texto.

```service
[Unit]
Description=raspadmin files
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/srv/raspadmin-files-react
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

- Após isso basta executar o seguinte comando

```bash
systemctl enable --now raspadmin.service
```

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
                proxy_pass http://127.0.0.1:3000;
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
                proxy_pass http://127.0.0.1:3000;
        }
}
```

- Agora vamos habilitar o site e reiniciar o nginx

```bash
ln -s /etc/nginx/sites-available/raspadmin.conf /etc/nginx/sites-enabled/raspadmin.conf
systemctl restart nginx
```

## Pronto! seu site foi configurado e está pronto para funcionar!

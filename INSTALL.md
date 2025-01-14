## Raspadmin Files
Um sistema para listagem de arquivos e reprodução de mídia.

## Tutorial de instalação Docker

Instale o docker

```sh
apt install curl
curl -sSL https://get.docker.com/ | CHANNEL=stable bash
```

Execute o container

```sh
# Rodando container mínimo
docker run -d -p 8080:8080 -v ./files:/home/app/data/files --name raspadmin mundotv789123/raspadmin

# Rodando com usuário e senha
docker run -d -p 8080:8080 -v ./files:/home/app/data/files -e AUTH_ENABLED=true -e USERNAME=admin -e PASSWORD=admin --name raspadmin mundotv789123/raspadmin

# Ativar geração de thumbnail em vídeos e músicas
docker run -d -p 8080:8080 -v ./files:/home/app/data/files -e MEDIA_THUMB=true --name raspadmin mundotv789123/raspadmin
```

## Docker compose


Crie uma pasta e baixe o arquivo docker-compose.yml

```sh
mkdir /srv/raspadmin
cd /srv/raspadmin

curl -o docker-compose.yml https://raw.githubusercontent.com/mundotv789123/raspadmin-files-react/refs/heads/main/docker-compose.yml
```

Em seguida basta executar o container

```sh
docker compose up -d
```

### Para acessar o site basta entrar no link http://localhost:8080

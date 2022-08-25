#!/bin/bash
if [[ $1 == 'start' ]]; then
    if [ ! -d node_modules ]; then 
        npm install;
    fi

    if [ ! -d .next ]; then
        npm run build;
    fi

    npm run start
    exit 0
fi

if [[ "$(whoami)" != "root" ]]; then
    echo "Você precisa executar esse comando como root"
    exit 2
fi

# instalando dependencias
apt -y install software-properties-common curl apt-transport-https ca-certificates gnupg
curl -sSL https://get.docker.com/ | CHANNEL=stable bash
apt install -y docker-compose pwgen

# criando serviço
echo "[Unit]
Description=RaspAdmin File Manager
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
" > /etc/systemd/system/raspadmin.service

systemctl enable --now raspadmin
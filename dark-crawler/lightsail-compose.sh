#!/bin/bash

sudo apt-get install git -y

# install latest version of docker the lazy way
curl -sSL https://get.docker.com | sh

# make it so you don't need to sudo to run docker commands
usermod -aG docker ubuntu

# install docker-compose
curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# copy the dockerfile into /srv/docker 
# if you change this, change the systemd service file to match
# WorkingDirectory=[whatever you have below]
mkdir /srv/docker

git clone https://github.com/nestarz/infrastructure /srv/docker

cd /srv/docker/dark-crawler

cp ./docker-compose-app.service /etc/systemd/system/docker-compose-app.service
systemctl enable docker-compose-app

# start up the application via docker-compose
docker-compose -f docker-compose.yml up -d
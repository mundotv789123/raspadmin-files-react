FROM node:18

WORKDIR /app
RUN apt install -y git
RUN git clone https://github.com/mundotv789123/raspadmin-files-react.git .
RUN cp .env.example .env
RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]
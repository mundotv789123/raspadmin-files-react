FROM node:18 AS build

WORKDIR /app
COPY . .
RUN cp .env.example .env
RUN npm install
RUN npm run build

FROM nginx
RUN mkdir -p /var/www
COPY --from=build /app/out /var/www/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

FROM nginx
RUN mkdir -p /var/www
COPY ./out /var/www/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

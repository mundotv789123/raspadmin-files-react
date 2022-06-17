FROM node:16.15.0
WORKDIR /app
COPY . .
RUN sh build.sh
CMD ["sh", "start.sh"]
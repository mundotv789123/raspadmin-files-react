FROM node:16.15.0
WORKDIR /app
COPY . .
RUN npm install --production
RUN npm run build
CMD ["npm", "run", "start"]
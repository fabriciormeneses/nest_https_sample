FROM node:latest
ENV NODE_ENV=development
COPY ./api-poc /var/www
WORKDIR /var/www
RUN npm install yarn --legacy-peer-deps
RUN yarn install
ENTRYPOINT yarn run start
EXPOSE 3000
FROM node:20

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install
COPY . .

EXPOSE 9900

ENTRYPOINT yarn run vite --host 0.0.0.0 --port 9900



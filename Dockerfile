FROM node:18 as builder

ARG VOCDONI_ENVIRONMENT=prod
ENV VOCDONI_ENVIRONMENT=$VOCDONI_ENVIRONMENT

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

VOLUME [ "/app/dist" ]

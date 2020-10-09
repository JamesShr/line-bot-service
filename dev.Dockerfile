FROM node:12-alpine

RUN mkdir -p /app
WORKDIR /app

ADD package.json /app
RUN npm install

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

ADD . /app

ENTRYPOINT ["sh", "./scripts/entry.sh" ]

EXPOSE 8108
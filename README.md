## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# development watch mode with docker
$ npm run start:dev:docker
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Utils
- json of postman
- simple broker by mosca
```javascript
//create a local config in config folder to change mqtt env
module.exports = {
  mqtt: {
    host: '192.168.3.135',//use by lan ip
    port: 1883,
  },
};
```
- chat client

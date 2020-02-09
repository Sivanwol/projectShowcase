
# Beckend Run by

<p  align="center">

<a  href="http://nestjs.com/"  target="blank"><img  src="https://nestjs.com/img/logo_text.svg"  width="320"  alt="Nest Logo"  /></a>

</p>

  

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master

[travis-url]: https://travis-ci.org/nestjs/nest

[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux

[linux-url]: https://travis-ci.org/nestjs/nest

  

## Work Flow

this system if multi layer mrico service that start from front-api.
the follow micro services and thire role play
| Service Name | Goal  |
|--|--|
| front-api | this the main entry point where all api calls from this point will have basic filters and it will use logic bus what ever he need get data no call will flow from here to entities service as well will not handle any type of big handle of logic  |
| entities | this will only entry to query to the db and/or update/insert/delete the data flow this will not hold api entry but will use protocol of GRPC internally within the services |
| config | this main entry will user and hold all relevant config as cache based and well well serv any within the request from the the services will user rebbit mq for data verification and will not hold any api protocol  |
| logic-bus | logic bus service have 3 aspect that he handle a. work event bus system so he can handle complex logic. b. only from here it will dispatch a task if too big or too complex handle from here. c. it use monitor the tasks and notify from streams service what ever the data received |
| task-que | this is QUE WORK system (task system) that will handle many tasks that not possible do that within range of the request such stats , notifiy and more|
| streams | stearms means working with websockets and / or GraphQL mainly dont have active api in term of routes|
| devops-mcu | this where admin system will be as well any devops operation will be in it has support for console that the framework access if needed as well the admin api have routes here |
  

  

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


## License

  

Nest is [MIT licensed](LICENSE).
# opentrials

[![Gitter](https://img.shields.io/gitter/room/opentrials/chat.svg)](https://gitter.im/opentrials/chat)
[![Travis Build Status](https://travis-ci.org/opentrials/opentrials.svg?branch=master)](https://travis-ci.org/opentrials/opentrials)
[![Coveralls](http://img.shields.io/coveralls/opentrials/opentrials.svg?branch=master)](https://coveralls.io/r/opentrials/opentrials?branch=master)
[![Dependency Status](https://david-dm.org/opentrials/opentrials.svg)](https://david-dm.org/opentrials/opentrials)
[![Issues](https://img.shields.io/badge/issue-tracker-orange.svg)](https://github.com/opentrials/opentrials/issues)
[![Docs](https://img.shields.io/badge/docs-latest-blue.svg)](http://docs.opentrials.net/en/latest/developers/)

OpenTrials is an app to explore, discover, and submit information on clinical trials.

## Developer notes

### Requirements

* Node 5.8
* PostgreSQL 9.5
* OpenTrials API (see [install notes](https://github.com/opentrials/api))

### Installing

1. Copy the `.env.example` file to `.env` and alter its contents as needed.
   At minimum, you should set the `OPENTRIALS_API_URL` and `DATABASE_URL`. The
   `TEST_DATABASE_URL` is needed to run the tests. You could leave the
   `GOOGLE_*` and `FACEBOOK_*` variables as is, although you won't be able to log
   in. If you leave `AWS_*` and `S3_*`, you won't be able to upload data;
2. Run `npm install`;
3. Run `npm run migrate`;

After the install and migrations ran successfully, you can run `npm run dev` to
run the project. If you haven't changed the default `PORT`, it should be
available at `http://localhost:5000`

### Testing

You can run the test suite and linting with `npm test`.

We also have an end to end smoke test suite. To run it, make sure the
OpenTrials server is running and do:

```
OPENTRIALS_URL=http://localhost:5000 npm run e2e
```

Remember to change the `OPENTRIALS_URL` to where is the OpenTrials URL.

# opentrials

[![Gitter](https://img.shields.io/gitter/room/opentrials/chat.svg)](https://gitter.im/opentrials/chat)
[![Travis Build Status](https://travis-ci.org/opentrials/opentrials.svg?branch=master)](https://travis-ci.org/opentrials/opentrials)
[![Coveralls](http://img.shields.io/coveralls/opentrials/opentrials.svg?branch=master)](https://coveralls.io/r/opentrials/opentrials?branch=master)
[![Dependency Status](https://david-dm.org/opentrials/opentrials.svg)](https://david-dm.org/opentrials/opentrials)
[![Issues](https://img.shields.io/badge/issue-tracker-orange.svg)](https://github.com/opentrials/opentrials/issues)
[![Docs](https://img.shields.io/badge/docs-latest-blue.svg)](http://docs.opentrials.net/en/latest/developers/)

OpenTrials is an app to explore, discover, and submit information on clinical trials.

## Developer notes

These notes are intended to help people that want to contribute to this package
itself. If you just want to use it, you can safely ignore them.

node.js 5.xx version is required

### Running smoke test suite

You can run our end to end smoke test suite using `npm run e2e`. You must to
define the server's URL through the `OPENTRIAL_URL` environment variable. If,
for example, the server is running in `http://localhost:5000`, you could run
the end to end tests as:

```
OPENTRIALS_URL=http://localhost:5000 npm run e2e
```

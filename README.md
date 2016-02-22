# hexi-auth

An auth extension for hexi

[![Dependency Status](https://david-dm.org/hexijs/hexi-auth/status.svg?style=flat)](https://david-dm.org/hexijs/hexi-auth)
[![Build Status](https://travis-ci.org/hexijs/hexi-auth.svg?branch=master)](https://travis-ci.org/hexijs/hexi-auth)
[![npm version](https://badge.fury.io/js/hexi-auth.svg)](http://badge.fury.io/js/hexi-auth)
[![Coverage Status](https://coveralls.io/repos/hexijs/hexi-auth/badge.svg?branch=master&service=github)](https://coveralls.io/github/hexijs/hexi-auth?branch=master)


## Installation

```
npm install --save hexi-auth
```


## Usage

```js
const server = hexi()

server.register([
  {
    register: require('hexi-auth'),
  },
])
.then(() => {
  server.auth((req, res, next) => {
    
  })
})
```


## License

MIT © [Zoltan Kochan](https://www.kochan.io)

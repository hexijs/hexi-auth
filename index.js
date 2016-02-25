'use strict'
const strictOnce = require('strict-once')

module.exports = (server, opts) => {
  const setAuth = authMiddleware => {
    if (typeof authMiddleware !== 'function') {
      throw new Error('auth middleware should be a function')
    }

    server.route.pre((next, opts) => {
      const authOpts = opts && opts.config && opts.config.auth

      if (authOpts === false) return next.applySame()

      next(Object.assign(opts, {
        pre: opts.pre.concat(authMiddleware),
      }))
    })
  }

  setAuth.onceError = 'auth middleware cannot be specified more than once'

  server.decorate('auth', strictOnce(setAuth))
}

module.exports.attributes = {
  pkg: require('./package.json'),
}

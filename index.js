'use strict'
module.exports = function(server, opts) {
  let initialized = false

  server.decorate('auth', function(authMiddleware) {
    if (initialized) {
      throw new Error('auth middleware cannot be specified more than once')
    }

    initialized = true

    if (typeof authMiddleware !== 'function') {
      throw new Error('auth middleware should be a function')
    }

    server.route.pre((next, opts) => {
      const authOpts = opts && opts.config && opts.config.auth

      if (authOpts === false) return next(opts)

      next(Object.assign(opts, {
        pre: opts.pre.concat(authMiddleware),
      }))
    })
  })
}

module.exports.attributes = {
  pkg: require('./package.json'),
}

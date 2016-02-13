'use strict'
module.exports = function(server, opts) {
  let authMiddleware

  server.route.pre((next, opts) => {
    let authOpts = opts && opts.config && opts.config.auth
    if (authOpts === false || !authMiddleware) return next(opts)

    opts.handler.splice(-1, 0, authMiddleware)
    next(opts)
  })

  server.decorate('server', 'auth', function(middleware) {
    authMiddleware = middleware
  })
}

module.exports.attributes = {
  pkg: require('./package.json'),
}

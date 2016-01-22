'use strict'
module.exports = function(server, opts) {
  let strategies = {}

  function getStrategy(auth) {
    if (['boolean', 'undefined'].indexOf(typeof auth) !== -1) {
      return strategies['default']
    }

    return strategies[auth]
  }

  server.pre('route', (next, opts) => {
    let authOpts = opts && opts.config && opts.auth
    if (typeof authOpts !== 'undefined' && !authOpts) return next(opts)

    let strategy = getStrategy(authOpts)

    if (!strategy) {
      throw new Error('Auth strategy ' + authOpts + ' does not exists')
    }

    opts.task =  opts.task || []
    opts.task = [strategy].concat(opts.task)
    next(opts)
  })

  server.decorate('server', 'auth', {
    strategy(name, middleware) {
      if (strategies[name]) {
        throw new Error('A strategy called ' + name + 'is already registered')
      }
      if (typeof middleware !== 'function') {
        throw new Error('Strategy middleware should be a function')
      }

      strategies[name] = middleware
    },
  })
}

module.exports.attributes = {
  pkg: require('./package.json'),
}

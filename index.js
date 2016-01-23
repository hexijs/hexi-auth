'use strict'
module.exports = function(server, opts) {
  server.pre('route', (next, opts) => {
    let authOpts = opts && opts.config && opts.config.auth
    if (authOpts === false) return next(opts)

    opts.task =  opts.task || []
    opts.task = ['auth'].concat(opts.task)
    next(opts)
  })
}

module.exports.attributes = {
  pkg: require('./package.json'),
}

'use strict'
const describe = require('mocha').describe
const it = require('mocha').it
const beforeEach = require('mocha').beforeEach
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const hexi = require('hexi')
const hexiAuth = require('..')
const request = require('supertest')

chai.use(require('sinon-chai'))

describe('auth', function () {
  let server

  beforeEach(function () {
    server = hexi()
    return server.register(hexiAuth)
  })

  it('should throw exception if no auth middleware passed', function () {
    expect(() => server.auth())
      .to.throw(Error, 'auth middleware should be a function')
  })

  it('should throw exception if passed auth middleware is not function',
    function () {
      expect(() => server.auth('not a function'))
        .to.throw(Error, 'auth middleware should be a function')
    }
  )

  it('should throw exception if auth middleware specified more than once',
    function () {
      server.auth(function () {})

      expect(() => server.auth(function () {}))
        .to.throw(Error, 'auth middleware cannot be specified more than once')
    }
  )

  it('should disable authentication on a route', function (done) {
    server.auth((req, res, next) => res.status(401).end())

    server.route({
      path: '/',
      method: 'GET',
      config: {
        auth: false,
      },
      handler (req, res) {
        res.status(200).end()
      },
    })

    request(server.express)
      .get('/')
      .expect(200, done)
  })

  it('should forbid unauthenticated request', function (done) {
    server.auth((req, res, next) => {
      if (req.headers.foo === 'bar') next()
      res.status(401).end()
    })

    server.route({
      path: '/',
      method: 'GET',
      handler (req, res) {
        res.status(200).end()
      },
    })

    request(server.express)
      .get('/')
      .expect(401, done)
  })

  it('should run the authentication middleware before the last middleware',
    function (done) {
      const sessionMiddleware = sinon.spy((req, res, next) => next())
      server.route.pre((next, opts) => {
        next(Object.assign(opts, {
          pre: opts.pre.concat(sessionMiddleware),
        }))
      })

      const authMiddleware = sinon.spy((req, res, next) => next())
      server.auth(authMiddleware)

      server.route({
        path: '/',
        method: 'GET',
        handler (req, res) {
          res.status(200).end()
        },
      })

      request(server.express)
        .get('/')
        .expect(401, () => {
          expect(sessionMiddleware).to.have.been.calledBefore(authMiddleware)
          done()
        })
    }
  )

  it('should allow authenticated request', function (done) {
    server.auth((req, res, next) => {
      if (req.headers.foo === 'bar') next()
      res.status(401).end()
    })

    server.route({
      path: '/',
      method: 'GET',
      handler (req, res) {
        res.status(200).end()
      },
    })

    request(server.express)
      .get('/')
      .set('foo', 'bar')
      .expect(200, done)
  })
})

'use strict'
const expect = require('chai').expect
const hexi = require('hexi')
const hexiAuth = require('..')
const request = require('supertest')

describe('auth', function() {
  let server

  beforeEach(function(next) {
    server = new hexi.Server()
    server.register([hexiAuth], next)
  })

  it('should disable authentication on a route', function(done) {
    server.task('auth', (req, res, next) => res.status(401).end())

    server.route({
      path: '/',
      method: 'GET',
      config: {
        auth: false,
      },
      handler(req, res) {
        res.status(200).end()
      },
    })

    request(server.express)
      .get('/')
      .expect(200, done)
  })

  it('should forbid unauthenticated request', function(done) {
    server.task('auth', (req, res, next) => {
      if (req.headers.foo === 'bar') next()
      res.status(401).end()
    })

    server.route({
      path: '/',
      method: 'GET',
      handler(req, res) {
        res.status(200).end()
      },
    })

    request(server.express)
      .get('/')
      .expect(401, done)
  })

  it('should allow authenticated request', function(done) {
    server.task('auth', (req, res, next) => {
      if (req.headers.foo === 'bar') next()
      res.status(401).end()
    })

    server.route({
      path: '/',
      method: 'GET',
      handler(req, res) {
        res.status(200).end()
      },
    })

    request(server.express)
      .get('/')
      .set('foo', 'bar')
      .expect(200, done)
  })
})

module.exports = {
  env: 'local',

  server: {
    protocol: 'http',
    domain:   'test-jeragroup.ca',
    port:     8001
  },

  redis: {
    domain: 'localhost',
    port:   6379
  },

  socket: {
    url: 'http://test-jeragroup.ca'
  },

  mongo: {
    username: '',
    password: '',
    host:     'localhost',
    port:     27017,
    database: 'service-messages',
    path:     '/server/data',
    options:  {
      server: {
        ssl:           false,
        sslValidate:   false,
        socketOptions: {
          auto_reconnect:   true,
          connectTimeoutMS: 30000
        }
      }
    }
  },

  security: {
    ssl_certs: {
      rKey:       '/server/certs/localhost-srv.key',
      rCert:      '/server/certs/localhost-srv.crt',
      rCA:        '/server/certs/localhost-ca.crt',
      passphrase: ''
    }
  },

  application: {
    name: 'messaging',
    type: 'service'
  },

  authentication: {
    session: {
      life:   null,
      secret: 't3sts3cr3t'
    }
  }
};

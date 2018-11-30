module.exports = {
  env: 'local',

  server: {
    protocol: 'http',
    domain:   'localhost',
    port:     8001
  },

  redis: {
    domain: 'localhost',
    port:   6379
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

  application: {
    name: 'messaging',
    type: 'service'
  },

  authentication: {
    session: {
      life:   null,
      secret: { default: '', format: String }
    }
  }
};

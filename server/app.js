process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // required to get around request module using HTTPS

// Handler for thrown uncaught exceptions.
// This allows us to gracefully handle the error without terminating the service.
// TODO Notification can be sent, logged etc.
process.on('uncaughtException', (err) => {
  console.error(err);
});

// External dependencies.
const async          = require('async');
const bodyParser     = require('body-parser');
const cookieParser   = require('cookie-parser');
const express        = require('express');
const expressSession = require('express-session');
const fs             = require('fs');
const helmet         = require('helmet');
const http           = require('http');
const mongoose       = require('mongoose');
mongoose.Promise = global.Promise;
const morgan         = require('morgan');
const os             = require('os');
const path           = require('path');
const RedisStore     = require('connect-redis')(expressSession);
const request        = require('request');
const uuid           = require('uuid/v4');

// Internal dependencies.
const APP_CONFIG     = require('../config');
const ON_EXIT        = require('./functions/onexit');
const ON_STARTUP     = require('./functions/onstartup');
const SESSION        = require('./plugins/session');
// const SETUP_MONGO    = require('./db/mongo').setup;
// const SETUP_REDIS    = require('./db/redis').setup;
const VERSION        = require('../package.json').version;

var DB = require('./db/mongo/connection-manager');
DB.on('connected', (uri) => {
  console.log(`Connected to database ${uri}`);
});
DB.on('error', (err) => {
  console.error(err);
});

console.log('\x1b[34m\x1b[1m************************************************************\x1b[0m'); // \x1b[0m, \x1b[36m\x1b[2m
console.log('\x1b[34m\x1b[1m**                                                        **\x1b[0m');
console.log('\x1b[34m\x1b[1m**                   Service Messaging                    **\x1b[0m');
console.log('\x1b[34m\x1b[1m**                                                        **\x1b[0m');
console.log('\x1b[34m\x1b[1m**                Developed by Matt Felske                **\x1b[0m');
console.log('\x1b[34m\x1b[1m**                                                        **\x1b[0m');
console.log('\x1b[34m\x1b[1m************************************************************\x1b[0m');
console.log('');

console.log(`Starting up the message management service version ${VERSION} ...`);

global.online = false;
async.waterfall([

  // Setup closing functionality.
  (callback) => {
    ON_EXIT();
    callback(null);
  },

  // Mongo database setup.
  (callback) => {
    // setupMongo((err, mongoCM) => {
      // Initialize Mongo Database
      // DB.on('connected', (uri) => {
      //   info(`Connected to database ${uri}`);
      // });
      // DB.on('error', (err) => {
      //   error(err);
      // });

    // });
    callback()
  },

  // Redis database setup.
  // (mongoCM, callback) => {
  (callback) => {
    callback(null);
    // setupRedis(APP_CONFIG.redis, (err, redisCM) => {
    //   callback(err, mongoCM, redisCM);
    // });
  },

  // Setup the server
  // (mongoCM, redisCM, callback) => {
  (callback) => {
    setupServer((err, app, server) => {
      callback(err, app, server);
    });
    // setupServer(mongoCM, redisCM, (err, app, server) => {
    //   callback(err, app, server);
    // });
  },

  // Perform any rerquired application startup.
  (app, server, callback) => {
    ON_STARTUP(app.locals, (err) => {
      callback(err, app, server);
    });
  }

], (err, app, server) => {
  if (err) {
    error(err);
    process.exit(100);
  }

  global.online = true;
});


/**
 * The main server setup.
 * @param  {Object}    mongoCM  - the mongo connection manager
 * @param  {Object}    redisCM  - the redis client
 * @param  {Function}  callback - the callback function
 * @return {undefined}
 */
// function setupServer(mongoCM, redisCM, callback) {
function setupServer(callback) {

  // Get express.
  var app = express();

  // Setup locals.
  // app.locals.config = APP_CONFIG;

  // Check for local environment in order to setup webpack.
  console.log('Environment', APP_CONFIG.env)
  if (APP_CONFIG.env === 'local') {
    console.log('Setting up webpack for a local deployment ...');
    let webpack           = require('webpack');
    let webpackMiddleware = require('webpack-dev-middleware');
    let webpackConfig     = require('../webpack');
    let compiler          = webpack(webpackConfig);

    app.use(webpackMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath
    }));
    console.log('Webpack now listening for changes ...');
  }

  // Setup location of public facing files.
  global.fileServeRoot = path.join(__dirname, '..', 'public');
  app.use(express.static(global.fileServeRoot));

  // Setup the middleware.
  console.log('Setting up middleware ...');
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(expressSession({
    secret:            APP_CONFIG.authentication.session.secret,
    resave:            false,
    saveUninitialized: true,
    genid:             () => { return uuid(); },
    cookie:            {
      httpOnly: true,
      secure:   true,
      sameSite: 'lax',
      maxAge:   null // session does not expire
    },
    rolling: true,
    secure:  true,
    store:   new RedisStore()
  }));

  // Setup application debugging.
  //app.use(morgan('combined'));
  
  // Trace all incoming traffic.
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`, (req.body) ? req.body : undefined);
    next();
  });
  
  app.use((req, res, next) => {
    // console.log(req.headers);
    // SESSION.read(req, (err, result) => {
    //   if (err) return console.error(err);
    //   if (!result || !result.userID) return warn('Not Authenticated');
    // 
    //   const USER_ID = result.userID;
    //   const PORTAL  = result.portal;
    //   const QUERY   = { 'userID': USER_ID };
    //   next();
    // 
    // });
    next()
  });

  // Setup the routes.
  console.log('Setting up API routes ...');
  var api = require('./api')(app.locals);
  app.use('/', api);

  // Redirect all unhandled routes
  app.use((req, res, next) => {
    console.warn(`404 Not Found [${req.method} ${req.originalUrl}].`);
    res.status(404).end();
  });

  // Internally handle a server error by logging the stack trace.
  app.use((err, req, res, next) => {
    console.error(err.stack);
    next(err);
  });

  // If the request was an XHR, then we return an error JSON object.
  app.use((err, req, res, next) => {
    if (req.xhr) {
      return res.status(500).send({ msg: 'Something failed!' });
    }
    next(err);
  });

  // Last error handling usecase, we redirect the user to a generic 500 page.
  app.use((err, req, res, next) => {
    console.error(`500 ${req.method} ${req.originalUrl}`, err);
    res.status(500).end();
  });

  // Create the HTTP or HTTPS server as determined by config data.
  var server;
  console.log('Setting up HTTP server ...');
  server = http.createServer(app);

  // Listen on the provided port, on all network interfaces.
  app.set('port', APP_CONFIG.server.port);
  server.listen(app.get('port'));

  server.on('error', (err) => {
    if (err.syscall !== 'listen') {
      return callback(err);
    }

    // handle specific listen ERRORS with friendly messages
    const PORT = app.get('port');
    const BIND = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;
    switch (err.code) {
      case 'EACCES':
        console.error(`${BIND} requires additional privileges`);
        break;

      case 'EADDRINUSE':
        console.error(`${BIND} is currently in use`);
        break;
    }

    callback(err);
  });

  server.on('listening', () => {
    const ADDR = server.address();
    const BIND = typeof ADDR === 'string' ? `pipe ${ADDR}` : `port ${ADDR.port}`;
    console.log(`Listening on ${BIND}`, ADDR);

    const HOST_NAME  = os.hostname();
    console.log(`The hostname is ${HOST_NAME}`);
    callback(null, app, server);
  });
}

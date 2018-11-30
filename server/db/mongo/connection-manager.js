var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const models = require('./models');
const EventEmitter = require('events');
const APP_CONFIG = require('../../../config');
// const MONGO_DB = {
//   username: null,
//   password: null,
//   host:     'localhost',
//   port:     '27017',
//   database: 'service-messages'
// };

class ConnectionManager extends EventEmitter {
  constructor(db) {
    super();

    var self = this;
    this.connections = {};

    var mongo = APP_CONFIG.mongo;
    var auth = (mongo.username && mongo.password) ? `${mongo.username}:${mongo.password}@` : '';
    var URI = `mongodb://${auth}${mongo.host}:${mongo.port}/${mongo.database}`;

    var connection = mongoose.createConnection(URI);
    console.log('Connecting to database: ' + URI);
    connection.on('connecting', () => { console.log('connecting'); });
    connection.on('open', () => { console.log('open'); });
    connection.on('disconnecting', () => { console.log('disconnecting'); });
    connection.on('disconnected', () => { console.log('disconnected'); });
    connection.on('close', () => { console.log('close'); });
    connection.on('reconnected', () => { console.log('reconnected'); });
    connection.on('fullsetup', () => { console.log('fullsetup'); });
    connection.on('all', () => { console.log('all'); });

    connection.on('connected', function () {
      // info(`Successfully connected to ${URI}`);
      var keys = Object.keys(models);
      var m = {};
      for (var j = 0; j < keys.length; j++) {
        m[keys[j]] = connection.model(keys[j], models[keys[j]]);
      }
      self.connections[mongo.database] = {
        connection: connection,
        models:     m
      };

      self.emit('connected', URI);
    });
    connection.on('error', function (data) {
      console.error(`Failed to connect to ${URI}`, data);
      self.emit('error', data);
    });

  }

  get connection() {
    return this.connections[APP_CONFIG.mongo.database];
  }

  static create() {
    console.warn('Not yet defined');
  }

  static close() {
    console.warn('Not yet defined');
  }
}


module.exports = new ConnectionManager();

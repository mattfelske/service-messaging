module.exports = (locals) => {

  var exitHandler = (options, err) => {
    console.log('Performing application exit ...');

    if (options.cleanup) console.log('clean');
    if (err) console.error(err);
    if (options.exit) {
      if (locals && locals.online) {
        // TODO if we were running a gateway we would deregister with it here.
        process.exit();
      } else {
        process.exit();
      }
    }
  };

  // do something when app is closing
  process.on('exit', exitHandler.bind(null, { cleanup: true }));

  // catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, { exit: true }));

  // catches uncaught exceptions
  process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
};

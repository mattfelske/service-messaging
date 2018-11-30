/**
 * Send an XMLHttpRequest to the server.
 * @param {String}   method   - GET, POST, PUT etc ...
 * @param {String}   uri      - The endpoint route
 * @param {JSON}     options  - Top level parameters mush be qs & body.
 * @param {Function} callback - The callback function
 */
module.exports = (method, uri, options, callback) => {
  if (options && options.qs) {
    var params = Object.keys(options.qs);
    uri += '?';
    params.forEach((param) => {
      uri += `${param}=${options.qs[param]}&`;
    });
    uri = uri.slice(0, -1);
  }

  var xhr = new XMLHttpRequest();
  xhr.open(method.toUpperCase(), uri);
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.setRequestHeader('Accept', 'application/json;charset=UTF-8');

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 401) return window.location.replace(`${window.location.origin}?status=unauthorized`);
      callback(null, xhr.status, xhr.response);
    }
  };

  if (options && options.body) {
    console.log(`${method.toUpperCase()} ${uri} ${JSON.stringify(options.body)}`);
    xhr.send(JSON.stringify(options.body));
  } else {
    console.log(`${method.toUpperCase()} ${uri}`);
    xhr.send();
  }
};

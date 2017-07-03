const request = require('request-promise-native');
const functions = require('firebase-functions');

module.exports = function(req, res) {

  const config = functions.config().elasticsearch;

  const uri = config.uri + req.body.path + '/_search';

  console.log('Requesting', uri);

  request({
    method: 'GET',
    uri: uri,
    auth: {
      username: config.username,
      password: config.password
    },
    json: true,
    body: req.body.searchDsl,
  }).then(
    response => {
      console.log('Success, sending response to client');
      res.status(200).send(response);
    },
    error => {
      console.error(error.message);
      res.status(error.statusCode).send(error.message);
    }
  );
};

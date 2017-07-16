function searchInElasticFabric(functions, request) {
  return function ({ index, type, query, highlight, response }) {

    //noinspection JSUnresolvedVariable
    const config = functions.config().elasticsearch;

    const uri = `${config.uri}/${index}/${type}/_search`;

    request({
      method: 'GET',
      uri: uri,
      auth: {
        username: config.username,
        password: config.password
      },
      json: true,
      body: {
        query: query,
        highlight: highlight
      }
    }).then(
      responseFromElastic => {
        console.log('Successful search, sending response to client');
        response.status(200).send(responseFromElastic);
      },
      error => {
        console.error(error);
        response.status(error.statusCode).send(error.message);
      }
    )
  }
}

module.exports = searchInElasticFabric;

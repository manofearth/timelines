const request = require('request-promise-native');
const functions = require('firebase-functions');

function createWildcardsFilter(matchQuery) {
  return matchQuery
    .split(' ')
    .map(token => ({
      wildcard: {
        title: '*' + token.toLowerCase() + '*'
      }
    }));
}

function createFilter(matchQuery, ownerId) {
  return [
    {
      term: {
        ownerId: ownerId
      }
    },
    ...createWildcardsFilter(matchQuery)
  ];
}

function createQuery(matchQuery, ownerId) {
  return {
    bool: {
      should: {
        match: {
          title: matchQuery
        }
      },
      filter: createFilter(matchQuery, ownerId),
    }
  };
}

function searchTimelineEvents(req, res) {

  //noinspection JSUnresolvedVariable
  const config = functions.config().elasticsearch;

  const uri = config.uri + '/timelines_ru/event/_search';

  console.log('Requesting', uri, 'for owner', req.query.o, 'with query', req.query.q);

  request({
    method: 'GET',
    uri: uri,
    auth: {
      username: config.username,
      password: config.password
    },
    json: true,
    body: {
      query: createQuery(req.query.q, req.query.o),
      highlight: {
        fields: {
          title: {}
        }
      }
    }
  }).then(
    response => {
      console.log('Success, sending response to client');
      res.status(200).send(response);
    },
    error => {
      console.error(error);
      res.status(error.statusCode).send(error.message);
    }
  );
}

module.exports = searchTimelineEvents;


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

function searchTimelineEventsFabric(searchInElastic) {

  return function(req, res) {

    searchInElastic({
      index: 'timelines_ru',
      type: 'events_type',
      query: createQuery(req.query.q, req.query.o),
      highlight: {
        fields: {
          title: {}
        }
      },
      response: res,
    });
  }
}

module.exports = searchTimelineEventsFabric;

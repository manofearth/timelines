
function createWildcardsFilter(matchQuery) {
  return matchQuery
    .split(' ')
    .map(token => ({
      wildcard: {
        title: '*' + token.toLowerCase() + '*'
      }
    }));
}

function createFilter(ownerId, matchQuery) {

  const ownerFilter = {
    term: {
      ownerId: ownerId
    }
  };

  if (matchQuery) {
    return [
      ...[ownerFilter],
      ...createWildcardsFilter(matchQuery),
    ]
  } else {
    return ownerFilter;
  }
}

function createQuery(ownerId, matchQuery) {

  const query = {
    bool: {
      filter: createFilter(ownerId, matchQuery),
    }
  };

  if (matchQuery) {
    query.bool.should = {
      match: {
        title: matchQuery
      }
    }
  }

  return query;
}

function createQueryAndHighlight(ownerId, matchQuery) {
  const result = {
    query: createQuery(ownerId, matchQuery)
  };

  if (matchQuery) {
    result.highlight = {
      fields: {
        title: {}
      }
    }
  }

  return result;
}

function searchTimelineEventsFabric(searchInElastic) {

  return function(req, res) {

    const queryAndHighlight = createQueryAndHighlight(req.query.o, req.query.q);

    searchInElastic({
      index: 'timelines_ru',
      type: 'events_type',
      query: queryAndHighlight.query,
      highlight: queryAndHighlight.highlight,
      response: res,
    });
  }
}

module.exports = searchTimelineEventsFabric;

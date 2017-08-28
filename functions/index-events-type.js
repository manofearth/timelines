function toElasticSearchEventType(eventType, ownerId) {
  if (!eventType) {
    return null;
  }
  return {
    title: eventType.title,
    ownerId: ownerId,
    kind: eventType.kind,
  };
}

function indexEventsTypeFabric(functions, request) {
  return function (firebaseEvent) {

    console.log('Indexing events type', firebaseEvent.params.typeId);

    const config = functions.config().elasticsearch;

    return request({
      method: firebaseEvent.data.val() ? 'POST' : 'DELETE',
      uri: config.uri + '/timelines_ru/events_type/' + firebaseEvent.params.typeId,
      auth: {
        username: config.username,
        password: config.password
      },
      json: true,
      body: toElasticSearchEventType(firebaseEvent.data.val(), firebaseEvent.params.userId),
    }).then(
      response => {
        console.log('ElasticSearch response:', response);
      },
      error => {
        console.error('ElasticSearch error:', error.message);
      }
    );
  }
}

module.exports = indexEventsTypeFabric;

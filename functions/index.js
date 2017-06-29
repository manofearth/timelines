const functions = require('firebase-functions');
const request = require('request-promise-native');

exports.indexTimelineEvent = functions.database.ref('/private/{userId}/events/{eventId}').onWrite(event => {

  const config = functions.config().elasticsearch;

  console.log('Indexing event', event.params.eventId);

  return request({
    method: event.data.val() ? 'POST' : 'DELETE',
    uri: config.uri + '/timelines_ru/event/' + event.params.eventId,
    auth: {
      username: config.username,
      password: config.password
    },
    body: toElasticSearchTimelineEvent(event.data.val(), event.params.userId),
    json: true
  }).then(
    response => {
      console.log('ElasticSearch response:', response);
    },
    error => {
      console.error('ElasticSearch error:', error.message);
    }
  );
});


function toElasticSearchTimelineEvent(timelineEvent, ownerId) {
  if (!timelineEvent) {
    return null;
  }
  return {
    title: timelineEvent.title,
    ownerId: ownerId
  };
}

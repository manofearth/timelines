const request = require('request-promise-native');
const functions = require('firebase-functions');

function toElasticSearchTimelineEvent(timelineEvent, ownerId) {
  if (!timelineEvent) {
    return null;
  }
  return {
    title: timelineEvent.title,
    ownerId: ownerId
  };
}

function indexTimelineEvent(firebaseEvent) {

  const config = functions.config().elasticsearch;

  console.log('Indexing event', firebaseEvent.params.eventId);

  return request({
    method: firebaseEvent.data.val() ? 'POST' : 'DELETE',
    uri: config.uri + '/timelines_ru/event/' + firebaseEvent.params.eventId,
    auth: {
      username: config.username,
      password: config.password
    },
    json: true,
    body: toElasticSearchTimelineEvent(firebaseEvent.data.val(), firebaseEvent.params.userId),
  }).then(
    response => {
      console.log('ElasticSearch response:', response);
    },
    error => {
      console.error('ElasticSearch error:', error.message);
    }
  );
}

module.exports = indexTimelineEvent;

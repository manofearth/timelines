const functions = require('firebase-functions');
const indexTimelineEvent = require('./index-timeline-event');
const queryElasticSearch = require('./query-elastic-search');

exports.indexTimelineEvent = functions.database.ref('/private/{userId}/events/{eventId}').onWrite(indexTimelineEvent);
exports.queryElasticSearch = functions.https.onRequest(queryElasticSearch);

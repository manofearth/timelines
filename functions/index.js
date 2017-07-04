const functions = require('firebase-functions');
const indexTimelineEvent = require('./index-timeline-event');
const searchTimelineEvents = require('./search-timeline-events');

exports.indexTimelineEvent = functions.database.ref('/private/{userId}/events/{eventId}').onWrite(indexTimelineEvent);
exports.queryElasticSearch = functions.https.onRequest(searchTimelineEvents);

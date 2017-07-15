const functions = require('firebase-functions');
const indexTimelineEvent = require('./index-timeline-event');
const searchTimelineEvents = require('./search-timeline-events');
const indexEventsType = require('./index-events-type');

exports.indexTimelineEvent = functions.database.ref('/private/{userId}/events/{eventId}').onWrite(indexTimelineEvent);
exports.indexEventType = functions.database.ref('/private/{userId}/types/{typeId}').onWrite(indexEventsType);
exports.queryElasticSearch = functions.https.onRequest(searchTimelineEvents);

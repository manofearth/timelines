const functions = require('firebase-functions');
const request = require('request-promise-native');

const searchInElastic = require('./search-in-elastic')(functions, request);

const indexTimelineEvent = require('./index-timeline-event')(functions, request);
const indexEventsType = require('./index-events-type')(functions, request);
const searchTimelineEvents = require('./search-timeline-events')(searchInElastic);
const searchEventsTypes = require('./search-events-types')(searchInElastic);

exports.indexTimelineEvent = functions.database.ref('/private/{userId}/events/{eventId}').onWrite(indexTimelineEvent);
exports.indexEventType = functions.database.ref('/private/{userId}/types/{typeId}').onWrite(indexEventsType);
exports.searchTimelineEvents = functions.https.onRequest(searchTimelineEvents);
exports.searchEventsTypes = functions.https.onRequest(searchEventsTypes);

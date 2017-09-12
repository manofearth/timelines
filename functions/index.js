const functions = require('firebase-functions');
const request = require('request-promise-native');
const admin = require('firebase-admin');
const algoliaClient = require('algoliasearch')(
  functions.config().algolia.application_id, functions.config().algolia.api_key
);

admin.initializeApp(functions.config().firebase);

const indexTimelineEvent = require('./index-timeline-event')(functions, request);
const indexTimelineEventToAlgolia = require('./index-timeline-event-to-algolia')(algoliaClient);
const indexEventsType = require('./index-events-type')(functions, request);
const indexEventsTypeToAlgolia = require('./index-events-type-to-algolia')(algoliaClient);
const searchInElastic = require('./search-in-elastic')(functions, request);
const searchTimelineEvents = require('./search-timeline-events')(searchInElastic);
const searchEventsTypes = require('./search-events-types')(searchInElastic);
const moveEventToAnotherType = require('./move-event-to-another-type')(admin);

// Full text search
exports.indexTimelineEvent = functions.database.ref('/private/{userId}/events/{eventId}')
  .onWrite(indexTimelineEvent);
exports.indexTimelineEventToAlgolia = functions.database.ref('/private/{userId}/events/{eventId}')
  .onWrite(indexTimelineEventToAlgolia);
exports.indexEventsType = functions.database.ref('/private/{userId}/types/{typeId}')
  .onWrite(indexEventsType);
exports.indexEventsTypeToAlgolia = functions.database.ref('/private/{userId}/types/{typeId}')
  .onWrite(indexEventsTypeToAlgolia);
exports.searchTimelineEvents = functions.https.onRequest(searchTimelineEvents);
exports.searchEventsTypes = functions.https.onRequest(searchEventsTypes);

// Data integrity
exports.moveEventToAnotherType = functions.database
  .ref('/private/{userId}/events/{eventId}/typeId')
  .onWrite(moveEventToAnotherType);

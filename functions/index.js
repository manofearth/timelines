const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliaClient = require('algoliasearch')(
  functions.config().algolia.application_id, functions.config().algolia.api_key
);

admin.initializeApp(functions.config().firebase);

const indexTimelineEventToAlgolia = require('./index-timeline-event-to-algolia')(algoliaClient);
const indexEventsTypeToAlgolia = require('./index-events-type-to-algolia')(algoliaClient);
const indexInfoSourceToAlgolia = require('./index-info-source-to-algolia')(algoliaClient);
const moveEventToAnotherType = require('./move-event-to-another-type')(admin);

// Full text search
exports.indexTimelineEventToAlgolia = functions.database.ref('/private/{userId}/events/{eventId}')
  .onWrite(indexTimelineEventToAlgolia);
exports.indexEventsTypeToAlgolia = functions.database.ref('/private/{userId}/types/{typeId}')
  .onWrite(indexEventsTypeToAlgolia);
exports.indexInfoSourceToAlgolia = functions.database.ref('/private/{userId}/info-sources/{infoSourceId}')
  .onWrite(indexInfoSourceToAlgolia);

// Data integrity
exports.moveEventToAnotherType = functions.database
  .ref('/private/{userId}/events/{eventId}/typeId')
  .onWrite(moveEventToAnotherType);

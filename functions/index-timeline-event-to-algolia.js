const saveObjectInAlgoliaIndex = require('./save-object-in-algolia-index.fn');
const deleteObjectFromAlgoliaIndex = require('./save-object-in-algolia-index.fn');

function toAlgoliaTimelineEvent(dbEvent) {
  const data = dbEvent.data.val();
  return {
    objectID: dbEvent.params.eventId,
    ownerId: dbEvent.params.userId,
    title: data.title,
    dateBegin: data.dateBegin,
    dateEnd: data.dateEnd,
  };
}

function indexTimelineEventToAlgoliaFabric(algoliaClient) {
  return function (dbEvent) {

    console.log('Indexing event', dbEvent.params.eventId, 'in algolia');

    const eventsIndex = algoliaClient.initIndex('events');

    if (dbEvent.data.exists()) {
      return saveObjectInAlgoliaIndex(toAlgoliaTimelineEvent(dbEvent), eventsIndex);
    } else {
      return deleteObjectFromAlgoliaIndex(dbEvent.params.eventId, eventsIndex);
    }
  }
}

module.exports = indexTimelineEventToAlgoliaFabric;

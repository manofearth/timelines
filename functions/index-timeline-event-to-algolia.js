function toAlgiliaTimelineEvent(id, ownerId, data) {
  return {
    objectID: id,
    title: data.title,
    dateBegin: data.dateBegin,
    dateEnd: data.dateEnd,
    ownerId: ownerId,
  };
}

function indexTimelineEventToAlgoliaFabric(algoliaClient) {
  return function (dbEvent) {

    console.log('Indexing event', dbEvent.params.eventId, 'in algolia');

    const eventsIndex = algoliaClient.initIndex('events');

    if (dbEvent.data.exists()) {
      return eventsIndex
        .saveObject(toAlgiliaTimelineEvent(dbEvent.params.eventId, dbEvent.params.userId, dbEvent.data.val()))
        .then(
          () => {
            console.log('Indexed successfully');
          },
          error => {
            console.error('Indexing error:', error.message);
          }
        );
    } else {
      return eventsIndex.deleteObjects(dbEvent.params.eventId)
        .then(
          () => {
            console.log('Deleted from index successfully');
          },
          error => {
            console.error('Deleting from index error:', error.message);
          }
        );
    }
  }
}

module.exports = indexTimelineEventToAlgoliaFabric;

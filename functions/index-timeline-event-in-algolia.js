function toElasticSearchTimelineEvent(timelineEvent, ownerId) {
  if (!timelineEvent) {
    return null;
  }
  return {
    title: timelineEvent.title,
    ownerId: ownerId
  };
}

function indexTimelineEventInAlgoliaFabric(functions, algoliaClient) {
  return function (firebaseEvent) {

    console.log('Indexing event', firebaseEvent.params.eventId, 'in algolia');

    const config = functions.config().algolia;

    //...
  }
}

module.exports = indexTimelineEventInAlgoliaFabric;

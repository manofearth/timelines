const saveObjectInAlgoliaIndex = require('./save-object-in-algolia-index.fn');
const deleteObjectFromAlgoliaIndex = require('./delete-object-from-algolia-index.fn');

function toAlgoliaEventType(dbEvent) {
  const data = dbEvent.data.val();
  return {
    objectID: dbEvent.params.typeId,
    ownerId: dbEvent.params.userId,
    title: data.title,
    kind: data.kind,
  };
}

function indexEventTypeToAlgoliaFabric(algoliaClient) {
  return function (dbEvent) {

    console.log('Indexing type', dbEvent.params.typeId, 'in algolia');

    const typesIndex = algoliaClient.initIndex('types');

    if (dbEvent.data.exists()) {
      return saveObjectInAlgoliaIndex(toAlgoliaEventType(dbEvent), typesIndex);
    } else {
      return deleteObjectFromAlgoliaIndex(dbEvent.params.typeId, typesIndex);
    }
  }
}

module.exports = indexEventTypeToAlgoliaFabric;

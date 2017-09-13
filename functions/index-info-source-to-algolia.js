const saveObjectInAlgoliaIndex = require('./save-object-in-algolia-index.fn');
const deleteObjectFromAlgoliaIndex = require('./delete-object-from-algolia-index.fn');

function toAlgoliaInfoSource(dbEvent) {
  const data = dbEvent.data.val();
  return {
    objectID: dbEvent.params.infoSourceId,
    ownerId: dbEvent.params.userId,
    title: data.title,
  };
}

function indexInfoSourceToAlgoliaFabric(algoliaClient) {
  return function (dbEvent) {

    console.log('Indexing info source', dbEvent.params.infoSourceId, 'to algolia');

    const infoSourcesIndex = algoliaClient.initIndex('info-sources');

    if (dbEvent.data.exists()) {
      return saveObjectInAlgoliaIndex(toAlgoliaInfoSource(dbEvent), infoSourcesIndex);
    } else {
      return deleteObjectFromAlgoliaIndex(dbEvent.params.infoSourceId, infoSourcesIndex);
    }
  }
}

module.exports = indexInfoSourceToAlgoliaFabric;

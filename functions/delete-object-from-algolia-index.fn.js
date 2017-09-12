function deleteObjectFromAlgoliaIndex(objectId, algoliaIndex) {
  return algoliaIndex
    .deleteObject(objectId)
    .then(
      () => {
        console.log('Deleted from index successfully');
      },
      error => {
        console.error('Deleting from index error:', error.message);
      }
    );
}

module.exports = deleteObjectFromAlgoliaIndex;

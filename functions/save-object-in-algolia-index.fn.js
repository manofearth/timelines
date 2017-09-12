function saveObjectInAlgoliaIndex(algoliaObject, algoliaIndex) {
  return algoliaIndex
    .saveObject(algoliaObject)
    .then(
      () => {
        console.log('Indexed successfully');
      },
      error => {
        console.error('Indexing error:', error.message);
      }
    );
}

module.exports = saveObjectInAlgoliaIndex;

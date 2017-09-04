function moveEventToAnotherTypeFabric(admin) {
  return function (dbEvent) {

    const dbOperations = [];

    if (dbEvent.data.previous.exists()) {
      console.log(`Detaching event ${dbEvent.params.eventId} from type ${dbEvent.data.previous.val()}`);
      dbOperations.push(
        createRemoveOperation(admin, dbEvent.params.userId, dbEvent.data.previous.val(), dbEvent.params.eventId)
      );
    }

    if (dbEvent.data.exists()) {
      console.log(`Attaching event ${dbEvent.params.eventId} to type ${dbEvent.data.val()}`);
      dbOperations.push(
        createSetOperation(admin, dbEvent.params.userId, dbEvent.data.val(), dbEvent.params.eventId)
      );
    }

    return Promise.all(dbOperations);
  }
}

function createRemoveOperation(admin, userId, typeId, eventId) {
  const path = pathToTypeEvent(userId, typeId, eventId);
  return admin.database().ref(path).remove();
}

function createSetOperation(admin, userId, typeId, eventId) {
  const path = pathToTypeEvent(userId, typeId, eventId);
  return admin.database().ref(path).set(true);
}

function pathToTypeEvent(userId, typeId, eventId) {
  return `/private/${userId}/types/${typeId}/events/${eventId}`;
}

module.exports = moveEventToAnotherTypeFabric;

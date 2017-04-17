import {
  EventCreateAction,
  EventState,
  eventReducer,
  EventUpdateAction,
  EventUpdateSuccessAction,
  EventUpdateErrorAction,
  EventInsertErrorAction,
  EventInsertSuccessAction,
  EventInsertAction,
  EventGetAction,
  EventGetSuccessAction,
  EventGetErrorAction,
} from './event.reducer';

describe('eventReducer', () => {

  it('on EVENT_CREATE should set new event', () => {
    const action: EventCreateAction = {
      type: 'EVENT_CREATE',
      payload: 'some event title',
    };

    const state: EventState = Object.freeze<EventState>({
      status: null,
      error: null,
      event: null,
    });

    const newState = eventReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<EventState> {
      status: 'NEW',
      error: null,
      event: {
        id: null,
        title: 'some event title',
        dateBegin: null,
        dateEnd: null,
      },
    });
  });

  it('on EVENT_UPDATE should set event model and mark as saving', () => {
    const action: EventUpdateAction = {
      type: 'EVENT_UPDATE',
      payload: <any> 'some new event',
    };

    const state: EventState = Object.freeze<EventState>({
      status: 'UPDATED',
      error: null,
      event: <any> 'some event',
    });

    const newState = eventReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<EventState>{
      status: 'UPDATING',
      error: null,
      event: <any> 'some new event',
    });
  });

  it('on EVENT_UPDATE_SUCCESS should mark as not saving and erase error', () => {
    const action: EventUpdateSuccessAction = {
      type: 'EVENT_UPDATE_SUCCESS',
    };

    const state: EventState = Object.freeze<EventState>({
      status: 'ERROR',
      error: new Error('some error'),
      event: <any> 'some event',
    });

    const newState = eventReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<EventState>{
      status: 'UPDATED',
      error: null,
      event: <any> 'some event',
    });
  });

  it('on EVENT_UPDATE_ERROR should mark as not saving and set error', () => {
    const action: EventUpdateErrorAction = {
      type: 'EVENT_UPDATE_ERROR',
      payload: <any> 'some error',
    };

    const state: EventState = Object.freeze<EventState>({
      status: 'UPDATING',
      error: null,
      event: <any> 'some event',
    });

    const newState = eventReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<EventState>{
      status: 'ERROR',
      error: <any> 'some error',
      event: <any> 'some event',
    });
  });

  it('on EVENT_INSERT should set event model and mark as saving', () => {
    const action: EventInsertAction = {
      type: 'EVENT_INSERT',
      payload: <any> 'some new event',
    };

    const state: EventState = Object.freeze<EventState>({
      status: 'UPDATED',
      error: null,
      event: <any> 'some event',
    });

    const newState = eventReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<EventState>{
      status: 'INSERTING',
      error: null,
      event: <any> 'some new event',
    });
  });

  it('on EVENT_INSERT_SUCCESS should set event id, mark as not saving and erase error', () => {
    const action: EventInsertSuccessAction = {
      type: 'EVENT_INSERT_SUCCESS',
      payload: 'generated key',
    };

    const state: EventState = Object.freeze<EventState>({
      status: 'INSERTING',
      error: new Error('some error'),
      event: <any> { id: null },
    });

    const newState = eventReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<EventState>{
      status: 'INSERTED',
      error: null,
      event: { id: 'generated key' },
    });
  });

  it('on EVENT_INSERT_ERROR should mark as not saving and set error', () => {
    const action: EventInsertErrorAction = {
      type: 'EVENT_INSERT_ERROR',
      payload: <any> 'some error',
    };

    const state: EventState = Object.freeze<EventState>({
      status: 'INSERTING',
      error: null,
      event: <any> 'some event',
    });

    const newState = eventReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<EventState>{
      status: 'ERROR',
      error: <any> 'some error',
      event: <any> 'some event',
    });
  });

  it('on EVENT_GET should mark as loading and erase error', () => {
    const action: EventGetAction = {
      type: 'EVENT_GET',
      payload: 'some-event-id',
    };

    const state: EventState = Object.freeze<EventState>({
      status: 'UPDATED',
      error: <any> 'error stub',
      event: <any> 'event stub',
    });

    const newState = eventReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<EventState> {
      status: 'LOADING',
      error: null,
      event: <any> 'event stub',
    });
  });

  it('on EVENT_GET_SUCCESS should mark as loaded and set new event', () => {
    const action: EventGetSuccessAction = {
      type: 'EVENT_GET_SUCCESS',
      payload: <any> 'some loaded event stub',
    };

    const state: EventState = Object.freeze<EventState>({
      status: 'LOADING',
      error: null,
      event: <any> 'event stub',
    });

    const newState = eventReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<EventState> {
      status: 'LOADED',
      error: null,
      event: <any> 'some loaded event stub',
    });
  });

  it('on EVENT_GET_ERROR should mark as erroneous and set error', () => {
    const action: EventGetErrorAction = {
      type: 'EVENT_GET_ERROR',
      payload: <any> 'some error stub',
    };

    const state: EventState = Object.freeze<EventState>({
      status: 'LOADING',
      error: null,
      event: <any> 'event stub',
    });

    const newState = eventReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<EventState> {
      status: 'ERROR',
      error: <any> 'some error stub',
      event: <any> 'event stub',
    });
  });
});

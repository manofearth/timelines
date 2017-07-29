import {
  TimelineChangedAction,
  TimelineGetErrorAction,
  TimelineGetSuccessAction,
  TimelineSaveErrorAction,
  TimelineSaveSuccessAction,
  TimelineState,
  timelineStateReducer
} from './timeline-state.reducer';

describe('timeline reducer', () => {

  it('on TIMELINE_GET_SUCCESS should mark not loading, erase error, and set timeline', () => {

    const state: TimelineState = Object.freeze({
      isLoading: true,
      isSaving: false,
      error: new Error('some error'),
      timeline: null
    });

    const action: TimelineGetSuccessAction = {
      type: 'TIMELINE_GET_SUCCESS',
      payload: {
        id: '-KYM3lCiVvKVV-mJt3eB',
        title: 'Second World War',
        events: [
          { id: 'some-event-id-1', title: 'some event 1', dateBegin: null, dateEnd: null },
          { id: 'some-event-id-2', title: 'some event 2', dateBegin: null, dateEnd: null },
        ]
      },
    };

    const newState: TimelineState = timelineStateReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<TimelineState>{
      isLoading: false,
      isSaving: false,
      error: null,
      timeline: {
        id: '-KYM3lCiVvKVV-mJt3eB',
        title: 'Second World War',
        events: [
          { id: 'some-event-id-1', title: 'some event 1', dateBegin: null, dateEnd: null },
          { id: 'some-event-id-2', title: 'some event 2', dateBegin: null, dateEnd: null },
        ]
      },
    });
  });

  it('on TIMELINE_GET_ERROR should mark not loading and set error', () => {

    const state: TimelineState = Object.freeze({
      isLoading: true,
      isSaving: false,
      error: new Error('some error'),
      timeline: {
        id: '-KYM3lCiVvKVV-mJt3eB',
        title: 'Second World War',
        events: [
          { id: 'some-event-id-1', title: 'some event 1', dateBegin: null, dateEnd: null },
          { id: 'some-event-id-2', title: 'some event 2', dateBegin: null, dateEnd: null },
        ]
      },
    });

    const action: TimelineGetErrorAction = {
      type: 'TIMELINE_GET_ERROR',
      payload: new Error('some error'),
    };

    const newState: TimelineState = timelineStateReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<TimelineState>{
      isLoading: false,
      isSaving: false,
      error: new Error('some error'),
      timeline: {
        id: '-KYM3lCiVvKVV-mJt3eB',
        title: 'Second World War',
        events: [
          { id: 'some-event-id-1', title: 'some event 1', dateBegin: null, dateEnd: null },
          { id: 'some-event-id-2', title: 'some event 2', dateBegin: null, dateEnd: null },
        ]
      },
    });
  });

  it('on TIMELINE_CHANGED should mark as saving, change timeline and erase error', () => {

    const state: TimelineState = Object.freeze({
      isLoading: true,
      isSaving: false,
      error: new Error('some error'),
      timeline: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War', events: [] },
    });

    const action: TimelineChangedAction = {
      type: 'TIMELINE_CHANGED',
      payload: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'First World War' },
    };

    const newState: TimelineState = timelineStateReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<TimelineState>{
      isLoading: true,
      isSaving: true,
      error: null,
      timeline: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'First World War', events: [] },
    });
  });

  it('on TIMELINE_SAVE_SUCCESS should mark as not saving and erase error', () => {

    const state: TimelineState = Object.freeze({
      isLoading: true,
      isSaving: true,
      error: new Error('some error'),
      timeline: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War', events: [] },
    });

    const action: TimelineSaveSuccessAction = {
      type: 'TIMELINE_SAVE_SUCCESS',
    };

    const newState: TimelineState = timelineStateReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<TimelineState>{
      isLoading: true,
      isSaving: false,
      error: null,
      timeline: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War', events: [] },
    });
  });

  it('on TIMELINE_SAVE_ERROR should mark as not saving and set error', () => {

    const state: TimelineState = Object.freeze({
      isLoading: true,
      isSaving: true,
      error: null,
      timeline: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War', events: [] },
    });

    const action: TimelineSaveErrorAction = {
      type: 'TIMELINE_SAVE_ERROR',
      payload: new Error('some error'),
    };

    const newState: TimelineState = timelineStateReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<TimelineState>{
      isLoading: true,
      isSaving: false,
      error: new Error('some error'),
      timeline: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War', events: [] },
    });
  });
});

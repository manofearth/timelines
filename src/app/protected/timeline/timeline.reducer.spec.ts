import {
  TimelineState, TimelineGetSuccessAction, timelineReducer, TimelineGetErrorAction,
  TimelineChangedAction, TimelineSaveSuccessAction, TimelineSaveErrorAction
} from './timeline.reducer';

describe('timeline reducer', () => {

  it('on ACTION_TIMELINE_GET_SUCCESS should mark not loading, erase error, and set timeline', () => {

    const state: TimelineState = Object.freeze({
      isLoading: true,
      isSaving: false,
      error: new Error('some error'),
      timeline: null
    });

    const action: TimelineGetSuccessAction = {
      type: 'ACTION_TIMELINE_GET_SUCCESS',
      payload: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
    };

    const newState: TimelineState = timelineReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<TimelineState>{
      isLoading: false,
      isSaving: false,
      error: null,
      timeline: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
    });
  });

  it('on ACTION_TIMELINE_GET_ERROR should mark not loading and set error', () => {

    const state: TimelineState = Object.freeze({
      isLoading: true,
      isSaving: false,
      error: new Error('some error'),
      timeline: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
    });

    const action: TimelineGetErrorAction = {
      type: 'ACTION_TIMELINE_GET_ERROR',
      payload: new Error('some error'),
    };

    const newState: TimelineState = timelineReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<TimelineState>{
      isLoading: false,
      isSaving: false,
      error: new Error('some error'),
      timeline: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
    });
  });

  it('on ACTION_TIMELINE_CHANGED should mark as saving, change timeline and erase error', () => {

    const state: TimelineState = Object.freeze({
      isLoading: true,
      isSaving: false,
      error: new Error('some error'),
      timeline: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
    });

    const action: TimelineChangedAction = {
      type: 'ACTION_TIMELINE_CHANGED',
      payload: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'First World War' },
    };

    const newState: TimelineState = timelineReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<TimelineState>{
      isLoading: true,
      isSaving: true,
      error: null,
      timeline: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'First World War' },
    });
  });

  it('on ACTION_TIMELINE_SAVE_SUCCESS should mark as not saving and erase error', () => {

    const state: TimelineState = Object.freeze({
      isLoading: true,
      isSaving: true,
      error: new Error('some error'),
      timeline: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
    });

    const action: TimelineSaveSuccessAction = {
      type: 'ACTION_TIMELINE_SAVE_SUCCESS',
    };

    const newState: TimelineState = timelineReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<TimelineState>{
      isLoading: true,
      isSaving: false,
      error: null,
      timeline: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
    });
  });

  it('on ACTION_TIMELINE_SAVE_ERROR should mark as not saving and set error', () => {

    const state: TimelineState = Object.freeze({
      isLoading: true,
      isSaving: true,
      error: null,
      timeline: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
    });

    const action: TimelineSaveErrorAction = {
      type: 'ACTION_TIMELINE_SAVE_ERROR',
      payload: new Error('some error'),
    };

    const newState: TimelineState = timelineReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<TimelineState>{
      isLoading: true,
      isSaving: false,
      error: new Error('some error'),
      timeline: { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
    });
  });
});

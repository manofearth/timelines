import {
  timelinesReducer,
  TimelinesState,
  TimelinesGetSuccessAction,
  TimelinesGetErrorAction,
  TimelinesCreateSuccessAction,
  TimelinesCreateErrorAction,
  TimelinesDeleteSuccessAction, TimelinesDeleteErrorAction
} from './timelines.reducer';

describe('timelines reducer', () => {

  it('on ACTION_TIMELINES_GET_SUCCESS should mark not loading, erase error and set timelines', () => {

    const state: TimelinesState = Object.freeze({
      isLoading: true,
      error: new Error('some error'),
      newTimelineId: null,
      timelines: null
    });

    const action: TimelinesGetSuccessAction = {
      type: 'ACTION_TIMELINES_GET_SUCCESS',
      payload: [
        { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
        { id: '-KYM44cIsJiGY4pWWW3W', title: 'History of Philosophy' },
      ],
    };

    const newState: TimelinesState = timelinesReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      isLoading: false,
      error: null,
      newTimelineId: null,
      timelines: [
        { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
        { id: '-KYM44cIsJiGY4pWWW3W', title: 'History of Philosophy' },
      ],
    });

  });

  it('on ACTION_TIMELINES_GET_ERROR should mark not loading and set error', () => {

    const state: TimelinesState = Object.freeze({
      isLoading: true,
      error: null,
      newTimelineId: null,
      timelines: [
        { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
        { id: '-KYM44cIsJiGY4pWWW3W', title: 'History of Philosophy' },
      ],
    });

    const action: TimelinesGetErrorAction = {
      type: 'ACTION_TIMELINES_GET_ERROR',
      payload: new Error('some error'),
    };

    const newState: TimelinesState = timelinesReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      isLoading: false,
      error: new Error('some error'),
      newTimelineId: null,
      timelines: [
        { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
        { id: '-KYM44cIsJiGY4pWWW3W', title: 'History of Philosophy' },
      ],
    });

  });

  it('on ACTION_TIMELINES_CREATE_SUCCESS should mark not loading and set "new timeline id"', () => {

    const state: TimelinesState = Object.freeze({
      isLoading: true,
      error: null,
      newTimelineId: null,
      timelines: [
        { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
        { id: '-KYM44cIsJiGY4pWWW3W', title: 'History of Philosophy' },
      ],
    });

    const action: TimelinesCreateSuccessAction = {
      type: 'ACTION_TIMELINES_CREATE_SUCCESS',
      payload: 'new-timeline-id',
    };

    const newState: TimelinesState = timelinesReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      isLoading: false,
      error: null,
      newTimelineId: 'new-timeline-id',
      timelines: [
        { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
        { id: '-KYM44cIsJiGY4pWWW3W', title: 'History of Philosophy' },
      ],
    });

  });

  it('on ACTION_TIMELINES_CREATE_ERROR should mark not loading and set error', () => {

    const state: TimelinesState = Object.freeze({
      isLoading: true,
      error: null,
      newTimelineId: null,
      timelines: [
        { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
        { id: '-KYM44cIsJiGY4pWWW3W', title: 'History of Philosophy' },
      ],
    });

    const action: TimelinesCreateErrorAction = {
      type: 'ACTION_TIMELINES_CREATE_ERROR',
      payload: new Error('some error'),
    };

    const newState: TimelinesState = timelinesReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      isLoading: false,
      error: new Error('some error'),
      newTimelineId: null,
      timelines: [
        { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
        { id: '-KYM44cIsJiGY4pWWW3W', title: 'History of Philosophy' },
      ],
    });

  });

  it('on ACTION_TIMELINES_DELETE_SUCCESS should mark not loading and erase error', () => {

    const state: TimelinesState = Object.freeze({
      isLoading: true,
      error: new Error('some error'),
      newTimelineId: null,
      timelines: [
        { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
        { id: '-KYM44cIsJiGY4pWWW3W', title: 'History of Philosophy' },
      ],
    });

    const action: TimelinesDeleteSuccessAction = {
      type: 'ACTION_TIMELINES_DELETE_SUCCESS',
    };

    const newState: TimelinesState = timelinesReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      isLoading: false,
      error: null,
      newTimelineId: null,
      timelines: [
        { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
        { id: '-KYM44cIsJiGY4pWWW3W', title: 'History of Philosophy' },
      ],
    });

  });

  it('on ACTION_TIMELINES_DELETE_ERROR should mark not loading and set error', () => {

    const state: TimelinesState = Object.freeze({
      isLoading: true,
      error: null,
      newTimelineId: null,
      timelines: [
        { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
        { id: '-KYM44cIsJiGY4pWWW3W', title: 'History of Philosophy' },
      ],
    });

    const action: TimelinesDeleteErrorAction = {
      type: 'ACTION_TIMELINES_DELETE_ERROR',
      payload: new Error('some error'),
    };

    const newState: TimelinesState = timelinesReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      isLoading: false,
      error: new Error('some error'),
      newTimelineId: null,
      timelines: [
        { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Second World War' },
        { id: '-KYM44cIsJiGY4pWWW3W', title: 'History of Philosophy' },
      ],
    });

  });

});

import { timelinesReducer, TimelinesState, TimelinesGetSuccessAction } from './timelines.reducer';

describe('timelines reducer', () => {

  it('on ACTION_TIMELINES_GET_SUCCESS should mark not loading and set timelines', () => {

    const state: TimelinesState = Object.freeze({
      isLoading: true,
      error: null,
      newTimelineId: null,
      timelines: null
    });

    const action: TimelinesGetSuccessAction = {
      type: 'ACTION_TIMELINES_GET_SUCCESS',
      payload: [
        { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Вторая мировая война' },
        { id: '-KYM44cIsJiGY4pWqoqW', title: 'История философии' },
      ],
    };

    const newState: TimelinesState = timelinesReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      isLoading: false,
      error: null,
      newTimelineId: null,
      timelines: [
        { id: '-KYM3lCiVvKVV-mJt3eB', title: 'Вторая мировая война' },
        { id: '-KYM44cIsJiGY4pWqoqW', title: 'История философии' },
      ],
    });

  });
});

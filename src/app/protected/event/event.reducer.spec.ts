import { EventCreateAction, EventState, eventReducer } from './event.reducer';

describe('eventReducer', () => {

  it('on EVENT_CREATE should set new event', () => {
    const action: EventCreateAction = {
      type: 'EVENT_CREATE',
      payload: 'some event title',
    };

    const state: any = Object.freeze(<EventState>{ event: null });

    const newState = eventReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      event: {
        title: 'some event title',
        dateBegin: null,
        dateEnd: null,
      },
    });
  });
});

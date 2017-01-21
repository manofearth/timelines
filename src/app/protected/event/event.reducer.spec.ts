import { EventCreateAction, EventState, eventReducer, EventUpdateAction } from './event.reducer';

describe('eventReducer', () => {

  it('on EVENT_CREATE should set new event', () => {
    const action: EventCreateAction = {
      type: 'EVENT_CREATE',
      payload: 'some event title',
    };

    const state: any = Object.freeze(<EventState>{ event: null });

    const newState = eventReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<EventState> {
      isSaving: false,
      event: {
        id: null,
        title: 'some event title',
        dateBegin: null,
        dateEnd: null,
      },
    });
  });

  it('on EVENT_UPDATE should mark as saving', () => {
    const action: EventUpdateAction = {
      type: 'EVENT_UPDATE',
      payload: <any> 'some event',
    };

    const state: any = Object.freeze(<EventState>{
      isSaving: false,
      event: <any> 'some event',
    });

    const newState = eventReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual(<EventState>{
      isSaving: true,
      event: <any> 'some event',
    });
  });

  it('on EVENT_UPDATE_SUCCESS should mark as not saving ', () => {

  });

});

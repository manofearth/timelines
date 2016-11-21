import { TimelinesPage } from './app.po';

describe('timelines App', function() {
  let page: TimelinesPage;

  beforeEach(() => {
    page = new TimelinesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

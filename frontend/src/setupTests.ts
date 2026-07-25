import '@testing-library/jest-dom';

window.matchMedia = window.matchMedia || function matchMediaMock(query: string) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: function () {},
    removeListener: function () {},
    addEventListener: function () {},
    removeEventListener: function () {},
    dispatchEvent: function () { return false; },
  } as MediaQueryList;
};

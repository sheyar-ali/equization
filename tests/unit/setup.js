// Nuxt sets process.client = true in the browser; tests run in jsdom so we set it here
process.client  = true;
process.browser = true;
process.server  = false;

beforeEach(() => {
  sessionStorage.clear();
  jest.clearAllMocks();
});

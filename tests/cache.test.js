const createCache = require('../src/cache');

describe('With a promise that fails', () => {
  const ERROR = new Error('The promise failed');
  const KEY = 'KEY_FAIL';
  const promiseFunc = jest.fn().mockReturnValue(Promise.reject(ERROR));

  let cachedPromise;

  beforeAll(() => {
    cachedPromise = createCache(promiseFunc);
  });

  test('Returns a rejected promise with the given error', () =>
    cachedPromise.read({ key: KEY }).catch((error) => {
      expect(error).toBe(ERROR);
    }));

  test('Calls the promise again and does not cache it', () =>
    cachedPromise.read({ key: KEY }).catch(() => {
      expect(promiseFunc.mock.calls.length).toBe(2);
    }));
});

describe('With a promise that resolves successfully', () => {
  const KEY = 'KEY_SUCCESS';
  const PAYLOAD = 'PAYLOAD';
  const PARAMETER_ONE = 'PARAMETER_ONE';
  const PARAMETER_TWO = 'PARAMETER_TWO';
  const promiseFunc = jest
    .fn()
    .mockReturnValue(new Promise(resolve => setTimeout(() => resolve(PAYLOAD), 100)));

  let cachedPromise;
  let promise;

  beforeAll(() => {
    cachedPromise = createCache(promiseFunc, { timeToLive: 10000 });
    promise = cachedPromise.read({ key: KEY }, PARAMETER_ONE, PARAMETER_TWO);
  });

  test('Calls the promise with the correct parameters', () =>
    promise.then(() => {
      expect(promiseFunc.mock.calls[0]).toEqual([PARAMETER_ONE, PARAMETER_TWO]);
    }));

  test("Resolves the promise with it's original response", () =>
    promise.then((response) => {
      expect(response).toBe(PAYLOAD);
    }));

  test('Returns the cached response when a second call is made', () =>
    cachedPromise.read({ key: KEY }, PARAMETER_ONE, PARAMETER_TWO).then(() => {
      expect(promiseFunc.mock.calls.length).toBe(1);
    }));
});

describe('When the cache expires', () => {
  const KEY = 'KEY_EXPIRE';
  const promiseFunc = jest
    .fn()
    .mockReturnValue(new Promise(resolve => setTimeout(() => resolve(), 250)));

  let cachedPromise;

  beforeAll(() => {
    cachedPromise = createCache(promiseFunc, { timeToLive: 1 });
  });

  beforeEach(() => new Promise(resolve => setTimeout(() => resolve(), 1)));

  test('Runs the promise the first time', () =>
    cachedPromise.read({ key: KEY }).then(() => {
      expect(promiseFunc.mock.calls.length).toBe(1);
    }));

  test('Runs the promise the second time', () =>
    cachedPromise.read({ key: KEY }).then(() => {
      expect(promiseFunc.mock.calls.length).toBe(2);
    }));
});

describe('With a forced invocation', () => {
  const KEY = 'KEY_FORCE';
  const promiseFunc = jest
    .fn()
    .mockReturnValue(new Promise(resolve => setTimeout(() => resolve(), 250)));

  let cachedPromise;

  beforeAll(() => {
    cachedPromise = createCache(promiseFunc, { timeToLive: 10000 });
  });

  test('Calls the promise the first time', () =>
    cachedPromise.read({ key: KEY }).then(() => {
      expect(promiseFunc.mock.calls.length).toBe(1);
    }));

  test('Calls the promise the second time', () =>
    cachedPromise.read({ forceInvoke: true, key: KEY }).then(() => {
      expect(promiseFunc.mock.calls.length).toBe(2);
    }));
});

describe('With a \'timeToLive\' of \'0\'', () => {
  const KEY = 'KEY_TIME_TO_LIVE';
  const promiseFunc = jest
    .fn()
    .mockReturnValue(
      new Promise(resolve => setTimeout(() => resolve(), 250)),
    );

  let cachedPromise;

  beforeAll(() => {
    jest.resetModules();
    // eslint-disable-next-line global-require
    const newCreateCache = require('../src/cache');
    cachedPromise = newCreateCache(promiseFunc, { timeToLive: 0 });
  });

  beforeEach(() => new Promise(resolve => setTimeout(() => resolve(), 1)));

  test('Runs the promise the first time without caching', () =>
    cachedPromise
      .read({ key: KEY })
      .then(() => {
        expect(promiseFunc.mock.calls.length).toBe(1);
        expect(cachedPromise.debug()).toEqual({});
      }));

  test('Runs the promise the second time without caching', () =>
    cachedPromise
      .read({ key: KEY })
      .then(() => {
        expect(promiseFunc.mock.calls.length).toBe(2);
        expect(cachedPromise.debug()).toEqual({});
      }));
});

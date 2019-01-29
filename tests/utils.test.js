import { shouldMakeApiCall } from '../src/utils';

describe('shouldMakeApiCall', () => {
  let cache;
  let key;
  let timeToLive;

  describe('infinite time to live with empty cache', () => {
    beforeAll(() => {
      cache = {};
      key = 'test';
      timeToLive = Number.POSITIVE_INFINITY;
    });

    test('returns true', async () => {
      expect(shouldMakeApiCall(cache, key, timeToLive)).toBeTruthy();
    });
  });

  describe('infinite time to live with cache of failed response', () => {
    beforeAll(() => {
      key = 'test';
      cache = { [key]: { response: 'Error', isSuccessful: true } };
      timeToLive = Number.POSITIVE_INFINITY;
    });

    test('returns true with empty cache', async () => {
      expect(shouldMakeApiCall(cache, key, timeToLive)).toBeTruthy();
    });
  });
});

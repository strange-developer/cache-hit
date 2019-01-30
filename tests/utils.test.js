import {
  shouldMakeApiCall,
  hasCacheValue,
  didResponsePreviouslyFail,
  isTimeToLiveExpired,
} from '../src/utils';

describe('shouldMakeApiCall', () => {
  let cache;
  let key;
  let expiryTime;

  describe('infinite time to live with empty cache', () => {
    beforeAll(() => {
      cache = {};
      key = 'test';
      expiryTime = Number.POSITIVE_INFINITY;
    });

    test('returns true', async () => {
      expect(shouldMakeApiCall(cache, key, expiryTime)).toBe(true);
    });
  });

  describe('infinite time to live with cache of failed response', () => {
    beforeAll(() => {
      key = 'test';
      cache = { [key]: { response: 'Error', isSuccessful: false } };
      expiryTime = Number.POSITIVE_INFINITY;
    });

    test('returns true with empty cache', async () => {
      expect(shouldMakeApiCall(cache, key, expiryTime)).toBe(true);
    });
  });

  describe('finite cache without cache value', () => {
    beforeAll(() => {
      cache = {};
      key = 'test';
      expiryTime = Number.MAX_SAFE_INTEGER;
    });

    test('returns true', () => {
      expect(shouldMakeApiCall(cache, key, expiryTime)).toBe(true);
    });
  });

  describe('finite cache with cache value and expired time to live', () => {
    beforeAll(() => {
      key = 'test';
      cache = { [key]: { response: 'success', isSuccessful: true } };
      expiryTime = 1;
    });

    test('returns true', () => {
      expect(shouldMakeApiCall(cache, key, expiryTime)).toBe(true);
    });
  });

  describe('returns false | finite cache with cache value and valid time to live', () => {
    beforeAll(() => {
      key = 'test';
      cache = { [key]: { response: 'success', isSuccessful: true } };
      expiryTime = Number.MAX_SAFE_INTEGER;
    });

    test('returns true', () => {
      expect(shouldMakeApiCall(cache, key, expiryTime)).toBe(false);
    });
  });
});

describe('hasCacheValue', () => {
  let key;
  let cache;

  test('returns true when cache value is present', () => {
    key = 'test-key';
    cache = { [key]: { response: 'success', isSuccessful: true } };

    expect(hasCacheValue(cache, key)).toBe(true);
  });

  test('returns false when no cache key has no object properties', () => {
    key = 'test-key';
    cache = { [key]: {} };

    expect(hasCacheValue(cache, key)).toBe(false);
  });

  test('returns false when no cache key is present', () => {
    key = 'test-key';
    cache = {};

    expect(hasCacheValue(cache, key)).toBe(false);
  });
});

describe('isTimeToLiveExpired', () => {
  let expiryTime;

  test('returns true when expiryTime is lower than current time', () => {
    expect(isTimeToLiveExpired(1)).toBe(true);
  });

  test('returns false when expiryTime is greater than current time', () => {
    expect(isTimeToLiveExpired(Number.MAX_SAFE_INTEGER)).toBe(false);
  });
});

import timekeeper from 'timekeeper';

import {
  calculateExpiry,
  hasCacheValue,
  shouldMakeApiCall,
  isTimeToLiveExpired,
} from '../src/utils';

describe('shouldMakeApiCall', () => {
  let cache;
  let key;
  let expiryTime;

  describe('empty cache with infinite expiration', () => {
    beforeAll(() => {
      cache = {};
      key = 'test';
      expiryTime = Number.POSITIVE_INFINITY;
    });

    test('returns true', async () => {
      expect(shouldMakeApiCall(cache, key, expiryTime)).toBe(true);
    });
  });

  describe('empty cache with available expiry', () => {
    beforeAll(() => {
      cache = {};
      key = 'test';
      expiryTime = Number.MAX_SAFE_INTEGER;
    });

    test('returns true', () => {
      expect(shouldMakeApiCall(cache, key, expiryTime)).toBe(true);
    });
  });

  describe('with cache value and expired cache', () => {
    beforeAll(() => {
      key = 'test';
      cache = { [key]: { response: 'success' } };
      expiryTime = 1;
    });

    test('returns true', () => {
      expect(shouldMakeApiCall(cache, key, expiryTime)).toBe(true);
    });
  });

  describe('with cache and available expiry', () => {
    beforeAll(() => {
      key = 'test';
      cache = { [key]: { response: 'success' } };
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

  describe('when cache value is present', () => {
    beforeAll(() => {
      key = 'test-key';
      cache = { [key]: { response: 'success' } };
    });

    test('returns true when cache value is present', () => {
      expect(hasCacheValue(cache, key)).toBe(true);
    });
  });

  describe('when cache value is not present', () => {
    beforeAll(() => {
      key = 'test-key';
      cache = {};
    });

    test('returns true when cache value is present', () => {
      expect(hasCacheValue(cache, key)).toBe(false);
    });
  });
});

describe('isTimeToLiveExpired', () => {
  test('returns true when expiryTime is lower than current time', () => {
    expect(isTimeToLiveExpired(1)).toBe(true);
  });

  test('returns false when expiryTime is greater than current time', () => {
    expect(isTimeToLiveExpired(Number.MAX_SAFE_INTEGER)).toBe(false);
  });
});

describe('calculateExpiry', () => {
  let timeToLive;

  describe('never expires', () => {
    beforeAll(() => {
      timeToLive = Number.POSITIVE_INFINITY;
    });

    test('returns Number.POSITIVE_INFINITY', () => {
      expect(calculateExpiry(timeToLive)).toBe(Number.POSITIVE_INFINITY);
    });
  });

  describe('sets correct expiry', () => {
    beforeAll(() => {
      timekeeper.freeze(new Date(150000000000));
      timeToLive = 15000;
    });

    afterAll(() => {
      timekeeper.reset();
    });

    test('returns correct expiry', () => {
      expect(calculateExpiry(timeToLive)).toBe(150000015000);
    });
  });
});

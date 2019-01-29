import { shouldMakeApiCall, calculateExpiry } from './utils';

function createCache(apiCall, options) {
  const cache = {};

  const internalOptions = { timeToLive: calculateExpiry(options.timeToLive) };

  async function makeCall(parameters) {
    const result = { isSuccessful: undefined, result: undefined };
    try {
      result.result = await apiCall(...parameters);
      result.isSuccessful = true;
    } catch (error) {
      result.result = error;
      result.isSuccessful = false;
    }
    return result;
  }

  async function read(key, ...parameters) {
    let response = cache;
    if (shouldMakeApiCall(cache, key, internalOptions.timeToLive)) {
      response = await makeCall(parameters);
      cache[key] = response;
      internalOptions.timeToLive = calculateExpiry(options.timeToLive);
    }
    return response;
  }

  return { read };
}

export default createCache;

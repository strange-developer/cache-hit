import { shouldMakeApiCall, calculateExpiry } from './utils';

function createCache(apiCall, options) {
  const cache = {};

  const internalOptions = { timeToLive: calculateExpiry(options.timeToLive) };

  async function read(key, ...parameters) {
    let response = cache;
    if (shouldMakeApiCall(cache, key, internalOptions.timeToLive)) {
      response = await apiCall(parameters);
      cache[key] = response;
      internalOptions.timeToLive = calculateExpiry(options.timeToLive);
    }
    return response;
  }

  return { read };
}

export default createCache;

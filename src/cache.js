import { shouldInvokePromise, calculateExpiry } from './utils';

const createCache = (promiseFunc, options = {}) => {
  const cache = {};

  const internalOptions = { timeToLive: calculateExpiry(options.timeToLive) };

  async function read(key, ...parameters) {
    let response = cache[key];
    if (shouldInvokePromise(cache, key, internalOptions.timeToLive)) {
      response = await promiseFunc(...parameters);
      cache[key] = response;
      internalOptions.timeToLive = calculateExpiry(options.timeToLive);
    }
    return response;
  }

  return { read };
};

export default createCache;

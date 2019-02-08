import { shouldInvokePromise, calculateExpiry } from './utils';

const cache = {};

const createCache = (promiseFunc, options = {}) => {
  const internalOptions = { timeToLive: calculateExpiry(options.timeToLive) };

  const read = ({ key, forceInvoke = false }, ...parameters) =>
    new Promise((resolve, reject) => {
      if (shouldInvokePromise(cache, key, internalOptions.timeToLive, forceInvoke)) {
        promiseFunc(...parameters)
          .then((promiseResponse) => {
            cache[key] = promiseResponse;
            internalOptions.timeToLive = calculateExpiry(options.timeToLive);
            resolve(cache[key]);
          })
          .catch(reject);
      } else {
        resolve(cache[key]);
      }
    });

  return { read };
};

export default createCache;

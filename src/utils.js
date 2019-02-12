function calculateExpiry(timeToLive) {
  if (timeToLive === Number.POSITIVE_INFINITY || timeToLive === undefined) {
    return Number.POSITIVE_INFINITY;
  }
  return new Date().getTime() + timeToLive;
}

function hasCacheValue(cache, key) {
  return cache[key] !== undefined;
}

function isTimeToLiveExpired(expiryTime) {
  if (new Date().getTime() > expiryTime) {
    return true;
  }
  return false;
}

function parseOptions({ timeToLive }) {
  return {
    timeToLive: timeToLive ? calculateExpiry(timeToLive) : 0,
  };
}

function shouldInvokePromise(cache, key, expiryTime, forceInvoke) {
  const containsCacheValue = hasCacheValue(cache, key);
  const isExpiryReached = isTimeToLiveExpired(expiryTime);

  if (forceInvoke || (containsCacheValue && isExpiryReached) || !containsCacheValue) {
    return true;
  }

  return false;
}

module.exports = {
  calculateExpiry,
  hasCacheValue,
  isTimeToLiveExpired,
  parseOptions,
  shouldInvokePromise,
};

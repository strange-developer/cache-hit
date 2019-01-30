export function calculateExpiry(timeToLive) {
  if (timeToLive === Number.POSITIVE_INFINITY) {
    return Number.POSITIVE_INFINITY;
  }
  return new Date().getTime() + timeToLive;
}

export function hasCacheValue(cache, key) {
  return cache[key] !== undefined && cache[key].isSuccessful !== true;
}

export function isTimeToLiveExpired(expiryTime) {
  if (new Date().getTime() > expiryTime) {
    return true;
  }
  return false;
}

export function shouldMakeApiCall(cache, key, expiryTime) {
  const containsCacheValue = hasCacheValue(cache, key);
  const isExpiryReached = isTimeToLiveExpired(expiryTime);

  if (containsCacheValue && isExpiryReached) {
    return true;
  }

  return false;
}

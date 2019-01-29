export function calculateExpiry(timeToLive) {
  if (timeToLive === Number.POSITIVE_INFINITY) {
    return Number.POSITIVE_INFINITY;
  }
  return new Date().getTime() + timeToLive;
}

function hasCacheValue(cache, key) {
  return Object.keys(cache).length === 0 && Object.keys(cache[key]).length === 0;
}

function didResponsePreviouslyFail(cache, key) {
  if (cache[key] && !cache[key].isSuccessful) {
    return true;
  }
  return false;
}

function isTimeToLiveExpired(timeToLive) {
  if (new Date().getTime() > timeToLive) {
    return true;
  }
  return false;
}

function isInfiniteCache(timeToLive) {
  return timeToLive === Number.POSITIVE_INFINITY;
}

export function shouldMakeApiCall(cache, key, timeToLive) {
  if (isInfiniteCache(timeToLive) && didResponsePreviouslyFail(cache, key)) {
    return true;
  }

  if (!isInfiniteCache(timeToLive) && !hasCacheValue(cache, key)) {
    return true;
  }

  if (isTimeToLiveExpired()) {
    return true;
  }

  return false;
}

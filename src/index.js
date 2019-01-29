function createCache(apiCall, options) {
  let cache = {};

  function calculateExpiry(timeToLive) {
    if (timeToLive === Number.POSITIVE_INFINITY) {
      return Number.POSITIVE_INFINITY;
    }
    return new Date().getTime() + timeToLive;
  }

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

  function shouldMakeApiCall() {
    if (
      internalOptions.timeToLive !== Number.POSITIVE_INFINITY
      && (Object.keys(cache).length === 0 || new Date().getTime() > internalOptions.timeToLive)
    ) {
      return true;
    }
    return false;
  }

  async function read(...parameters) {
    let response = cache;
    if (shouldMakeApiCall(cache)) {
      response = await makeCall(parameters);
      cache = response;
      internalOptions.timeToLive = calculateExpiry(options.timeToLive);
    }
    return response;
  }

  return { read };
}

export default createCache;

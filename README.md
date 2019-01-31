# cache-hit

Promise caching library for any type of data that can fit into a JavaScript object.

API

createCache(promiseReturningFunction: () => {}, options): () => {}

Parameters
promiseReturningFunction
A function that when called, will start a promise. The promise is invoked from within the library.

options
Options specified by the library. Currently, only `timeToLive` is supported.

Return Value
Returns an object containing a `read` function.

read(key: string, ...parameters: [])

Parameters
key
Data returned will be stored in the cache based on a key. Whenever reads occur, the cache will first be checked for a _valid_ cache value and return the cached value or in the case of an _invalid_ cache, the promise will be invoked and data will be stored in the cache depending on your `timeToLive` option.

parameters
Parameters that can be passed into the read function which will then be passed into the promise returning function.

Example
```
// get-accounts.js
import createCache from 'cache-hit';

const getAccountsApi = (username, sessionId) => fetch(`/accounts/${username}`, { headers: { sessionId });

const getAccountsApiCached = createCache(getAccountsApi, { timeToLive: 15000 }); // timeToLive in milliseconds

export default getAccountsApiCached;
```

```
// accounts.js
import getAccountsApiCached from './get-accounts';

const getAccounts = (username, sessionId) => {
  const key = username; // unique key for this cache instance
  return getAccountsApi
          .read(key, username, sessionId)
          .then((response) => dispatch(someAction(response)))
          .catch((error) => dispatch(someErrorAction(error)));
};
```

Errors
All errors will need to be handled after calling the `read` method.

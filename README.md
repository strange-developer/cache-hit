# cache-hit

JavaScript promise caching library

## Types

### options

|Option          |Required|Description                                                     |Default value                |
|----------------|--------|----------------------------------------------------------------|-----------------------------|
|timeToLive      |  No    | An integer value that the cache is valid for in milliseconds   |`Number.POSITIVE_INFINITY`   |

#### Omitting `timeToLive` Option
This will result in an infinite cache. Once a successful response is received, the promise will never be invoked a second time.

### Cache

```ts
interface Cache {
  read: () => Promise
}
```

## API

### createCache(promiseReturningFunction: () => Promise, options): Cache

**PARAMETERS**

**promiseReturningFunction**

A function that when called, will return a promise. The `promiseReturningFunction` is invoked from within the library.

**options**

Object of options. Supported options are listed in the Types section.

**Return Value**

Returns a `Cache` type.

### Cache.read({ key: string, forceRead: Boolean }, ...promiseParameters: any): Promise

**PARAMETERS**

**key**

Data returned will be stored in the cache based on a key. Whenever reads occur, the cache will first be checked for a _valid_ cache value and return the cached value or in the case of an _invalid_ cache, the promise will be invoked and data will be stored in the cache depending on your `timeToLive` option.

**forceRead**

Defaulted to false. If this is set to true, the promise will be invoked regardless of the caching policy.

**promiseParameters**

Parameters that will be spread into the `promiseReturningFunction`. An example of calling this function exists below.
```js
getAccountsApiCached.read({ key: 'some-key' }, param1, param2);
```

### Example
```js
// get-accounts.js
import createCache from 'cache-hit';

const getAccountsApi = (username, sessionId) => fetch(`/accounts/${username}`, { headers: { sessionId });

const getAccountsApiCached = createCache(getAccountsApi, { timeToLive: 15000 }); // timeToLive in milliseconds

export default getAccountsApiCached;
```

```js
// accounts.js
import getAccountsApiCached from './get-accounts';

const getAccounts = (username, sessionId) => {
  const key = username; // unique key for this cache instance
  return getAccountsApi
          .read({ key: key, forceInvoke: false }, username, sessionId)
          .then((response) => dispatch(someAction(response)))
          .catch((error) => dispatch(someErrorAction(error)));
};
```

## Errors
All errors will need to be handled after calling the `read` method. The cache will not be updated on any rejected promises.

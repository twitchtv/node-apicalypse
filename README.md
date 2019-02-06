# Node Apicalypse Client
[![npm version](https://img.shields.io/npm/v/apicalypse.svg?style=flat-square)](https://www.npmjs.org/package/apicalypse)
[![npm downloads](https://img.shields.io/npm/dt/apicalypse.svg?style=flat-square)](https://www.npmjs.org/package/apicalypse)

A simple client for creating Apicalypse queries.

## Installation
Using npm
```bash
$ npm install --save apicalypse
```

## Usage

### Raw Apicalypse

```js
import apicalypse from 'apicalypse';

const rawQueryString = 'fields a,b,c;limit 50;offset 0;';

// async/await
try {
    const response = await apicalypse(rawQueryString)
        .request('https://myapi.com/actors/nm0000216');

    // This is an axios response: https://github.com/axios/axios#response-schema
    console.log(response.data); 
} catch (err) {
    console.error(err);
}

// Promises
apicalypse(rawQueryString)
    .request('https://myapi.com/actors/nm0000216')
    .then(response => {
        console.log(response.data);
    })
    .catch(err => {
        console.error(err);
    });
```

### Apicalypse Query Builder

```js
const response = await apicalypse({
    // Optional: By default, the apicalypse query is put in the request body.
    // Use 'url' to put the query in the request URL.
    queryMethod: 'body'
})
    .fields(['name', 'movies', 'age']) // fetches only the name, movies, and age fields
    .fields('name,movies,age') // same as above

    .limit(50) // limit to 50 results
    .offset(10) // offset results by 10

    .sort('name') // default sort direction is 'asc' (ascending)
    .sort('name', 'desc') // sorts by name, descending
    .search('Arnold') // search for a specific name (search implementations can vary)
    
    .where('age > 50 & movies != n') // filter the results
    .where(['age > 50', 'movies != n']) // same as above

    .request('https://myapi.com/actors'); // execute the query and return a response object

console.log(response.data);
```

### Apicalypse in the URL instead of request body

By default, the apicalypse query is put in the request body. If your server doesn't support GET bodies, you can put the request in the URL instead.

```js
const response = await apicalypse(rawQueryString, {
    queryMethod: 'url'
})
    .request('https://myapi.com/actors/nm0000216');

console.log(response.data);
```

### Base Url, Timeouts, Custom headers, Authentication

The configuration object passed to the apicalypse client extends the default axios settings. [You can check out more here](https://github.com/axios/axios#request-config).

### Advanced example

```js
const requestOptions = {
    queryMethod: 'url',
    method: 'post', // The default is `get`
    baseURL: 'https://myapi.com',
    headers: {
        'Accept': 'application/json'
    },
    responseType: 'json',
    timeout: 1000, // 1 second timeout
    auth: { // Basic auth
        username: 'janedoe',
        password: 's00pers3cret'
    }
};

const response = await apicalypse(requestOptions)
    .fields('name,movies,age')
    .limit(50)    
    .query('age > 50 & movies != n')
    // After setting the baseURL in the requestOptions,
    // you can just use an endpoint in the request
    .request('/actors'); 

console.log(response.data);
```

### Request all

```js
// Request all pages until results are depleted
const data = await apicalypse()
    .limit(50)
    .requestAll('https://myapi.com/actors/nm0000216', {
        concurrency: 2, // number of threads requesting in parallel
        delay: 100 // delay between each request (when only one thread)
    });
// Note that `data` will be the combined data and not an axios response object.
```

### Multi-Query

```js
// Merge queries together into a single request
const now = Date.now();
const response = await apicalypse(requestOptions)
    .multi([
        apicalypse()
            .query('games', 'latest-games')
            .fields('name')
            .where(`created_at < ${now}`)
            .sort('created_at desc'),
        apicalypse()
            .query('games', 'coming-soon')
            .fields('name')
            .where(`created_at > ${now}`)
            .sort('created_at asc')
    ])
    .request('/multiquery');
```

## License

MIT

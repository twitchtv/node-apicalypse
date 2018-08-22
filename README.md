# Node Apicalypse Client

A simple client for creating Apicalypse queries.

## Installation

`npm install --save apicalypse`

`import apicalypse from 'apicalypse';`

## Usage

### Raw Apicalypse

```javascript
import apicalypse from 'apicalypse';

const rawQueryString = "fields a,b,c;limit 50;offset 0;";
// async/await
(async () => {
    try {
        const response = await apicalypse(rawQueryString)
            .request("https://myapi.com/actors/nm0000216");
        console.log(response.data); // This is an axios response: https://github.com/axios/axios#response-schema
    } catch (err) {
        console.error(err);
    }
})();

// Promises
apicalypse(rawQueryString)
    .request("https://myapi.com/actors/nm0000216")
    .then(response => {
        console.log(response.data);
    })
    .catch(err => {
        console.error(err);
    });
```

### Apicalypse Query Builder

```javascript
const response = await apicalypse({
    queryMethod: "body" // Optional: By default, the apicalypse query is put in the request body. Use 'url' to put the query in the request URL.
})
    .fields(["name", "movies", "age"]) // fetches only the name and movies fields
    .fields("name,movies,age") // same as above

    .limit(50) // limit to 50 results
    .offset(10) // offset results by 10

    .order("name") // default sort direction is 'asc' (ascending)
    .order("name", "desc") // sorts by name, descending
    .search("Arnold") // search for a specific name (search implementations can vary)
    
    .query("age > 50 & movies != n") // filter the results
    .query(["age > 50", "movies != n"]) // same as above
    .request("https://myapi.com/actors"); // execute the query and return a response object

console.log(response.data);
```

### Apicalypse in the URL instead of request body

By default, the apicalypse query is put in the request body. If your server doesn't support GET bodies, you can put the request in the URL instead.

```javascript
const response = await apicalypse(rawQueryString, {
    queryMethod: "url"
})
    .request("https://myapi.com/actors/nm0000216");
console.log(response.data);
```

### Base Url, Timeouts, Custom headers, Authentication

The configuration object passed to the apicalypse client extends the default axios settings. [You can check out more here](https://github.com/axios/axios#request-config).

### Advanced example

```javascript
const response = await apicalypse({
    queryMethod: "url",
    method: "post", // The default is 'get' but you can set it to whatever you like.
    baseURL: "https://myapi.com",
    headers: {'Accept': 'application/json'},
    responseType: 'json',
    timeout: 1000, // 1 second timeout
    auth: { // Basic auth
        username: 'janedoe',
        password: 's00pers3cret'
    }
})
    .fields("name,movies,age")
    .limit(50)    
    .query("age > 50 & movies != n")
    .request("/actors"); // Note: after settings the baseURL, you can just use a path here

console.log(response.data);
```

## License

MIT
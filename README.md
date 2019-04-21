# @faizaanceg/pandora

A tiny wrapper over `LocalStorage` to improve DX.

## Motivation

Ever felt that `localStorage` is good but it could be _better_? This library bridges that gap and gives you a pleasant experience when working with `localStorage`.

### Benefits

- Tiny (< 500B gzipped and minified).
- Smooth use with objects.
- Expirable values (configurable with `ttl` option).

## Installation

```sh
npm install @faizaanceg/pandora --save
```

or

```sh
yarn add @faizaanceg/pandora
```

## Usage

```js
import pandora from "@faizaanceg/pandora";

// Set an item

/*
  localStorage.setItem("username", "pandora");
*/
pandora.set("username", "pandora");

// Get an item

/*
  let value = localStorage.getItem("key");
*/
let value = pandora.get("key");

// Managing default values

/*
  let defaultValue = 1;
  let count = localStorage.getItem("count") || defaultValue;
*/
let count = pandora.get("count", 1);

// Dealing with objects

/*
  let object = { someKey: "value" };
  localStorage.setItem("object", JSON.stringify(object));

  let fromStorage = JSON.parse(localStorage.getItem("object"));
  console.log(fromStorage.someKey); // value
*/
let object = { someKey: "value" };
pandora.set("object", object);

let fromStorage = pandora.get("object"); // JSON.parse happens internally
console.log(fromStorage.someKey); // value;

// Clear items

/*
  localStorage.clear()
*/
pandora.clear();

// Persist values

/*
  let value  = localStorage.getItem("key");
  localStorage.clear();
  localStorage.setItem("key", value);
*/
pandora.set("key", value, { shouldPersist: true });
pandora.clear();
pandora.get("key") === value; // true

```

For more examples, you can check out the `index.test.js` file.

## Tests

```sh
npm install
npm test
```

## Dependencies

None

## License

MIT

# @faizaanceg/pandora
<a href="https://pkg-size.dev/@faizaanceg/pandora"><img src="https://pkg-size.dev/badge/bundle/1075" title="Bundle size for @faizaanceg/pandora"></a>

A tiny wrapper over `Storage` to improve DX.

## Motivation

Ever felt that `localStorage` is good but it could be _better_? This library bridges that gap and gives you a pleasant experience when working with `localStorage`.

### Benefits

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
import KV from "@faizaanceg/pandora";
import { KeyValueStore } from "@faizaanceg/pandora/kv";

// Can also work with any object that implements `Storage`.

const sessionKV = new KeyValueStore(sessionStorage);
sessionKV.set("ui-preference", "dark");
let uiPreference = sessionKV.get("ui-preference") // "dark"

// Set an item

/*
  localStorage.setItem("username", "pandora");
*/
KV.set("username", "pandora");

// Get an item

/*
  let value = localStorage.getItem("key");
*/
let value = KV.get("key");

// Managing default values

/*
  let defaultValue = 1;
  let count = localStorage.getItem("count") || defaultValue;
*/
let count = KV.get("count", 1);

// Dealing with objects

/*
  let object = { someKey: "value" };
  localStorage.setItem("object", JSON.stringify(object));

  let fromStorage = JSON.parse(localStorage.getItem("object"));
  console.log(fromStorage.someKey); // value
*/
let object = { someKey: "value" };
KV.set("object", object);

let fromStorage = KV.get("object"); // JSON.parse happens internally
console.log(fromStorage.someKey); // value;

// Clear items

/*
  localStorage.clear()
*/
KV.clear();

// Persist values

/*
  let value  = localStorage.getItem("key");
  localStorage.clear();
  localStorage.setItem("key", value);
*/
KV.set("key", value, { shouldPersist: true });
KV.clear();
KV.get("key") === value; // true

```

For more examples, you can check out the `test.mjs` file.

## Tests

```sh
npm install
npm test
```

## Dependencies

None

## License

MIT

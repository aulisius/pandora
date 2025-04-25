# @faizaanceg/pandora
<a href="https://pkg-size.dev/@faizaanceg/pandora"><img src="https://pkg-size.dev/badge/bundle/1384" title="Bundle size for @faizaanceg/pandora"></a>

A tiny, type-friendly wrapper over `Storage` with support for default values, TTL, subscriptions, and persistence.

## Features

- Smooth use with objects
- Expirable values via TTL
- Subscriptions for reactive updates
- Selective persistence
- Zero dependencies

## Installation

```sh
npm install @faizaanceg/pandora
# or
yarn add @faizaanceg/pandora
```

## Quick Start

```ts
import { KeyValueStore } from "@faizaanceg/pandora/kv";

const store = new KeyValueStore(localStorage);

// Store and retrieve values
store.set("theme", "dark");
store.get("theme"); // "dark"

// Use default values
store.get("missing", "fallback"); // "fallback"

// Store objects (automatically serialized)
store.set("user", { name: "Alice" });
store.get("user"); // { name: "Alice" }

// Set with TTL (expires in ms)
store.set("otp", 123456, { ttl: 1000 });

// Set with persistence (survives non-forced clears)
store.set("token", "abc123", { shouldPersist: true });
store.clear(); // token survives
store.clear(true); // token removed
```

## Subscriptions

Subscribe to changes on specific keys:

```ts
const unsubscribe = store.subscribe("my-key", () => {
  console.log("Value changed to:", store.get("my-key"));
});

store.set("my-key", { name: "Bob" }); // triggers the callback
unsubscribe(); // stops listening
```

- Multiple listeners per key supported
- Each `subscribe()` call returns a cleanup function

## 🧹 Other APIs

```ts
store.remove("key");         // Remove a key
store.clear(force?: boolean); // Clear all keys (forced or only non-persistent)
store.getSnapshot();         // Returns all stored key-value pairs
```

## Also Available

A default export for simple usage:

```ts
import KV from "@faizaanceg/pandora"; // This uses localStorage

KV.set("username", "pandora");
KV.get("username"); // "pandora"
```

## Running Tests

```sh
npm install
npm test
```

## License

MIT

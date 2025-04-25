// @ts-check
import { KeyValueStore } from "@faizaanceg/pandora/kv";
import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";

/**
 * @implements {Storage}
 */
class StubStorage {
  data = {};
  get length() {
    return Object.keys(this.data).length;
  }
  clear() {
    this.data = {};
  }
  getItem(key) {
    return this.data[key] ?? null;
  }
  key(index) {
    return Object.keys(this.data).at(index) ?? null;
  }
  removeItem(key) {
    delete this.data[key];
  }
  setItem(key, value) {
    this.data[key] = value;
  }
}

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms)).catch((e) => e);

const localStorageStub = new StubStorage();
const storage = new KeyValueStore(localStorageStub);

describe("KeyValueStore", () => {
  beforeEach(() => localStorageStub.clear());

  it("respects default values", () => {
    assert.equal(storage.get("key"), null);
    assert.equal(storage.get("key", "value"), "value");
  });

  it("stores a number", () => {
    storage.set("test", 1);
    assert.equal(storage.get("test"), 1);
  });

  it("stores a string", () => {
    storage.set("test", "value");
    assert.equal(storage.get("test"), "value");
  });

  it("stores an object", () => {
    storage.set("test", { key: "value" });
    assert.deepStrictEqual(storage.get("test"), { key: "value" });
  });

  it("stores null", () => {
    storage.set("test", null);
    assert.equal(storage.get("test"), null);
  });

  it("stores items", () => {
    storage.set("name", "user");
    storage.set("otp", 123456);

    assert.equal(storage.get("name"), "user");
    assert.equal(storage.get("otp"), 123456);
  });

  it("removes item", () => {
    storage.set("name", "user");
    assert.equal(storage.get("name"), "user");

    storage.remove("name");
    assert.equal(storage.get("name"), null);
  });

  it("clears items", () => {
    storage.set("name", "user");
    storage.set("password", "qwedsa");

    assert.equal(localStorageStub.length, 2);

    let clearedValues = storage.clear(true);
    assert.deepStrictEqual(clearedValues, { name: "user", password: "qwedsa" });
    assert.equal(localStorageStub.length, 0);
  });

  it("persists item", () => {
    storage.set("name", "user", { shouldPersist: true });
    storage.set("password", "qwedsa");

    let clearedValues = storage.clear();
    assert.deepStrictEqual(clearedValues, { password: "qwedsa" });
    assert.equal(localStorageStub.length, 1);
  });

  it("clears all items on force", () => {
    storage.set("name", "user", { shouldPersist: true });
    storage.set("password", "qwedsa");

    let clearedValues = storage.clear(true);
    assert.deepStrictEqual(clearedValues, { name: "user", password: "qwedsa" });
    assert.equal(localStorageStub.length, 0);
  });

  it("respects ttl", async () => {
    storage.set("otp", 123456, { ttl: 1000 });
    await wait(1000 * 1.1);
    assert.equal(storage.get("otp"), null);
  });

  it("gives snapshot", () => {
    storage.set("key", "value");
    assert.deepStrictEqual(storage.getSnapshot(), { key: "value" });
  });
});

describe("Subscriptions", () => {
  beforeEach(() => storage.clear());

  it("can register signal to a particular key", (it) => {
    const signal = it.mock.fn();
    storage.subscribe("my-key", signal);
    storage.set("my-key", "hello");
    assert.equal(signal.mock.callCount(), 1);
  });

  it("can be removed with cleanup function", (it) => {
    const signal = it.mock.fn();
    const cleanup = storage.subscribe("my-key", signal);
    storage.set("my-key", "hello");
    assert.equal(signal.mock.callCount(), 1);
    cleanup();
    storage.set("my-key", "world");
    assert.equal(signal.mock.callCount(), 1);
  });

  it("can store multiple signals for a key", (it) => {
    const signal = it.mock.fn();
    storage.subscribe("my-key", signal);
    storage.subscribe("my-key", signal);
    storage.set("my-key", "hello");
    assert.equal(signal.mock.callCount(), 2);
  });

  it("can cleanup individual signals for a key", (it) => {
    const signal1 = it.mock.fn();
    const cleanup1 = storage.subscribe("my-key", signal1);
    const signal2 = it.mock.fn();
    storage.subscribe("my-key", signal2);
    storage.set("my-key", "hello");
    assert.equal(signal1.mock.callCount(), 1);
    assert.equal(signal2.mock.callCount(), 1);
    cleanup1();
    storage.set("my-key", "world");
    assert.equal(signal1.mock.callCount(), 1);
    assert.equal(signal2.mock.callCount(), 2);
  });
});

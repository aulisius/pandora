import storage from "./index";

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms)).catch((e) => e);

describe("Storage wrapper", () => {
  beforeEach(() => localStorage.clear());

  it("respects default values", () => {
    expect(storage.get("key")).toEqual(null);
    expect(storage.get("key", "value")).toEqual("value");
  });

  it("stores a number", () => {
    storage.set("test", 1);
    expect(storage.get("test")).toEqual(1);
  });

  it("stores a string", () => {
    storage.set("test", "value");
    expect(storage.get("test")).toEqual("value");
  });

  it("stores an object", () => {
    storage.set("test", { key: "value" });
    expect(storage.get("test")).toMatchObject({ key: "value" });
  });

  it("stores null", () => {
    storage.set("test", null);
    expect(storage.get("test")).toBeNull();
  });

  it("stores items", () => {
    storage.set("name", "user");
    storage.set("otp", 123456);

    expect(storage.get("name")).toEqual("user");
    expect(storage.get("otp")).toEqual(123456);
  });

  it("removes item", () => {
    storage.set("name", "user");
    expect(storage.get("name")).toEqual("user");

    storage.remove("name");
    expect(storage.get("name")).toBeNull();
  });

  it("clears items", () => {
    storage.set("name", "user");
    storage.set("password", "qwedsa");

    expect(localStorage).toHaveLength(2);

    let clearedValues = storage.clear(true);
    expect(clearedValues).toMatchObject({ name: "user", password: "qwedsa" });
    expect(localStorage).toHaveLength(0);
  });

  it("persists item", () => {
    storage.set("name", "user", { shouldPersist: true });
    storage.set("password", "qwedsa");

    let clearedValues = storage.clear();
    expect(clearedValues).toMatchObject({ password: "qwedsa" });
    expect(localStorage).toHaveLength(1);
  });

  it("clears all items on force", () => {
    storage.set("name", "user", { shouldPersist: true });
    storage.set("password", "qwedsa");

    let clearedValues = storage.clear(true);
    expect(clearedValues).toMatchObject({ name: "user", password: "qwedsa" });
    expect(localStorage).toHaveLength(0);
  });

  it("respects ttl", async () => {
    storage.set("otp", 123456, { ttl: 1000 });
    await wait(1000 * 1.1);
    expect(storage.get("otp")).toEqual(null);
  });

  it("gives snapshot", () => {
    storage.set("key", "value");
    expect(storage.getSnapshot()).toEqual({ key: "value" });
  });
});

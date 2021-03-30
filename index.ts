interface Options {
  ttl?: number;
  shouldPersist?: boolean;
}

let defaults: Options = { ttl: Number.MAX_SAFE_INTEGER, shouldPersist: false };

function set<T = unknown>(key: string, value: T, opts: Options = {}) {
  localStorage.setItem(
    key,
    JSON.stringify({ createdOn: Date.now(), value, ...defaults, ...opts })
  );
}

type Internal<T> = Options & { value: T };

function getInternal<R = unknown>(key: string): void | Internal<R> {
  try {
    let item = JSON.parse(localStorage.getItem(key));
    let isExpired = Date.now() >= item.createdOn + item.ttl;
    return isExpired ? remove(key) : item;
  } catch (error) {
    return null;
  }
}

function get<T = unknown>(key: string, defaultValue: T = null): T {
  let item = getInternal<T>(key);
  return item ? item.value : defaultValue;
}

function remove(key: string) {
  localStorage.removeItem(key);
}

function forEach(cb: (key: string, value: Internal<any>) => void) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    let item = getInternal(key);
    if (item) {
      cb(key, item);
    }
  }
}

function clear(removeAll = false): Record<string, any> {
  if (removeAll) {
    let perishedItems = getSnapshot();
    localStorage.clear();
    return perishedItems;
  }

  let keysToDelete = [];
  let perishedItems = {};
  forEach((key, item) => {
    if (!item.shouldPersist) {
      keysToDelete.push(key);
      perishedItems = { ...perishedItems, [key]: item.value };
    }
  });
  keysToDelete.forEach(remove);
  return perishedItems;
}

function getSnapshot(): Record<string, any> {
  let items = {};
  forEach((key, item) => {
    items = { ...items, [key]: item.value };
  });
  return items;
}

export default { set, get, remove, clear, getSnapshot };

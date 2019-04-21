// @ts-check
let defaults = { ttl: Number.MAX_SAFE_INTEGER, shouldPersist: false };

function set(key, value, opts = {}) {
  localStorage.setItem(
    key,
    JSON.stringify({ createdOn: Date.now(), value, ...defaults, ...opts })
  );
}

function getInternal(key) {
  try {
    let item = JSON.parse(localStorage.getItem(key));
    let isExpired = Date.now() >= item.createdOn + item.ttl;
    return isExpired ? remove(key) : item;
  } catch (error) {
    return null;
  }
}

function get(key, defaultValue = null) {
  let item = getInternal(key);
  return item ? item.value : defaultValue;
}

function remove(key) {
  localStorage.removeItem(key);
}

function forEach(cb) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    let item = getInternal(key);
    if (item) {
      cb(key, item);
    }
  }
}

function clear(removeAll = false) {
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

function getSnapshot() {
  let items = {};
  forEach((key, item) => {
    items = { ...items, [key]: item.value };
  });
  return items;
}

export default { set, get, remove, clear, getSnapshot };

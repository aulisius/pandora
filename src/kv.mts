interface Options {
  shouldPersist?: boolean;
  ttl?: number;
}

type Internal<T> = Options & { value: T };

type Signal = () => void;

export class KeyValueStore {
  static DEFAULTS: Options = {
    shouldPersist: false,
    ttl: Number.MAX_SAFE_INTEGER,
  };
  private adapter: Storage;
  private subscriptions: Map<string, Signal[]> = new Map();
  constructor(adapter: Storage) {
    this.adapter = adapter;
  }
  private getInternal<R = unknown>(key: string): void | Internal<R> {
    try {
      const internalItem = this.adapter.getItem(key);
      if (internalItem === null) {
        return;
      }
      const item = JSON.parse(internalItem);
      const isExpired = Date.now() >= item.createdOn + item.ttl;
      return isExpired ? this.remove(key) : item;
    } catch {
      return;
    }
  }
  private signal(key: string) {
    if (this.subscriptions.has(key)) {
      this.subscriptions.get(key)?.forEach((signal) => signal?.());
    }
  }
  get<T = null | unknown>(key: string, defaultValue?: T): T | null {
    const item = this.getInternal<T>(key);
    return item ? item.value : defaultValue ?? null;
  }
  set<T = unknown>(key: string, value: T, opts: Options = {}) {
    this.adapter.setItem(
      key,
      JSON.stringify({
        createdOn: Date.now(),
        value,
        ...KeyValueStore.DEFAULTS,
        ...opts,
      })
    );
    this.signal(key);
  }
  subscribe(key: string, signal: Signal) {
    let count = 0;
    let signals = [signal];
    if (this.subscriptions.has(key)) {
      signals = this.subscriptions.get(key)!;
      count = signals.push(signal);
    }
    this.subscriptions.set(key, signals);
    return () => this.removeSubscription(key, count);
  }
  private removeSubscription(key: string, count: number) {
    if (this.subscriptions.has(key)) {
      if (count === -1) {
        this.subscriptions.delete(key);
      } else {
        const signals = this.subscriptions.get(key)!;
        delete signals[count];
      }
    }
  }
  forEach(cb: (key: string, value: Internal<unknown>) => void) {
    const size = this.adapter.length;
    for (let i = 0; i < size; i++) {
      const key = this.adapter.key(i);
      if (key === null) {
        continue;
      }
      const item = this.getInternal(key);
      if (item) {
        cb(key, item);
      }
    }
  }
  remove(key: string) {
    this.adapter.removeItem(key);
    this.signal(key);
    this.removeSubscription(key, -1);
  }
  clear(removeAll = false) {
    const perishedItems: Array<[string, unknown]> = [];
    this.forEach((key, item) => {
      if (!item.shouldPersist || removeAll) {
        perishedItems.push([key, item.value]);
      }
    });
    perishedItems.forEach(([key]) => this.remove(key));
    return Object.fromEntries(perishedItems);
  }
  getSnapshot() {
    const items: Array<[string, unknown]> = [];
    this.forEach((key, item) => {
      items.push([key, item.value]);
    });
    return Object.fromEntries(items);
  }
}

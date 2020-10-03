declare interface options {
  ttl?: number;
  shouldPersist?: boolean;
}

declare interface pandora<T> {
  set<K extends keyof T>(key: K, value: T[K], opts?: options): void;

  get<K extends keyof T>(key: K, defaultValue?: T[K]): T[K];

  remove<K extends keyof T>(key: K): void;

  clear(removeAll?: boolean): T;

  getSnapshot(): T;
}

export default pandora;

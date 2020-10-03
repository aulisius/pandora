declare interface options {
  ttl?: number;
  shouldPersist?: boolean;
}

declare interface Pandora<T> {
  set<K extends keyof T>(key: K, value: T[K], opts?: options): void;

  get<K extends keyof T>(key: K, defaultValue?: T[K]): T[K];

  remove<K extends keyof T>(key: K): void;

  // Would return only keys that are removed, if there are persisent keys, they wont be returned i.e. removed
  clear(removeAll?: boolean): Partial<T>;

  // Only stored keys from the Schema are returned, so partial is used.
  getSnapshot(): Partial<T>;
}

export default Pandora;

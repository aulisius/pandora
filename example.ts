import pandora from "./index";

type sampleObject = {
  someKey: string;
};

type StorageSchema = {
  username: string;
  count: number;
  object: sampleObject;
  persistantKey: string;
};

let pandora: pandora<StorageSchema>;

// Set an item
pandora.set("username", "pandora");

// Get an item
let value = pandora.get("username");

// Managing default values
let count = pandora.get("count", 1);

// Dealing with objects
let object: sampleObject = { someKey: "value" };
pandora.set("object", object);

let fromStorage = pandora.get("object");
console.log(fromStorage.someKey); // value;

// Clear items
pandora.clear();

// Persist values
pandora.set("persistantKey", value, { shouldPersist: true });
pandora.clear();
pandora.get("persistantKey") === value; // true

//get snapshot
console.log(pandora.getSnapshot());

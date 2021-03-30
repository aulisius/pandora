import pandora from "./index";

// Set an item

/*
  localStorage.setItem("username", "pandora");
*/
pandora.set<string>("username", "pandora");

// Get an item

/*
  let value = localStorage.getItem("key");
*/
let value = pandora.get<string>("key");

// Managing default values

/*
  let defaultValue = 1;
  let count = localStorage.getItem("count") || defaultValue;
*/
let count = pandora.get<number>("count", 1);

// Dealing with objects

/*
  let object = { someKey: "value" };
  localStorage.setItem("object", JSON.stringify(object));

  let fromStorage = JSON.parse(localStorage.getItem("object"));
  console.log(fromStorage.someKey); // value
*/
let object = { someKey: "value" };
pandora.set("object", object);

let fromStorage = pandora.get<{ someKey: "string" }>("object");
console.log(fromStorage.someKey); // value;

// Clear items

/*
  localStorage.clear()
*/
pandora.clear();

// Persist values

/*
  let value  = localStorage.getItem("key");
  localStorage.clear();
  localStorage.setItem("key", value);
*/
pandora.set("key", value, { shouldPersist: true });
pandora.clear();
pandora.get("key") === value; // true

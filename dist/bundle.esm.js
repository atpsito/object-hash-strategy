import hash from 'object-hash';

const accessObjectDepp = (keys, object) => {
  let aux = object;
  for (const key of keys) {
    aux = aux[key];
  }
  return aux;
};

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const createHash = (target, schema) => {
  var _a;
  const schemaKeys = Object.entries(schema).filter((entry) => typeof entry[1] === "object").map((entry) => entry[0]);
  const content = Object.fromEntries(
    Object.entries(target).filter((entry) => !schemaKeys.includes(entry[0]))
  );
  const response = {};
  for (const [key, value] of Object.entries(schema)) {
    if (key === "id" && typeof value === "string") {
      const ids = value.split(".");
      response[key] = (_a = accessObjectDepp(ids, target)) != null ? _a : value;
    }
    if (key === "hash" && value) {
      response[key] = hash(content);
    }
    if (typeof value === "object" && value["parentHash"]) {
      response[`${key}Hash`] = hash(target[key]);
    }
    if (Array.isArray(target[key]) && typeof value === "object") {
      response[key] = target[key].map(
        (item) => createHash(item, value)
      );
    }
  }
  return response;
};
const compareHashes = (actualHash, oldHash) => {
  var _a, _b;
  let response = { id: actualHash.id, action: "none" };
  if (actualHash && !oldHash) {
    response = { action: "create", id: actualHash.id };
  }
  if ((actualHash == null ? void 0 : actualHash.hash) !== (oldHash == null ? void 0 : oldHash.hash) && typeof (oldHash == null ? void 0 : oldHash.hash) !== "undefined") {
    response = { action: "update", id: actualHash.id };
  }
  const entries = Object.entries(actualHash);
  for (const [key, value] of entries) {
    if (!Array.isArray(value))
      continue;
    const hashKey = `${key.toString()}Hash`;
    if (actualHash[hashKey] === (oldHash == null ? void 0 : oldHash[hashKey]) && typeof actualHash[hashKey] !== "undefined") {
      continue;
    }
    if (typeof response[key] === "undefined") {
      response[key] = [];
    }
    const previousIds = (_a = oldHash == null ? void 0 : oldHash[key]) == null ? void 0 : _a.map((oldItem) => oldItem.id);
    const actualIds = (_b = actualHash == null ? void 0 : actualHash[key]) == null ? void 0 : _b.map((actualItem) => actualItem.id);
    for (const previousId of previousIds != null ? previousIds : []) {
      if (actualIds == null ? void 0 : actualIds.includes(previousId))
        continue;
      response[key].push({
        action: "delete",
        id: previousId
      });
    }
    const childHashes = value == null ? void 0 : value.map((actualItemHash) => {
      var _a2;
      const previousItemHash = (_a2 = oldHash == null ? void 0 : oldHash[key]) == null ? void 0 : _a2.find(
        (oldItem) => oldItem.id === actualItemHash.id
      );
      return compareHashes(actualItemHash, previousItemHash);
    });
    response[key] = [...response[key], ...childHashes];
  }
  return response;
};
const getDataFromCompare = (data, hashResponse, schema) => {
  const schemaKeys = Object.entries(schema).filter((entry) => typeof entry[1] === "object").map((entry) => entry[0]);
  const content = Object.fromEntries(
    Object.entries(data).filter((entry) => !schemaKeys.includes(entry[0]))
  );
  const response = __spreadValues({}, hashResponse);
  if (hashResponse.action !== "none")
    response["data"] = content;
  for (const [key, value] of Object.entries(hashResponse)) {
    if (!Array.isArray(value))
      continue;
    const typedKey = key;
    const selectedSchema = schema[typedKey];
    if (!selectedSchema)
      continue;
    const newValue = value.map((item) => {
      const dataItem = data[typedKey].find(
        (dataItem2) => dataItem2[selectedSchema.id] === item.id
      );
      if (!dataItem)
        return item;
      return getDataFromCompare(dataItem, item, selectedSchema);
    });
    response[typedKey] = newValue;
  }
  return response;
};

export { compareHashes, createHash, getDataFromCompare };
//# sourceMappingURL=bundle.esm.js.map

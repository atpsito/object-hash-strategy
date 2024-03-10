import hash from "object-hash";
import { Hash, HashCompareResponse } from "../types/hash.types.ts";
import { HashResponse, HashSchema } from "../types/hash.types.ts";
import { accessObjectDepp } from "../utils/common.utils.ts";

/**
 * Creates a hash object based on the provided target and schema.
 * @param target - The target object to create a hash for.
 * @param schema - The schema object that defines the hash structure.
 * @returns The hash object.
 */
export const createHash = <T extends Record<string, any>>(
  target: T,
  schema: HashSchema<T>
) => {
  const schemaKeys = Object.entries(schema)
    .filter(entry => typeof entry[1] === "object")
    .map(entry => entry[0]);

  const content = Object.fromEntries(
    Object.entries(target).filter(entry => !schemaKeys.includes(entry[0]))
  );

  const response: any = {};
  for (const [key, value] of Object.entries(schema)) {
    if (key === "id" && typeof value === "string") {
      const ids = value.split(".");
      response[key] = accessObjectDepp(ids, target) ?? value;
    }

    if (key === "hash" && value) {
      response[key] = hash(content);
    }

    if (typeof value === "object" && value["parentHash"]) {
      response[`${key}Hash`] = hash(target[key]);
    }
    if (Array.isArray(target[key]) && typeof value === "object") {
      response[key] = target[key].map((item: object) =>
        createHash(item, value)
      );
    }
  }
  return response as Hash<HashSchema<T>>;
};

/**
 * Compares two hashes and returns a response indicating the differences.
 * @param actualHash The current hash object.
 * @param oldHash The previous hash object.
 * @returns A response object indicating the differences between the two hashes.
 */
export const compareHashes = <T extends object>(
  actualHash: Hash<T>,
  oldHash: Hash<T> | undefined | null
): HashCompareResponse<Hash<T>> => {
  let response: any = { id: actualHash.id, action: "none" };
  if (actualHash && !oldHash) {
    response = { action: "create", id: actualHash.id };
  }

  if (
    actualHash?.hash !== oldHash?.hash &&
    typeof oldHash?.hash !== "undefined"
  ) {
    response = { action: "update", id: actualHash.id };
  }
  const entries = Object.entries(actualHash) as [
    keyof Hash<T>,
    string | Array<Hash<T>>
  ][];
  for (const [key, value] of entries) {
    if (!Array.isArray(value)) continue;
    const hashKey = `${key.toString()}Hash` as keyof Hash<T>;
    if (
      actualHash[hashKey] === oldHash?.[hashKey] &&
      typeof actualHash[hashKey] !== "undefined"
    ) {
      continue;
    }
    if (typeof response[key] === "undefined") {
      response[key] = [];
    }

    const previousIds = oldHash?.[key]?.map(oldItem => oldItem.id);
    const actualIds = actualHash?.[key]?.map(actualItem => actualItem.id);

    for (const previousId of previousIds ?? []) {
      if (actualIds?.includes(previousId)) continue;
      response[key].push({
        action: "delete",
        id: previousId
      });
    }

    const childHashes = value?.map(actualItemHash => {
      const previousItemHash = (oldHash?.[key] as Hash<T>[])?.find(
        oldItem => oldItem.id === actualItemHash.id
      );
      return compareHashes(actualItemHash, previousItemHash);
    });

    response[key] = [...response[key], ...childHashes];
  }
  return response;
};

/**
 * Retrieves data from the compare operation based on the provided schema.
 * @template T - The type of the data object.
 * @param {T} data - The data object.
 * @param {HashCompareResponse<Hash<HashSchema<T>>>} hashResponse - The hash compare response.
 * @param {HashSchema<T>} schema - The schema object.
 * @returns {HashResponse<Hash<HashSchema<T>>>} - The response object containing the data based on the schema.
 */
export const getDataFromCompare = <T extends Record<string, any>>(
  data: T,
  hashResponse: HashCompareResponse<Hash<HashSchema<T>>>,
  schema: HashSchema<T>
) => {
  const schemaKeys = Object.entries(schema)
    .filter(entry => typeof entry[1] === "object")
    .map(entry => entry[0]);

  const content = Object.fromEntries(
    Object.entries(data).filter(entry => !schemaKeys.includes(entry[0]))
  );
  const response: any = { ...hashResponse };

  if (hashResponse.action !== "none") response["data"] = content;
  for (const [key, value] of Object.entries(hashResponse)) {
    if (!Array.isArray(value)) continue;
    const typedKey = key as keyof HashSchema<T>;
    const selectedSchema = schema[typedKey];
    if (!selectedSchema) continue;
    const newValue = value.map(item => {
      const dataItem = data[typedKey].find(
        (dataItem: any) => dataItem[selectedSchema.id] === item.id
      );
      if (!dataItem) return item;
      return getDataFromCompare(dataItem, item, selectedSchema);
    });
    response[typedKey] = newValue;
  }
  return response as HashResponse<Hash<HashSchema<T>>>;
};

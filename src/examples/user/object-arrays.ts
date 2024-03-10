import data from "./data/test-data.json";
import data2 from "./data/test-data-changed.json";

import { createHash, compareHashes } from "../../functions/hash";
import { getDataFromCompare } from "../../functions/hash";
import { HashSchema } from "../../types/hash.types";

const schema: HashSchema<typeof data> = {
  hash: true,
  id: "id",
  friends: {
    hash: true,
    id: "id",
    parentHash: true,
    phone: {
      hash: true,
      id: "id"
    }
  }
};

const objectHash = createHash(data, schema);
const objectHash2 = createHash(data2, schema);

const compare = compareHashes(objectHash, objectHash2);

const response = getDataFromCompare(data2, compare, schema);

console.dir(response, { depth: null });

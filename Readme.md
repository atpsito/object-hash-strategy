## A Complete Guide to the Hash Comparison Library

**Introduction:**

This library simplifies comparing hashes of complex objects, even those with nested structures. It allows you to:

* Detect changes in specific properties.
* Identify modifications to elements within arrays.
* Track changes precisely.

**Installation:**

```bash
npm install [library-name]
```

or

```bash
yarn add [library-name]
```

**Key Functions:**

**1. Hash Creation:**

- The `createHash(target, schema)` function generates a hash from an object and a schema defining which properties are included.
- The schema specifies whether a property should be hashed and can define sub-schemas for nested objects.

**Example:**

```javascript
import { createHash, HashSchema } from "[library-name]";

const schema: HashSchema<typeof data> = {
  hash: true,
  id: "id",
  address: {
    hash: true,
    city: {
      hash: true
    }
  }
};

const data = { id: 1, address: { city: "New York" } };
const hash = createHash(data, schema);

console.log(hash); // { id: "1", hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" }
```

**2. Hash Comparison:**

- The `compareHashes(actualHash, oldHash)` function compares two hashes and returns an object describing the differences.
- This object indicates changes in properties, additions/removals in arrays, and modifications in nested objects.

**Example:**

```javascript
const oldHash = { ...hash };
data.address.city = "London";
const newHash = createHash(data, schema);

const compareResponse = compareHashes(newHash, oldHash);

console.log(compareResponse); // { id: "1", address: { city: { action: "update" } } }
```

**3. Extracting Data from Comparison:**

- The `getDataFromCompare(data, compareResponse, schema)` function retrieves specific information based on the comparison and schema.
- This is useful for getting only the changed data or data relevant to specific use cases.

**Example:**

```javascript
const dataResponse = getDataFromCompare(data, compareResponse, schema);

console.log(dataResponse); // { id: "1", address: { city: "London" } }
```

**Beyond the Basics:**

* **Array Handling:** The library handles array hashes, detecting changes in order, element addition/removal, and element modifications.
* **Complex Type Support:** The library supports diverse data types like dates, custom objects, and functions.
* **Framework Integration:** Easy integration with popular frameworks like React, Angular, and Vue.js.

**Use Cases:**

* Data integrity verification
* Configuration change detection
* Document change tracking
* Data synchronization between devices

**Additional Resources:**

* Library repository: [Link to library repository, replace with actual URL]
* API documentation: [Link to API documentation, replace with actual URL]
* Usage examples: [Link to usage examples, replace with actual URL]

**Contributing:**

We encourage contributions to the library. You can report bugs, submit pull requests with new features or fixes, or join discussions in the repository.

**We hope this guide equips you with the knowledge to utilize the library effectively in your projects!**
type TransformArrayToSchema<T extends Record<string, any>> = {
    [K in keyof T]?: T[K] extends Array<Record<string, any>> ? HashSchema<T[K][number]> : undefined;
};
type SchemaArrayKeys<T extends Record<string, any>> = {
    [K in keyof T]: NonNullable<T[K]> extends Array<Record<string, any>> ? K : never;
};
type HashSchema<T extends Record<string, any>> = {
    hash: boolean;
    id: keyof T;
    parentHash?: boolean;
} & TransformArrayToSchema<Pick<T, SchemaArrayKeys<T>[keyof SchemaArrayKeys<T>]>>;
type TransformSchemaToSchemaArray<T extends Record<string, any>> = {
    [K in keyof T]?: Hash<NonNullable<T[K]>>[];
};
type MapHashFields<T extends Record<string, any>> = {
    [K in keyof T as `${K & string}Hash`]?: string;
};
type ObjectSchemaKeys<T extends Record<string, any>> = {
    [K in keyof T]: T[K] extends object | undefined ? K : never;
};
type Hash<T extends Record<string, any>> = {
    id: string;
    hash: string;
} & TransformSchemaToSchemaArray<Pick<T, ObjectSchemaKeys<T>[NonNullable<keyof ObjectSchemaKeys<T>>]>> & MapHashFields<Pick<T, ObjectSchemaKeys<T>[NonNullable<keyof ObjectSchemaKeys<T>>]>>;
type TransformToHashResponse<T extends Record<string, any>> = {
    [K in keyof T]: HashCompareResponse<NonNullable<T[K]>>[];
};
type HashCompareResponse<T extends Record<string, any>> = {
    id: string;
    action: "create" | "update" | "delete" | "none";
} & TransformToHashResponse<Pick<T, SchemaArrayKeys<T>[NonNullable<keyof SchemaArrayKeys<T>>]>>;
type HashResponse<T extends Record<string, any> = object, D = Record<string, any>> = {
    id: string;
    action: "create" | "update" | "delete" | "none";
    data?: D;
} & TransformToHashResponse<Pick<T, SchemaArrayKeys<T>[NonNullable<keyof SchemaArrayKeys<T>>]>>;

/**
 * Creates a hash object based on the provided target and schema.
 * @param target - The target object to create a hash for.
 * @param schema - The schema object that defines the hash structure.
 * @returns The hash object.
 */
declare const createHash: <T extends Record<string, any>>(target: T, schema: HashSchema<T>) => Hash<HashSchema<T>>;
/**
 * Compares two hashes and returns a response indicating the differences.
 * @param actualHash The current hash object.
 * @param oldHash The previous hash object.
 * @returns A response object indicating the differences between the two hashes.
 */
declare const compareHashes: <T extends object>(actualHash: Hash<T>, oldHash: Hash<T> | null | undefined) => HashCompareResponse<Hash<T>>;
/**
 * Retrieves data from the compare operation based on the provided schema.
 * @template T - The type of the data object.
 * @param {T} data - The data object.
 * @param {HashCompareResponse<Hash<HashSchema<T>>>} hashResponse - The hash compare response.
 * @param {HashSchema<T>} schema - The schema object.
 * @returns {HashResponse<Hash<HashSchema<T>>>} - The response object containing the data based on the schema.
 */
declare const getDataFromCompare: <T extends Record<string, any>>(data: T, hashResponse: HashCompareResponse<Hash<HashSchema<T>>>, schema: HashSchema<T>) => HashResponse<Hash<HashSchema<T>>>;

export { type Hash, type HashCompareResponse, type HashResponse, type HashSchema, type MapHashFields, type ObjectSchemaKeys, type SchemaArrayKeys, type TransformArrayToSchema, type TransformSchemaToSchemaArray, type TransformToHashResponse, compareHashes, createHash, getDataFromCompare };

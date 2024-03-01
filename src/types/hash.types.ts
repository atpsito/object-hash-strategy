export type TransformArrayToSchema<T extends Record<string, any>> = {
  [K in keyof T]?: T[K] extends Array<Record<string, any>>
    ? HashSchema<T[K][number]>
    : undefined;
};

export type SchemaArrayKeys<T extends Record<string, any>> = {
  [K in keyof T]: NonNullable<T[K]> extends Array<Record<string, any>>
    ? K
    : never;
};

export type HashSchema<T extends Record<string, any>> = {
  hash: boolean;
  id: keyof T;
  parentHash?: boolean;
} & TransformArrayToSchema<
  Pick<T, SchemaArrayKeys<T>[keyof SchemaArrayKeys<T>]>
>;

// Hash Response
export type TransformSchemaToSchemaArray<T extends Record<string, any>> = {
  [K in keyof T]?: Hash<NonNullable<T[K]>>[];
};

export type MapHashFields<T extends Record<string, any>> = {
  [K in keyof T as `${K & string}Hash`]?: string;
};

export type ObjectSchemaKeys<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends object | undefined ? K : never;
};

export type Hash<T extends Record<string, any>> = {
  id: string;
  hash: string;
} & TransformSchemaToSchemaArray<
  Pick<T, ObjectSchemaKeys<T>[NonNullable<keyof ObjectSchemaKeys<T>>]>
> &
  MapHashFields<
    Pick<T, ObjectSchemaKeys<T>[NonNullable<keyof ObjectSchemaKeys<T>>]>
  >;

// Hash Compare Response
export type TransformToHashResponse<T extends Record<string, any>> = {
  [K in keyof T]: HashCompareResponse<NonNullable<T[K]>>[];
};

export type HashCompareResponse<T extends Record<string, any>> = {
  id: string;
  action: "create" | "update" | "delete" | "none";
} & TransformToHashResponse<
  Pick<T, SchemaArrayKeys<T>[NonNullable<keyof SchemaArrayKeys<T>>]>
>;

export type HashResponse<
  T extends Record<string, any> = object,
  D = Record<string, any>
> = {
  id: string;
  action: "create" | "update" | "delete" | "none";
  data?: D;
} & TransformToHashResponse<
  Pick<T, SchemaArrayKeys<T>[NonNullable<keyof SchemaArrayKeys<T>>]>
>;

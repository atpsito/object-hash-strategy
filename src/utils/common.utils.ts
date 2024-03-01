export const accessObjectDepp = (
  keys: string[],
  object: Record<string, any>
) => {
  let aux = object;
  for (const key of keys) {
    aux = aux[key];
  }
  return aux;
};

export const isObjectEmpty = (obj: object) => {
  return Object.keys(obj).length === 0;
};

export function upsert(collection: any[], item: any, by: any) {
  const i = collection.findIndex(f => f[by] === item[by]);
  if (i > -1) {
    collection[i] = item;
  } else {
    collection.push(item);
  }

  return collection;
}

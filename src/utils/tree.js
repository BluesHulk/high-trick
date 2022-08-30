export function toTree(array, id, pid) {
  const result = [];
  if (!Array.isArray(array)) {
    return result;
  }
  array.forEach(item => {
    delete item.children;
  });
  const map = {};
  array.forEach(item => {
    map[item[id]] = item;
  });
  array.forEach(item => {
    const parent = map[item[pid]];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}

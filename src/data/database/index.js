export class User {}
export class Item {}

// Mock authenticated ID
const VIEWER_ID = 'me';
let nextItemId = 1;

// Mock user data
const viewer = new User();
viewer.id = VIEWER_ID;
const usersById = {
  [VIEWER_ID]: viewer,
};

export function getUser(id) {
  return usersById[id];
}

export function getViewer() {
  return getUser(VIEWER_ID);
}

const itemsById = {};
const items = [];

export function addItem(text, category) {
  const item = new Item();
  item.id = `${nextItemId++}`;
  item.text = text;
  itemsById[item.id] = item;
  items.push(item);
  item.category = category;
  return item.id;
}

addItem('Random Item A', 'PageA');
addItem('Random Item B', 'PageB');

export function getItem(id) {
  return itemsById[id];
}

export function getItems(category = 'any') {
  if (category === 'any') {
    return items;
  }
  return items.filter(item => item.category === category);
}

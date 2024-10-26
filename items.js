export class Item {
    constructor(id, name, type, pickUpAble = true, key = null) {
      this.id = id;
      this.name = name;
      this.type = type;
      this.key = key;
      this.pickUpAble = pickUpAble;
    }
  }
  
  export const items = {
    'item1': new Item('item1', 'Iron Sword', 'weapon', true),
    'item2': new Item('item2', 'Steel Armor', 'armor', true),
    'item3': new Item('item3', 'Rusty Key', 'key', true),
    'item4': new Item('item4', 'Rusty Lock', 'lock', false, 'item3'),
    'item5': new Item('item5', 'Iron Helmet', 'armor', true)
  };

  export function getItem(itemId) {
    const item = items[itemId];
    console.log("Retrieving item:", item);
    return item;
  }
  
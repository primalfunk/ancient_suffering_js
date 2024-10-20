export class Item {
    constructor(id, name, type, pickUpAble = true) {
      this.id = id;
      this.name = name;
      this.type = type;
      this.pickUpAble = pickUpAble;
    }
  }
  
  export const items = {
    'item1': new Item('item1', 'Iron Sword', 'weapon'),
    'item2': new Item('item2', 'Steel Armor', 'armor'),
    'item3': new Item('item3', 'Rusty Key', 'key'),
    'item4': new Item('item4', 'Golden Lock', 'lock', false),
    'item5': new Item('item5', 'Iron Helmet', 'armor')
  };

  export function getItem(itemId) {
    const item = items[itemId];
    console.log("Retrieving item:", item);
    return item;
  }
  
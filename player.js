import { getRoom } from './map.js';

export class Player {
  constructor() {
    this.class = 'Adventurer';
    this.level = 1;
    this.experience = 0;
    this.hp = 20;
    this.mp = 10;
    this.str = 1;
    this.dex = 1;
    this.int = 1;
    this.wis = 1;
    this.con = 1;

    this.inventory = [];
    this.equippedItems = {};
    this.currentRoom = 'room1';
  }

  pickUpItem(item) {
    this.inventory.push(item);
    console.log(`You picked up a ${item.name}.`);
  }

  equipItem(item) {
    if (item.type === 'weapon' || item.type === 'armor') {
      this.equippedItems[item.type] = item;
      console.log(`Equipped ${item.name}.`);
    }
  }

  unequipItem(item) {
    if (this.equippedItems[item.type] === item) {
      delete this.equippedItems[item.type];
      console.log(`Unequipped ${item.name}.`);
    }
  }

  isEquipped(item) {
    return this.equippedItems[item.type] === item;
  }

  dropItem(item) {
    this.inventory = this.inventory.filter(i => i !== item);
    console.log(`You dropped ${item.name}.`);
    this.dropItemInRoom(item);  // Call the new method to drop the item in the room
  }

  dropItemInRoom(item) {
    const currentRoom = getRoom(this.currentRoom); // Get the current room
    if (!currentRoom.items) {
      currentRoom.items = []; // Ensure the room has an items array
    }
    currentRoom.items.push(item.id);  // Add the item's ID to the room's items
    console.log(`You placed ${item.name} in the room.`);
  }

  hasItemsInInventory() {
    return this.inventory.length > 0;
  }
}

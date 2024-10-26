import { getRoom } from './map.js';
import { updateLog } from './ui.js'; 

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
    updateLog(`You picked up the ${item.name}.`);
  }

  equipItem(item) {
    if (item.type === 'weapon' || item.type === 'armor') {
      this.equippedItems[item.type] = item;
      updateLog(`You equipped the ${item.name}.`);
    }
  }

  unequipItem(item) {
    if (this.equippedItems[item.type] === item) {
      delete this.equippedItems[item.type];
      updateLog(`You unequipped the ${item.name}.`);
    }
  }

  isEquipped(item) {
    return this.equippedItems[item.type] === item;
  }

  dropItem(item) {
    this.inventory = this.inventory.filter(i => i !== item);
    this.dropItemInRoom(item);
  }

  dropItemInRoom(item) {
    const currentRoom = getRoom(this.currentRoom);
    if (!currentRoom.items) {
      currentRoom.items = [];
    }
    currentRoom.items.push(item.id);
    updateLog(`You dropped ${item.name}.`);
  }

  hasItemsInInventory() {
    return this.inventory.length > 0;
  }

  changeClass(change_class) {
    this.class = change_class;
  }
}

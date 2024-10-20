export class Player {
  constructor() {
    this.class = 'Adventurer';
    this.level = 1;
    this.experience = 0;
    this.health = 100;
    this.inventory = [];
    this.currentRoom = 'room1';
  }

  pickUpItem(item) {
    this.inventory.push(item);
    console.log(`You picked up a ${item.name}.`);
  }

  changeClass(newClass) {
    this.class = newClass;
    console.log(`You have changed class to ${newClass}.`);
  }
  
  hasItemsInInventory() {
    return this.inventory.length > 0;
  }

}

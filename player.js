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

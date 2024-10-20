export class Room {
    constructor(title, description, exits) {
      this.title = title;
      this.description = description;
      this.exits = exits;  // e.g., { north: 'anotherRoom', south: null }
      this.npcs = [];
    }
  
    addNPC(npc) {
      this.npcs.push(npc);
    }
  }
  
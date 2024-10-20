export const rooms = {
  'room1': {
    title: "Starting Room",
    description: "You are in a peaceful starting room. The sunlight streams in gently, casting soft shadows across the floor. The air is calm and smells faintly of flowers.",
    exits: { south: 'room2' },
    npcs: [],
    items: []
  },
  'room2': {
    title: "Second Room",
    description: "This simple chamber connects to other parts of the world. The air here feels like a crossroads, with various paths leading in different directions.",
    exits: { north: 'room1', east: 'room3', west: 'room4', south: 'room5' },
    npcs: [],
    items: ['item1'] 
  },
  'room3': {
    title: "Alley",
    description: "You find yourself in a narrow, shadowy alley. The walls are lined with graffiti, and the occasional flicker of movement suggests you're not alone. A Shady Character looms nearby, watching your every move.",
    exits: { west: 'room2' },
    npcs: ['npc2'],
    items: []
  },
  'room4': {
    title: "Library",
    description: "You step into a grand, dusty library filled with towering shelves of ancient tomes. The scent of old paper hangs thick in the air, and a Cranky Wizard mutters to himself as he scours a particularly large book.",
    exits: { east: 'room2' },
    npcs: ['npc3'],
    items: []
  },
  'room5': {
    title: "Gym",
    description: "The Gym is a broad, open space filled with training equipment. The scent of sweat and metal hangs in the air, and the sound of clashing weapons echoes off the stone walls. The Old Trainer stands nearby, arms folded, watching potential warriors practice with a critical eye.",
    exits: { north: 'room2', east: 'room6', west: 'room7' },
    npcs: ['npc1'],
    items: ['item2']
  },
  'room6': {
    title: "Church",
    description: "The Church is a peaceful sanctuary, bathed in the warm light of stained-glass windows. The air is filled with the scent of incense, and a Smiling Priest stands near the altar, his kind eyes reflecting the serenity of this holy place.",
    exits: { west: 'room5' },
    npcs: ['npc4'],
    items: []
  },
  'room7': {
    title: "Outpost",
    description: "You arrive at a rugged outpost surrounded by towering trees and the distant sounds of nature. The smell of smoke from the campfire fills the air, and a Grizzled Veteran sits nearby, polishing his well-worn weapons. He looks like he's seen many battles and could teach a thing or two to a willing student.",
    exits: { east: 'room5' },
    npcs: ['npc5'],
    items: []
  }
};

export function getRoom(roomId) {
  const room = rooms[roomId];
  console.log("Room data:", room);
  return room;
}

let roomTemplates = null;
let outerTemplates = null;  // New outer room templates

const directions = ['north', 'south', 'east', 'west'];
const oppositeDirection = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east'
};

// Utility function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomRoomData(roomType, templateType = 'core', specificRoom = null) {
  const templates = templateType === 'outer' ? outerTemplates : roomTemplates;
  let template;
  
  // If it's an outer room, get the specific room data (like glen under forest)
  if (templateType === 'outer') {
    if (specificRoom && templates[roomType] && templates[roomType][specificRoom]) {
      template = templates[roomType][specificRoom];
    } else {
      throw new Error(`Missing or malformed template for room type "${roomType}" or specific room "${specificRoom}" in outer templates.`);
    }
  } else {
    template = templates[roomType];
  }
  
  // Randomly select a title and description
  const title = template.titles[Math.floor(Math.random() * template.titles.length)];
  const description = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];
  
  return {
    title: title,
    description: description,
    npcs: template.npcs,
    items: template.items,
    exits: {}
  };
}


function getAdjacentPositions(position) {
  const [x, y] = position.split(',').map(Number);
  return {
    north: `${x},${y - 1}`,
    south: `${x},${y + 1}`,
    east: `${x + 1},${y}`,
    west: `${x - 1},${y}`
  };
}

// Place core rooms on a grid
function placeCoreRoomsOnGrid() {
  const grid = {};
  const positions = ["0,0", "0,1", "0,2", "1,0", "1,1", "1,2", "2,1"];
  const shuffledPositions = shuffleArray(positions);
  const roomKeys = ['chapel', 'garden', 'alley', 'library', 'gym', 'church', 'outpost'];
  const rooms = {};
  
  roomKeys.forEach((roomKey, index) => {
    const position = shuffledPositions[index];
    grid[position] = `room${index + 1}`;
    rooms[`room${index + 1}`] = getRandomRoomData(roomKey);
  });

  return { rooms, grid };
}

function placeOuterRoomsOnGrid(grid, existingRooms) {
  const outerPositions = ["-1,0", "-1,1", "-1,2", "0,-1", "1,-1", "2,-1", "3,0", "3,1", "3,2"];
  const shuffledOuterPositions = shuffleArray(outerPositions);
  const outerRoomZones = ['forest', 'castle', 'temple', 'swamp', 'mountain', 'plain'];
  const specificRooms = ['glen', 'portcullis', 'altar', 'bog', 'peak', 'meadow'];  // Specific rooms within each zone
  const rooms = existingRooms;

  outerRoomZones.forEach((zoneType, index) => {
    const position = shuffledOuterPositions[index];
    grid[position] = `outerRoom${index + 1}`;
    rooms[`outerRoom${index + 1}`] = getRandomRoomData(zoneType, 'outer', specificRooms[index]);  // Pass specific room here
  });

  return { rooms, grid };
}

function generateRoomExits(rooms, grid) {
  Object.keys(grid).forEach(position => {
    const roomKey = grid[position];
    const adjPositions = getAdjacentPositions(position);

    Object.keys(adjPositions).forEach(direction => {
      const adjPosition = adjPositions[direction];
      const adjRoomKey = grid[adjPosition];
      if (adjRoomKey) {
        rooms[roomKey].exits[direction] = adjRoomKey;
        rooms[adjRoomKey].exits[oppositeDirection[direction]] = roomKey;
      }
    });
  });
}

export async function initializeMap() {
  try {
    // Load both core room templates and outer room templates
    const [coreResponse, outerResponse] = await Promise.all([
      fetch('./roomTemplates.json'),
      fetch('./outerTemplates.json')
    ]);
    roomTemplates = await coreResponse.json();
    outerTemplates = await outerResponse.json();
    console.log('Room templates loaded:', roomTemplates);
    console.log('Outer room templates loaded:', outerTemplates);

    // Place core rooms first
    const { rooms: coreRooms, grid: coreGrid } = placeCoreRoomsOnGrid();

    // Extend the map with outer rooms
    const { rooms: fullMapRooms, grid: fullGrid } = placeOuterRoomsOnGrid(coreGrid, coreRooms);

    // Generate exits for all rooms
    generateRoomExits(fullMapRooms, fullGrid);

    return fullMapRooms; // Return the complete map with core + outer rooms
  } catch (error) {
    console.error('Error loading room templates:', error);
  }
}

export let rooms = {}; // Declare an empty rooms object for now

// Initialize the rooms only after the templates are loaded
initializeMap().then(fullMapRooms => {
  rooms = fullMapRooms; // Set the rooms once they are generated
});

// Getter function for rooms
export function getRoom(roomId) {
  return rooms[roomId];
}

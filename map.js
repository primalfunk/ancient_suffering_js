let roomTemplates = null;
let outerTemplates = null;

const directions = ['north', 'south', 'east', 'west'];
const oppositeDirection = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east'
};

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
  
  if (templateType === 'outer') {
    if (specificRoom && templates[roomType] && templates[roomType][specificRoom]) {
      template = templates[roomType][specificRoom];
    } else {
      throw new Error(`Missing or malformed template for room type "${roomType}" or specific room "${specificRoom}" in outer templates.`);
    }
  } else {
    template = templates[roomType];
  }
  
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
  if (!position || typeof position !== 'string') {
    throw new Error(`Invalid position: ${position}`);
  }
  
  const [x, y] = position.split(',').map(Number);
  return {
    north: `${x},${y - 1}`,
    south: `${x},${y + 1}`,
    east: `${x + 1},${y}`,
    west: `${x - 1},${y}`
  };
}

function placeCoreRoomsOnGrid() {
  const grid = {};
  const positions = ["0,0", "0,1", "0,2", "1,0", "1,1", "1,2", "2,1"];
  const shuffledPositions = shuffleArray(positions);
  const roomKeys = ['chapel', 'garden', 'alley', 'library', 'gym', 'church', 'outpost'];
  const rooms = {};

  roomKeys.forEach((roomKey, index) => {
    const position = shuffledPositions[index];
    const roomId = `room${index + 1}`;
    grid[position] = roomId;
    rooms[roomId] = getRandomRoomData(roomKey);
  });

  return { rooms, grid };
}

function placeOuterRoomsOnGrid(grid, existingRooms) {
  const outerRoomZones = ['forest', 'castle', 'temple', 'swamp', 'mountain', 'plain'];
  const zoneClusters = {
      forest: 8,
      castle: 10,
      temple: 9,
      swamp: 12,
      mountain: 11,
      plain: 9
  };
  const rooms = existingRooms;
  let roomCounter = Object.keys(rooms).length + 1;

  outerRoomZones.forEach(zoneType => {
      const clusterSize = zoneClusters[zoneType];
      let clusterPosition = getClusterStartingPosition(grid);

      if (!clusterPosition) {
          console.warn(`No available starting positions for ${zoneType}. Skipping.`);
          return;
      }

      for (let i = 0; i < clusterSize; i++) {
          const newRoomKey = `outerRoom${roomCounter}`;
          grid[clusterPosition] = newRoomKey;
          const specificRoom = getRandomSpecificRoomForZone(zoneType);
          rooms[newRoomKey] = getRandomRoomData(zoneType, 'outer', specificRoom);

          clusterPosition = getNextClusterPosition(clusterPosition, grid);
          if (!clusterPosition) {
              console.warn(`No more available adjacent positions for ${zoneType}. Stopping cluster.`);
              break;
          }
          roomCounter++;
      }
  });

  return { rooms, grid };
}
function getClusterStartingPosition(grid) {
  const outerPositions = [
      "-4,-3", "-4,-2", "-4,-1", "-4,0", "-4,1", "-4,2", "-4,3", "-4,4",
      "-3,-3", "-3,3", "-3,4",
      "-2,-3", "-2,4", 
      "-1,4", "0,4", "1,4", "2,4", "3,3", "3,4"
  ];
  const availablePositions = outerPositions.filter(pos => !grid[pos]);

  if (availablePositions.length === 0) {
      console.warn("No available positions for cluster placement. Reducing number of rooms.");
      return null;
  }

  return shuffleArray(availablePositions)[0];
}

function getNextClusterPosition(currentPosition, grid) {
  const adjPositions = getAdjacentPositions(currentPosition);
  const availablePositions = Object.values(adjPositions).filter(pos => !grid[pos]);

  if (availablePositions.length === 0) {
      console.warn(`No available positions adjacent to ${currentPosition}. Relocating cluster.`);
      return getClusterStartingPosition(grid);
  }

  return shuffleArray(availablePositions)[0];
}

function getRandomSpecificRoomForZone(zoneType) {
  const specificRooms = {
      forest: ['glen', 'vale'],
      castle: ['portcullis', 'throne_room'],
      temple: ['altar', 'sanctum'],
      swamp: ['bog', 'marsh'],
      mountain: ['peak', 'cave'],
      plain: ['meadow', 'hill']
  };
  return shuffleArray(specificRooms[zoneType])[0];
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
    const [coreResponse, outerResponse] = await Promise.all([
      fetch('./roomTemplates.json'),
      fetch('./outerTemplates.json')
    ]);
    roomTemplates = await coreResponse.json();
    outerTemplates = await outerResponse.json();
    console.log('Room templates loaded:', roomTemplates);
    console.log('Outer room templates loaded:', outerTemplates);

    const { rooms: coreRooms, grid: coreGrid } = placeCoreRoomsOnGrid();

    const { rooms: fullMapRooms, grid: fullGrid } = placeOuterRoomsOnGrid(coreGrid, coreRooms);

    generateRoomExits(fullMapRooms, fullGrid);

    return fullMapRooms;
  } catch (error) {
    console.error('Error loading room templates:', error);
  }
}

export let rooms = {};

initializeMap().then(fullMapRooms => {
  rooms = fullMapRooms;
});

export function getRoom(roomId) {
  return rooms[roomId];
}

import { getRoom } from './map.js';
import { updateLog } from './ui.js';
import { updateRoomAndItems } from './roomManager.js'; 

  export function move(direction, player, gameState) {
    if (!gameState.isTraversal()) return;
  
    const currentRoom = getRoom(player.currentRoom);
    const newRoom = currentRoom.exits[direction];
    if (newRoom) {
      player.currentRoom = newRoom;
      updateRoomAndItems(player, gameState);
    } else {
      updateLog("You can't go that way!");
    }
  }
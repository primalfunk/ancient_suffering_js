import { getRoom } from './map.js';
import { getItem } from './items.js';
import { getNpc } from './npcs.js';
import { updateLog, updateButtons, showTalkButton, hideTalkButton, showPickUpButton, hidePickUpButton, showInventoryButton } from './ui.js';
import { move } from './traversal.js';

export function updateRoom(player, gameState) {
    if (!gameState.isTraversal()) return;

    const currentRoom = getRoom(player.currentRoom);
    updateLog(`*** ${currentRoom.title} ***`);
    updateLog(currentRoom.description);

    if (currentRoom.npcs.length > 0) {
        const npc = getNpc(currentRoom.npcs[0]);
        updateLog(`You see ${npc.name} here.`);
        showTalkButton();
    } else {
        hideTalkButton();
    }

    updateButtons(currentRoom.exits, (direction) => move(direction, player, gameState));
    showInventoryButton(player);
}

export function loadItemsInRoom(player) {
    const room = getRoom(player.currentRoom);
    console.log("Room data:", room);
    const itemsInRoom = room.items.map((itemId) => getItem(itemId));
    console.log("Items in room:", itemsInRoom);
  
    if (itemsInRoom.length > 0) {
      itemsInRoom.forEach((item) => {
        updateLog(`You see a ${item.name} here.`);
        showPickUpButton(item, player);
      });
    } else {
      hidePickUpButton();
    }
  }

  export function updateRoomAndItems(player, gameState) {
    updateRoom(player, gameState);
    loadItemsInRoom(player);
  }

  export function pickUpItem(item, player) {
    player.inventory.push(item);
    updateLog(`You picked up a ${item.name}.`);

    const currentRoom = player.currentRoom;
    const room = getRoom(currentRoom);
    room.items = room.items.filter(roomItem => roomItem !== item.id);
  
    if (room.items.length === 0) {
      hidePickUpButton();
    }
  }

  export function handlePickUp(item, player) {
    player.pickUpItem(item);
    const currentRoom = getRoom(player.currentRoom);
    currentRoom.items = currentRoom.items.filter(roomItem => roomItem !== item.id);
  
    if (currentRoom.items.length === 0) {
      hidePickUpButton();
    }
    if (player.inventory.length > 0) {
      showInventoryButton(player);
    }
  }
import { Player } from "./player.js";
import { GameStateManager } from "./gameStateManager.js";
import { move } from "./traversal.js";
import { initializeMap, getRoom } from "./map.js";
import { getNpc, startNpcInteraction } from "./npcs.js";
import { updateRoomAndItems } from "./roomManager.js";
import { updateLog } from "./ui.js";

export const gameState = new GameStateManager();
const player = new Player();

function showAsciiArt() {
  fetch("asciiArt.txt")
    .then(response => response.text())
    .then(asciiArt => {
      updateLog(asciiArt, true);
      
      initializeMap().then(coreRooms => {
        const firstRoomKey = Object.keys(coreRooms)[0];
        player.currentRoom = firstRoomKey;
        updateRoomAndItems(player, gameState);
      }).catch(error => {
        console.error('Error initializing the map:', error);
      });
    })
    .catch(error => console.error("Error loading ASCII art:", error));
}

function initializeGame() {
  showAsciiArt();
}

document.getElementById("north-btn").addEventListener("click", () => move("north", player, gameState));
document.getElementById("south-btn").addEventListener("click", () => move("south", player, gameState));
document.getElementById("east-btn").addEventListener("click", () => move("east", player, gameState));
document.getElementById("west-btn").addEventListener("click", () => move("west", player, gameState));

document.getElementById("talk-btn").addEventListener("click", () => {
  const currentRoom = getRoom(player.currentRoom);
  if (currentRoom.npcs.length > 0) {
    const npc = getNpc(currentRoom.npcs[0]);
    startNpcInteraction(npc, player);
  }
});

document.getElementById("pick-up-btn").style.display = "none";

document.addEventListener("DOMContentLoaded", () => {
  initializeGame();
});

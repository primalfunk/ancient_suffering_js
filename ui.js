import { handlePickUp, updateRoomAndItems } from "./roomManager.js";
import { getRoom } from "./map.js";

export function updateLog(message, isPreformatted = false) {
  const textLog = document.getElementById("text-log");
  if (isPreformatted) {
    textLog.innerHTML += `<pre>${message}</pre>`;
  } else {
    textLog.innerHTML += `<p>${message}</p>`;
  }
  textLog.scrollTop = textLog.scrollHeight;
}

export function updateButtons(exits, moveCallback) {
  const directionalButtonContainer = document.getElementById('directional-button-container');
  const actionButtonContainer = document.getElementById('action-button-container');
  const talkButton = document.getElementById("talk-btn");
  const pickUpButton = document.getElementById("pick-up-btn");
  const inventoryButton = document.getElementById("inventory-btn");
  const statusButton = document.getElementById("status-btn");
  directionalButtonContainer.innerHTML = '';
  actionButtonContainer.innerHTML = '';

  if (exits.north) {
    const northBtn = createDirectionButton('North', 'north-btn', () => moveCallback('north'));
    directionalButtonContainer.appendChild(northBtn);
  }
  if (exits.south) {
    const southBtn = createDirectionButton('South', 'south-btn', () => moveCallback('south'));
    directionalButtonContainer.appendChild(southBtn);
  }
  if (exits.east) {
    const eastBtn = createDirectionButton('East', 'east-btn', () => moveCallback('east'));
    directionalButtonContainer.appendChild(eastBtn);
  }
  if (exits.west) {
    const westBtn = createDirectionButton('West', 'west-btn', () => moveCallback('west'));
    directionalButtonContainer.appendChild(westBtn);
  }

  if (talkButton) {
    actionButtonContainer.appendChild(talkButton); 
  }
  if (pickUpButton) {
    actionButtonContainer.appendChild(pickUpButton); 
  }
  if (inventoryButton) {
    actionButtonContainer.appendChild(inventoryButton); 
  }
  if (statusButton) {
    actionButtonContainer.appendChild(statusButton);
  }
}

export function createDirectionButton(direction, id, callback) {
  const button = document.createElement("button");
  button.id = id;
  button.innerText = direction;
  button.addEventListener("click", callback);
  return button;
}

export function showTalkButton() {
  const talkButton = document.getElementById("talk-btn");
  if (talkButton) {
    talkButton.style.display = "inline-block";
  } else {
    console.error("Talk button not found in the DOM when trying to show it.");
  }
}

export function hideTalkButton() {
  const talkButton = document.getElementById("talk-btn");
  if (talkButton) {
    talkButton.style.display = "none";
  } else {
    console.error("Talk button not found in the DOM when trying to hide it.");
  }
}
export function showYesNoChoice(npc, player) {
  const overlayContainer = document.getElementById("overlay-container");
  const overlayMessage = document.getElementById("overlay-message");

  overlayContainer.style.display = "flex";
  overlayMessage.textContent = `Would you like to become a ${npc.npcClass}?`;

  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");

  yesBtn.onclick = () => handleYesChoice(npc, player);
  noBtn.onclick = () => handleNoChoice(npc);
}

export function hideYesNoChoice() {
  const overlayContainer = document.getElementById("overlay-container");
  overlayContainer.style.display = "none";
}

export function handleYesChoice(npc, player) {
  if (npc.type === "classTrainer") {
    player.changeClass(npc.npcClass);
    updateLog(`You are now a ${npc.npcClass}.`);
  }
  hideYesNoChoice();
}

export function handleNoChoice(npc) {
  updateLog("Another time, perhaps.");
  hideYesNoChoice();
}

export function showPickUpButton(item, player) {
  const pickUpButton = document.getElementById("pick-up-btn");
  if (item && item.pickUpAble) {
    pickUpButton.style.display = "block";
    pickUpButton.onclick = () => handlePickUp(item, player);
  } else {
    pickUpButton.style.display = "none";
  }
}

export function hidePickUpButton() {
  const pickUpButton = document.getElementById('pick-up-btn');
  if (pickUpButton) {
    pickUpButton.style.display = 'none';
  }
}

export function showInventoryButton(player) {
  const inventoryButton = document.getElementById("inventory-btn");
  if (inventoryButton) {
    if (player.hasItemsInInventory()) {
      inventoryButton.style.display = "block";
      inventoryButton.onclick = () => showInventoryModal(player);
    } else {
      inventoryButton.style.display = "none";
    }
  } else {
    console.error("Inventory button not found in the DOM.");
  }
}

export function showInventoryModal(player, gameState) {
  const inventoryModal = document.getElementById('inventory-modal');
  const inventoryList = document.getElementById('inventory-list');
  const closeInventoryBtn = document.getElementById('close-inventory-btn');

  inventoryList.innerHTML = '';
  player.inventory.forEach(item => {
      // Create the main item button
      const itemButton = document.createElement('button');
      itemButton.textContent = item.name;
      itemButton.classList.add('inventory-item-btn');

      const optionsDiv = document.createElement('div');
      optionsDiv.classList.add('item-options');
      optionsDiv.style.display = 'none';

      if (item.type === 'weapon' || item.type === 'armor') {
          const equipBtn = document.createElement('button');
          equipBtn.classList.add('inventory-item-btn');
          equipBtn.textContent = player.isEquipped(item) ? 'Unequip' : 'Equip';
          equipBtn.onclick = () => {
              if (player.isEquipped(item)) {
                  player.unequipItem(item);
                  equipBtn.textContent = 'Equip';
              } else {
                  player.equipItem(item);
                  equipBtn.textContent = 'Unequip';
              }
          };
          optionsDiv.appendChild(equipBtn);
      }

      const dropBtn = document.createElement('button');
      dropBtn.classList.add('inventory-item-btn');
      dropBtn.textContent = 'Drop';
      dropBtn.onclick = () => {
          player.dropItem(item);
          updateRoomAndItems(player, gameState);
          inventoryModal.style.display = 'none';
      };
      optionsDiv.appendChild(dropBtn);

      itemButton.onclick = () => {
          itemButton.style.display = 'none';
          optionsDiv.style.display = 'flex';
      };

      inventoryList.appendChild(itemButton);
      inventoryList.appendChild(optionsDiv);
  });

  inventoryModal.style.display = 'flex';

  closeInventoryBtn.onclick = () => {
      inventoryModal.style.display = 'none';
  };
}

export function disableTraversalButtons() {
  const buttons = document.querySelectorAll("#north-btn, #south-btn, #east-btn, #west-btn, #talk-btn, #pick-up-btn, #status-btn");
  buttons.forEach(button => button.style.display = 'none');
}

export function enableTraversalButtons(player) {
  const directionalButtons = document.querySelectorAll("#north-btn, #south-btn, #east-btn, #west-btn");
  directionalButtons.forEach(button => button.style.display = 'block');
  const currentRoom = getRoom(player.currentRoom);
  const statusButton = document.getElementById("status-btn");
  statusButton.style.display = 'block';
  const talkButton = document.getElementById("talk-btn");
  if (currentRoom && currentRoom.npcs && currentRoom.npcs.length > 0) {
      talkButton.style.display = 'block';
  } else {
      talkButton.style.display = 'none';
  }
  const pickUpButton = document.getElementById("pick-up-btn");
  if (currentRoom && currentRoom.items && currentRoom.items.length > 0) {
      pickUpButton.style.display = 'block';
  } else {
      pickUpButton.style.display = 'none';
  }
}

export function showPlayerStatus(player) {
  const statsTable = `
Stat               : Value
-------------------:------
Name               : ${player.name || "Unknown"}
Class              : ${player.class}
Level              : ${player.level}
Experience Points  : ${player.experience}
HP                 : ${player.hp}
MP                 : ${player.mp}
Strength           : ${player.str}
Dexterity          : ${player.dex}
Intelligence       : ${player.int}
Wisdom             : ${player.wis}
Constitution       : ${player.con}
  `;
  updateLog(statsTable, true);  // Output as preformatted text
}

import { handlePickUp } from "./roomManager.js";

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

  // Clear all existing buttons in each container
  directionalButtonContainer.innerHTML = '';
  actionButtonContainer.innerHTML = '';

  // Create and append directional buttons
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

  // Action buttons (e.g. Talk, Pick Up, Inventory)
  if (talkButton) {
    actionButtonContainer.appendChild(talkButton); 
  }
  if (pickUpButton) {
    actionButtonContainer.appendChild(pickUpButton); 
  }
  if (inventoryButton) {
    actionButtonContainer.appendChild(inventoryButton); 
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
  // Show the overlay
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
  if (inventoryButton) {  // Ensure the button exists
    if (player.hasItemsInInventory()) {
      inventoryButton.style.display = "block";
    } else {
      inventoryButton.style.display = "none";
    }
  } else {
    console.error("Inventory button not found in the DOM.");
  }
}
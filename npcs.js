import { updateLog, showYesNoChoice, disableTraversalButtons, enableTraversalButtons } from './ui.js';
import { gameState } from './main.js'; 

export class NPC {
  constructor(name, npcClass, levelThresholds, dialogues, type = "generic") {
    this.name = name;
    this.npcClass = npcClass;
    this.levelThresholds = levelThresholds;
    this.dialogues = dialogues;
    this.type = type;
    this.interacted = false;
  }

  interact(player) {
    let greeting = `${this.name}: Greetings, ${player.class}.`;
    if (player.class === this.npcClass) {
      return {
        message: `${greeting} You have ${player.experience} EXP.`,
        choice: false
      };
    }

    if (player.class !== this.npcClass && player.class !== "Adventurer") {
      return {
        message: `${greeting} Would you like to change your class to ${this.npcClass}?`,
        choice: true
      };
    }

    return {
      message: `${greeting} Would you like to become a ${this.npcClass}?`,
      choice: true
    };
  }
}

export const npcs = {
  npc1: new NPC(
    "Old Trainer",
    "Warrior",
    { 1: 100 },
    { firstInteraction: "Would you like to become a Warrior?" },
    "classTrainer"
  ),
  npc2: new NPC(
    "Shady Character",
    "Rogue",
    { 1: 100 },
    { firstInteraction: "Would you like to become a Rogue?" },
    "classTrainer"
  ),
  npc3: new NPC(
    "Cranky Wizard",
    "Mage",
    { 1: 100 },
    { firstInteraction: "Would you like to become a Mage?" },
    "classTrainer"
  ),
  npc4: new NPC(
    "Smiling Priest",
    "Cleric",
    { 1: 100 },
    { firstInteraction: "Would you like to become a Cleric?" },
    "classTrainer"
  ),
  npc5: new NPC(
    "Grizzled Veteran",
    "Ranger",
    { 1: 100 },
    { firstInteraction: "Would you like to become a Ranger?" },
    "classTrainer"
  )
};

export function getNpc(npcId) {
  return npcs[npcId];
}

export function startNpcInteraction(npc, player) {
  if (npc && typeof npc.interact === 'function') {
      gameState.setState('conversation'); // Set game state to conversation
      disableTraversalButtons(); // Disable traversal buttons during conversation

      const result = npc.interact(player);
      const dialogueLines = buildDialogueSequence(npc, player);

      // Display dialogue and only show the choice overlay if relevant
      displayDialogueSequence(dialogueLines, () => {
          if (result.choice) {
              showYesNoChoice(npc, player); // Show Yes/No choice only after dialogue if applicable
          }
          gameState.setState('traversal'); // Return to traversal state
          enableTraversalButtons(player); // Re-enable traversal buttons
      });
  } else {
      console.error("Invalid NPC or missing interact method.");
  }
}

// Refined buildDialogueSequence to recognize player’s current class
function buildDialogueSequence(npc, player) {
  console.log(`npc class is ${npc.npcClass}, player class is ${player.class}`);
  if (player.class === npc.npcClass) {  // Case: Player is already in the NPC's class
      if (player.experience >= npc.levelThresholds[player.level]) {
          return [
              `${npc.name}: Greetings, ${player.class}. It seems you're ready to level up.`,
              `${npc.name}: Shall we proceed with your training?`
          ];
      } else {
          const expNeeded = npc.levelThresholds[player.level] - player.experience;
          return [
              `${npc.name}: Greetings, ${player.class}.`,
              `${npc.name}: You need to earn ${expNeeded} more experience to reach the next level.`
          ];
      }
  } else {  // Case: Player is not in the NPC's class
      return [
          `${npc.name}: Ah, a ${player.class}. Would you consider becoming a ${npc.npcClass}?`,
          `${npc.name}: I can show you the way, if you're interested.`
      ];
  }
}

function displayDialogueSequence(lines, callback) {
  lines.forEach((line, index) => {
      setTimeout(() => {
          updateLog(line);
          if (index === lines.length - 1 && callback) callback(); // Call callback after final line
      }, index * 2000); // 2-second delay per line
  });
}
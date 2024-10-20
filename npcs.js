import { updateLog, showYesNoChoice } from "./ui.js";

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
    const result = npc.interact(player);

    updateLog(result.message);

    if (result.choice) {
      showYesNoChoice(npc, player);
    }
  } else {
    console.error("Invalid NPC or missing interact method.");
  }
}

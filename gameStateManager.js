export class GameStateManager {
    constructor() {
      this.currentState = 'traversal';
    }
  
    setState(newState) {
      this.currentState = newState;
    }
  
    getState() {
      return this.currentState;
    }
  
    isTraversal() {
      return this.currentState === 'traversal';
    }
  
    isCombat() {
      return this.currentState === 'combat';
    }
  
    isDialogue() {
      return this.currentState === 'dialogue';
    }

    isConversation() {
      return this.currentState === 'conversation';
    }
  }
  
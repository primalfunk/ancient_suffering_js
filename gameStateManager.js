export class GameStateManager {
    constructor() {
      this.currentState = 'traversal';  // Default state
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
  }
  
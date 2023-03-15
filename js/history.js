// 该类负责记录操作历史，以便支持撤销和重做功能。
class History {
    constructor() {
      this.undoStack = [];
      this.redoStack = [];
    }
  
    record(action) {
      this.undoStack.push(action);
      this.redoStack.length = 0;
    }
  
    undo() {
      const action = this.undoStack.pop();
      if (action) {
        action.undo();
        this.redoStack.push(action);
      }
    }
  
    redo() {
      const action = this.redoStack.pop();
      if (action) {
        action.redo();
        this.undoStack.push(action);
      }
    }
  }
  
  export { History };
  
  
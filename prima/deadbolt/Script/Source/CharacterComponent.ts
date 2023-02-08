namespace Script {
  import fc = FudgeCore;
  fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export let xSpeed = 0;

  
  export let usedStairs: boolean = false;
  
  export let weapon: String = "knife";

  export class CharacterComponent extends fc.ComponentScript {

    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = fc.Component.registerSubclass(CharacterComponent);
    // Properties may be mutated by users in the editor via the automatically created user interface

    constructor() {
      super();

      // Don't start when running in editor
      if (fc.Project.mode == fc.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(fc.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }


    public walkSpeed: number = 0;
    private characterPos: fc.Node;

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case fc.EVENT.COMPONENT_ADD:
          break;
        case fc.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case fc.EVENT.NODE_DESERIALIZED:
          
        this.characterPos = this.node.getParent();
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    update(deltaTime: number) {
      this.characterPos.mtxLocal.translateX(xSpeed * deltaTime, true)
    }

    walk(direction: number) {
      xSpeed = walkSpeed * direction;
    }

    useStairs(exit: number){
      this.characterPos.mtxLocal.translateY(exit);
    }


    changeWeapon(){
      if(weapon === "knife"){
        weapon = "stones";
        document.getElementById("knife").removeAttribute("class");
        document.getElementById("stones").setAttribute("class", "selected");
        document.getElementById("stoneImgs").setAttribute("class", "selected");
      }else{
        weapon = "knife";
        document.getElementById("stones").removeAttribute("class");
        document.getElementById("stoneImgs").removeAttribute("class");
        document.getElementById("knife").setAttribute("class", "selected");
      }
    }

    hndThrow(e: MouseEvent): void{
      console.log("clicked")
      if(weapon === "stones" && gameState.stones > 0){
        console.log(e);
        let newStone = new StoneNode()
        branch.getChildrenByName("environment")[0].getChildrenByName("items")[0].addChild(newStone);
        gameState.stones -= 1;
        gameState.stoneAmount(gameState.stones, true);
      }

    }


    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}
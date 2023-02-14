namespace Script {
  import fc = FudgeCore;
  fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export let xSpeed = 0;

  let directionRight: boolean = true;
  
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

          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    update(deltaTime: number) {
      this.node.getParent().mtxLocal.translateX(xSpeed * deltaTime, true)
    }

    walk(direction: number) {
      xSpeed = walkSpeed * direction;
      if(direction > 0){
        if(!directionRight){
          this.node.mtxLocal.rotateY(180);
        }
        directionRight = true;
      }else if(direction < 0){
        if(directionRight){
          this.node.mtxLocal.rotateY(180);
        }
        directionRight = false;
      }
      
    }

    useStairs(exit: number){
      characterPos.mtxLocal.translateY(exit);
    }



    changeWeapon(){
      this.node.dispatchEvent(new Event("playSound", {bubbles: true}));
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
      if(weapon === "stones" && gameState.stones > 0){
        let vctMouse: fc.Vector2 = new fc.Vector2();
        vctMouse.x = 2 * (e.clientX / window.innerWidth) -1;
        vctMouse.y = 2 * (e.clientY / window.innerHeight) -1;
        let newStone = new StoneNode(vctMouse)
        let items: fc.Node = branch.getChildrenByName("environment")[0].getChildrenByName("items")[0];
        items.addChild(newStone);
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
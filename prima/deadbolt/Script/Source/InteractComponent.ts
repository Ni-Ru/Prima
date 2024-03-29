namespace Script {
  import fc = FudgeCore;
  fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  let DoorCmp: DoorComponent;
  let StairCmp: StairComponent;

  export class InteractComponent extends fc.ComponentScript {
   
    public static readonly iSubclass: number = fc.Component.registerSubclass(InteractComponent);

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

    private keyEPressed: boolean = true;

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


    update(entityGravityCmp: GravityComponent) {
      DoorCmp = this.node.getComponent(DoorComponent);
      StairCmp = this.node.getComponent(StairComponent);
      this.checkPlayerPos(entityGravityCmp);
    }

    actionControls(){

      if(fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.E])){
        if(allowInputs){
          if(!this.keyEPressed) {
            this.keyEPressed = true;
            switch (this.node.name){
              case "Door":
                DoorCmp.interaction();
                break;
              case "Stair":
                if(!usedStairs){
                  StairCmp.interaction();
                  usedStairs = true;
                }
                break;  
            }
          }
        }
      } else {
        usedStairs = false;
        this.keyEPressed = false;
      }
    }

    showInteract(entityGravityCmp: GravityComponent){
      let nodeName: string = entityGravityCmp.node.name;
      if(nodeName === "character"){
        this.node.getComponent(fc.ComponentMaterial).clrPrimary.a = 1;
      }
      if(DoorCmp){
        if(!DoorCmp.getOpenDoorVar()){
          entityGravityCmp.wallCollission();
        }
      }
    }

    noInteract(){
      this.node.getComponent(fc.ComponentMaterial).clrPrimary.a = 0;
    }

    checkPlayerPos(entityGravityCmp: GravityComponent){
      let playerPos: fc.Vector3 = entityGravityCmp.node.getParent().mtxLocal.translation;
      let interactablePos: fc.Vector3 = this.node.getParent().mtxLocal.translation;
      if(StairCmp){
        if(Math.abs(playerPos.x - interactablePos.x) < 0.3){
          this.showInteract(entityGravityCmp);
        this.actionControls();
        } else {
          this.noInteract();
        }
      }else{
        if(Math.abs(playerPos.x - interactablePos.x) < 1){
          this.showInteract(entityGravityCmp);
          this.actionControls();
        } else {
          this.noInteract();
        }
      }

    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}


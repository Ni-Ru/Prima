namespace Script {
  import fc = FudgeCore;
  fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export let openDoor: boolean = false;

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

    private keyEPressed: boolean = false;

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


    update() {
      if(fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.E])){
        if(!this.keyEPressed) {
          this.keyEPressed = true;
          switch (openDoor){
            case true:
              openDoor = false;
              break;
            case false:
              console.log(openDoor);
              openDoor = true;
              console.log(openDoor);
              break;  
          }
        }
      } else {
        this.keyEPressed = false;
      }
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}
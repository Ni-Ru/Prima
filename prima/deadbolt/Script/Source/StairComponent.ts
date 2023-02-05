namespace Script {
  import fc = FudgeCore;
  fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  let InteractCmp: InteractComponent;

  export class StairComponent extends fc.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = fc.Component.registerSubclass(StairComponent);



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

    private activeStairNodePos: fc.Vector3;
    private activeStairPos: fc.Vector3;
    private calcActiveStairPos: fc.Vector3;

    private StairNodePos: fc.Vector3;
    private StairNode: fc.Node;
    private StairPos: fc.Vector3;
    private calcStairPos: fc.Vector3;


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

    interaction(){
      InteractCmp = this.node.getComponent(InteractComponent);
      this.findDoor();
    }

    findDoor(){
      this.activeStairNodePos = this.node.mtxLocal.translation;
      this.activeStairPos = this.node.getParent().mtxLocal.translation;
      this.calcActiveStairPos = fc.Vector3.SUM(this.activeStairNodePos, this.activeStairPos);

      let stairs: fc.Node[] = branch.getChildrenByName("environment")[0].getChildrenByName("stairs")[0].getChildrenByName("stair_Pos");
      
      for (let stair of stairs){
        this.StairPos = stair.mtxLocal.translation;
        this.StairNode = stair.getChild(0);
        this.StairNodePos = this.StairNode.mtxLocal.translation;
        this.calcStairPos = fc.Vector3.SUM(this.StairNodePos, this.StairPos);
  
        if(Math.abs(this.calcStairPos.x - this.calcActiveStairPos.x) < 1){
          if(Math.abs(this.calcStairPos.y - this.calcActiveStairPos.y) > 1){
            console.log(this.calcStairPos.y - this.calcActiveStairPos.y);
            characterCmp.useStairs(this.calcStairPos.y - this.calcActiveStairPos.y);
            InteractCmp.noInteract();
          }
        }
      }
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}
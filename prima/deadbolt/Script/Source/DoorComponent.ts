namespace Script {
  import fc = FudgeCore;
  fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export let openDoor: boolean = false;
  let doorTransform: fc.ComponentTransform
  let doorRigidBody: fc.ComponentRigidbody;

  export class DoorComponent extends fc.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = fc.Component.registerSubclass(DoorComponent);



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
      doorTransform = this.node.getComponent(fc.ComponentTransform);
      doorRigidBody = this.node.getComponent(fc.ComponentRigidbody);
      switch (openDoor){
        case true:
          this.closeDoor();
          openDoor = false;
          break;
        case false:
          this.openDoor()
          openDoor = true;
          allowWalkLeft = true;
          allowWalkRight = true;
          break;  
      }
    }

    loadTextures(closed: Boolean){
      let openDoorImage: fc.TextureImage = new fc.TextureImage();
      let closedDoorImage: fc.TextureImage = new fc.TextureImage();
      let openMaterial: fc.Material = new fc.Material("openDoorMat", fc.ShaderLitTextured);
      let openDoorCoat: fc.CoatTextured = new fc.CoatTextured(undefined, openDoorImage);
      let closedDoorCoat: fc.CoatTextured = new fc.CoatTextured(undefined, closedDoorImage);
      
      openDoorImage.load("./imgs/openDoor.gif");
      closedDoorImage.load("./imgs/closedDoor.gif");
      if(closed){
        console.log("open")
        openMaterial.coat = closedDoorCoat;
      }else{
        console.log("close")
        openMaterial.coat = openDoorCoat;
      }

      let cmpTextureNode: fc.Node = this.node.getChildrenByName("DoorTexture")[0];
      let cmpMat: fc.ComponentMaterial = cmpTextureNode.getComponent(fc.ComponentMaterial);
      cmpMat.material = openMaterial;
    }

    openDoor(){
      doorRigidBody.activate(false)
      doorTransform.mtxLocal.translateX(0.25);
      doorTransform.mtxLocal.scaleX(3);
      doorTransform.mtxLocal.translateZ(-0.1);
      this.loadTextures(false);
    }

    closeDoor(){
      doorRigidBody.activate(true);
      doorTransform.mtxLocal.scaleX(1/3);
      doorTransform.mtxLocal.translateX(-0.25);
      doorTransform.mtxLocal.translateZ(0.1);
      this.loadTextures(true);
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}
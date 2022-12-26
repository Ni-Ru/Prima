namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class SensorScript extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(SensorScript);
    // Properties may be mutated by users in the editor via the automatically created user interface


    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          //ƒ.Debug.log(this.message, this.node);
          this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.update)
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:

          break;
      }
    }


    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
    public update = (_event: Event): void => {

      let sensorPos: ƒ.Node = this.node.getParent();
      
      
      if(!terrainMesh){
        return;
      }
      let info: ƒ.TerrainInfo = terrainMesh.getTerrainInfo(sensorPos.mtxWorld.translation, cmpMeshTerrain.mtxWorld);
      
      if(info.distance < 0){
        this.node.dispatchEvent(new Event("SensorHit", { bubbles: true}));
      }

      
    }
  }
}

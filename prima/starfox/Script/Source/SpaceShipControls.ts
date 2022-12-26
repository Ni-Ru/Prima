namespace Script {
  import fc = FudgeCore;
  fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class SpaceShipControls extends fc.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = fc.Component.registerSubclass(SpaceShipControls);
    // Properties may be mutated by users in the editor via the automatically created user interface
    private rigidbody: fc.ComponentRigidbody;
    public power: number = 15000000;


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
          //ƒ.Debug.log(this.message, this.node);
          this.node.addEventListener(fc.EVENT.RENDER_PREPARE, this.update)
          break;
        case fc.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case fc.EVENT.NODE_DESERIALIZED:
          this.audioCrash = new fc.Audio("./sound/crash_augh.mp3")
          this.node.addComponent(new fc.ComponentAudio(this.audioCrash));
          this.rigidbody = this.node.getComponent(fc.ComponentRigidbody);
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          this.rigidbody.addEventListener(fc.EVENT_PHYSICS.COLLISION_ENTER, this.hndCollision);
          this.node.addEventListener("SensorHit", this.hndCollision)
          break;
      }
    }

    private audioCrash: fc.Audio;

    hndCollision = (): void =>{
      console.log("boom");
      let audioComp: fc.ComponentAudio = this.node.getComponent(fc.ComponentAudio);
      audioComp.play(true);
      audioComp.volume = 2;
      let ufo: fc.Node = branch.getChildrenByName("Enemy_ships")[0].getChildrenByName("enemy_pos")[0].getChildrenByName("enemy")[0];
      ufo.getComponent(fc.ComponentAnimator).activate(false);
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
    public update = (_event: Event): void => {
      if(!gameState){
        return;
      }
      gameState.height = this.node.mtxWorld.translation.y;
      gameState.velocity = 1;
    }
    public yaw(_value: number) {
      this.rigidbody.applyTorque(fc.Vector3.SCALE(this.node.mtxWorld.getY(), _value * -10));
    }
    public pitch(_value: number) {
      this.rigidbody.applyTorque(fc.Vector3.SCALE(this.node.mtxWorld.getX(), _value * -5));
    }
    public roll(_value: number) {
      this.rigidbody.applyTorque(fc.Vector3.SCALE(this.node.mtxWorld.getZ(), -_value));
    }
    public backwards() {
      this.rigidbody.applyForce(fc.Vector3.SCALE(this.node.mtxWorld.getZ(), this.power));
    }
    public thrust() {
      this.rigidbody.applyForce(fc.Vector3.SCALE(this.node.mtxWorld.getZ(), -this.power));
    }
  }
}

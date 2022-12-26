namespace Script {
    import fc = FudgeCore;
    import ƒAid = FudgeAid;
    fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  
    enum JOB {
      IDLE, ATTACK
    }
  
    export class StateMachine extends ƒAid.ComponentStateMachine<JOB> {
      public static readonly iSubclass: number = fc.Component.registerSubclass(StateMachine);
      private static instructions: ƒAid.StateMachineInstructions<JOB> = StateMachine.get();
      public torqueIdle: number = 5;
      private turretJoint: fc.Node;
  
  
      constructor() {
        super();
        this.instructions = StateMachine.instructions; // setup instructions with the static set
  
        // Don't start when running in editor
        if (fc.Project.mode == fc.MODE.EDITOR)
          return;
  
        // Listen to this component being added to or removed from a node
        this.addEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
        this.addEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
        this.addEventListener(fc.EVENT.NODE_DESERIALIZED, this.hndEvent);
      }
  
      public static get(): ƒAid.StateMachineInstructions<JOB> {
        let setup: ƒAid.StateMachineInstructions<JOB> = new ƒAid.StateMachineInstructions();
        setup.transitDefault = StateMachine.transitDefault;
        setup.actDefault = StateMachine.actDefault;
        setup.setAction(JOB.IDLE, <fc.General>this.actIdle);
        setup.setAction(JOB.ATTACK, <fc.General>this.actAttack);
        return setup;
      }
  
      private static transitDefault(_machine: StateMachine): void {
        console.log("Transit to", _machine.stateNext);
      }
  
      private static async actDefault(_machine: StateMachine): Promise<void> {

      }

      private static async actAttack(_machine: StateMachine): Promise<void> {
        console.log("Attack");
      }
  
      private static async actIdle(_machine: StateMachine): Promise<void> {
        _machine.turretJoint.mtxLocal.rotateY(1);
        StateMachine.actDefault(_machine);
        let distance: fc.Vector3 = fc.Vector3.DIFFERENCE(ship.mtxWorld.translation, _machine.node.mtxWorld.translation);
        if(distance.magnitude < 5){
            _machine.transit(JOB.ATTACK);
        }

      }
  
      // Activate the functions of this component as response to events
      private hndEvent = (_event: Event): void => {
        switch (_event.type) {
          case fc.EVENT.COMPONENT_ADD:
            fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, this.update);
            this.transit(JOB.IDLE);
            break;
          case fc.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
            fc.Loop.removeEventListener(fc.EVENT.LOOP_FRAME, this.update);
            break;
          case fc.EVENT.NODE_DESERIALIZED:
            this.turretJoint = this.node.getChild(0);
            break;
        }
      }
  
      private update = (_event: Event): void => {
        this.act();
      }
  
  
  
      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
  }
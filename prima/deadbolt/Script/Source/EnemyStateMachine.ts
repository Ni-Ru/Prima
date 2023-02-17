namespace Script {
    import fc = FudgeCore;
    import fcAid = FudgeAid;
    fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  
    enum JOB {
      IDLE, SEARCH, ATTACK
    }
  
    export class EnemyStateMachine extends fcAid.ComponentStateMachine<JOB> {
      public static readonly iSubclass: number = fc.Component.registerSubclass(EnemyStateMachine);
      private static instructions: fcAid.StateMachineInstructions<JOB> = EnemyStateMachine.get();

      private enemy: fc.Node;

      private enemySpeed: number = 0.05;

      //private directionRight: boolean;
  
      constructor() {
        super();
        this.instructions = EnemyStateMachine.instructions; // setup instructions with the static set
  
        // Don't start when running in editor
        if (fc.Project.mode == fc.MODE.EDITOR)
          return;
  
        // Listen to this component being added to or removed from a node
        this.addEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
        this.addEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
        this.addEventListener(fc.EVENT.NODE_DESERIALIZED, this.hndEvent);
      }
  
      public static get(): fcAid.StateMachineInstructions<JOB> {
        let setup: fcAid.StateMachineInstructions<JOB> = new fcAid.StateMachineInstructions();
        setup.transitDefault = EnemyStateMachine.transitDefault;
        setup.actDefault = EnemyStateMachine.actDefault;

        setup.setAction(JOB.IDLE, <fc.General>this.actIdle);
        setup.setAction(JOB.SEARCH, <fc.General>this.actSearch);
        setup.setAction(JOB.ATTACK, <fc.General>this.actAttack);
        return setup;
      }
  
      private static transitDefault(_machine: EnemyStateMachine): void {
       console.log("Transit to", _machine.stateNext);
      }
  
      private static async actDefault(_machine: EnemyStateMachine): Promise<void> {
        _machine.transit(JOB.IDLE);
      }
  
      private static async actIdle(_machine: EnemyStateMachine): Promise<void> {
        let charPos: fc.Vector3 = characterSprite.mtxWorld.translation;
        charPos.y -= 0.7;
        let distance: fc.Vector3 = fc.Vector3.DIFFERENCE(charPos, _machine.node.getParent().mtxWorld.translation);
        distance.normalize();
        let watchDirection: fc.Vector3 = _machine.node.mtxWorld.getX();
        let angle: number = fc.Vector3.DOT(watchDirection, distance);
        //console.log(angle);
       
        if (angle > -0.5 && angle < -0.48){
          _machine.transit(JOB.ATTACK);
        }
      }

      private static async actSearch(_machine: EnemyStateMachine): Promise<void> {
        //console.log("search");
        let distance: fc.Vector3 = fc.Vector3.DIFFERENCE(characterSprite.getParent().mtxWorld.translation, _machine.node.mtxWorld.translation);
        if (distance.magnitude < 10)
          _machine.transit(JOB.ATTACK);

      }
      
      private static async actAttack(_machine: EnemyStateMachine): Promise<void> {

        let distance: fc.Vector3 = fc.Vector3.DIFFERENCE(characterSprite.mtxWorld.translation, _machine.node.mtxWorld.translation);
        distance.normalize(1);
        let distanceX = _machine.enemySpeed * Math.abs(distance.x);
        _machine.enemy.getParent().mtxLocal.translateX(-1 * distanceX);


        if (Math.abs(distance.x) > 2 || distance.x < 0)
          _machine.transit(JOB.IDLE);
      }
  
      // Activate the functions of this component as response to events
      private hndEvent = (_event: Event): void => {
        switch (_event.type) {
          case fc.EVENT.COMPONENT_ADD:
            fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, this.update);
            this.enemy = <EnemyNode>this.node;
            this.transit(JOB.IDLE);
            break;
          case fc.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
            fc.Loop.removeEventListener(fc.EVENT.LOOP_FRAME, this.update);
            break;
          case fc.EVENT.NODE_DESERIALIZED:
            this.transit(JOB.IDLE);
            break;
        }
      }
  
      private update = (_event: Event): void => {
        this.act();
        this.checkView();
      }

      private checkView = (): void =>{
        let raycast: fc.RayHitInfo = fc.Physics.raycast(this.enemy.mtxWorld.translation, this.enemy.mtxWorld.getX(), 10, true);
        if(raycast.hit){
          console.log(raycast.rigidbodyComponent.node.name);
        }
      }
  
      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
  }
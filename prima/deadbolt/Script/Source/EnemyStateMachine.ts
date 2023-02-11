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

      //private enemyNode: fc.Node;

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
      //  console.log("Transit to", _machine.stateNext);
      }
  
      private static async actDefault(_machine: EnemyStateMachine): Promise<void> {
        //console.log(JOB[_machine.stateCurrent]);
      }
  
      private static async actIdle(_machine: EnemyStateMachine): Promise<void> {
        let distance: fc.Vector3 = fc.Vector3.DIFFERENCE(characterSprite.mtxWorld.translation, _machine.node.mtxWorld.translation);
        //console.log("idle");
        if (distance.magnitude < 5)
          _machine.transit(JOB.ATTACK);
      }

      private static async actSearch(_machine: EnemyStateMachine): Promise<void> {
        //console.log("search")
        let distance: fc.Vector3 = fc.Vector3.DIFFERENCE(characterSprite.getParent().mtxWorld.translation, _machine.node.mtxWorld.translation);
        if (distance.magnitude < 10)
          _machine.transit(JOB.ATTACK);
      }
      
      private static async actAttack(_machine: EnemyStateMachine): Promise<void> {
        //console.log("attack")
        let distance: fc.Vector3 = fc.Vector3.DIFFERENCE(characterSprite.mtxWorld.translation, _machine.node.mtxWorld.translation);
        if (distance.magnitude > 5)
          _machine.transit(JOB.IDLE);
      }
  
      // private static async actEscape(_machine: StateMachine): Promise<void> {
      //   _machine.cmpMaterial.clrPrimary = ƒ.Color.CSS("white");
      //   let difference: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_machine.node.mtxWorld.translation, cart.mtxWorld.translation);
      //   difference.normalize(_machine.forceEscape);
      //   _machine.cmpBody.applyForce(difference);
      //   StateMachine.actDefault(_machine);
      // }
      // private static async actDie(_machine: StateMachine): Promise<void> {
      //   //
      // }
  
      // private static transitDie(_machine: StateMachine): void {
      //   _machine.cmpBody.applyLinearImpulse(ƒ.Vector3.Y(5));
      //   let timer: ƒ.Timer = new ƒ.Timer(ƒ.Time.game, 100, 20, (_event: ƒ.EventTimer) => {
      //     _machine.cmpMaterial.clrPrimary = ƒ.Color.CSS("black", 1 - _event.count / 20);
      //     if (_event.lastCall)
      //       _machine.transit(JOB.RESPAWN);
      //   });
      //   console.log(timer);
      // }
  
      // private static actRespawn(_machine: StateMachine): void {
      //   let range: ƒ.Vector3 = ƒ.Vector3.SCALE(mtxTerrain.scaling, 0.5);
      //   _machine.cmpBody.setPosition(ƒ.Random.default.getVector3(range, ƒ.Vector3.SCALE(range, -1)));
      //   _machine.transit(JOB.IDLE);
      // }
  
      // Activate the functions of this component as response to events
      private hndEvent = (_event: Event): void => {
        switch (_event.type) {
          case fc.EVENT.COMPONENT_ADD:
            fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, this.update);
            //this.enemyNode = this.node;
            this.transit(JOB.IDLE);
            break;
          case fc.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
            fc.Loop.removeEventListener(fc.EVENT.LOOP_FRAME, this.update);
            break;
          case fc.EVENT.NODE_DESERIALIZED:
            this.transit(JOB.IDLE);
            //this.directionRight= true;
            // let trigger: ƒ.ComponentRigidbody = this.node.getChildren()[0].getComponent(ƒ.ComponentRigidbody);
            // trigger.addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, (_event: ƒ.EventPhysics) => {
            //   console.log("TriggerEnter", _event.cmpRigidbody.node.name);
            //   if (_event.cmpRigidbody.node.name == "Cart" && this.stateCurrent != JOB.DIE)
            //     this.transit(JOB.ESCAPE);
            // });
            // trigger.addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_EXIT, (_event: ƒ.EventPhysics) => {
            //   if (this.stateCurrent == JOB.ESCAPE)
            //     this.transit(JOB.IDLE);
            // });
            break;
        }
      }
  
      private update = (_event: Event): void => {
        this.act();
        this.checkView();
      }

      private checkView = (): void =>{
        //console.log(this.enemyNode.mtxWorld.getX());
        //let PlayerDir: fc.Vector3 = fc.Vector3.DIFFERENCE(characterNode.mtxWorld.translation, this.enemyNode.mtxWorld.translation);
        // console.log(PlayerDir);
        // console.log(this.enemyNode.mtxWorld.translation);
        //console.log(fc.Vector3.DOT(this.enemyNode.mtxWorld.getX(), ));
      }
  
      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
  }
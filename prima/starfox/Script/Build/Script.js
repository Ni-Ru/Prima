"use strict";
var Script;
(function (Script) {
    var f = FudgeCore;
    var fui = FudgeUserInterface;
    class GameState extends f.Mutable {
        reduceMutator(_Mutator) { }
        height = 1;
        velocity = 2;
        controller;
        constructor() {
            super();
            this.controller = new fui.Controller(this, document.getElementById("vui"));
            console.log(this.controller);
        }
    }
    Script.GameState = GameState;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let cmpEngine;
    let enemies;
    let enemy;
    let nodeTerrain;
    let vctMouse = ƒ.Vector2.ZERO();
    document.addEventListener("interactiveViewportStarted", start);
    window.addEventListener("mousemove", hndMouse);
    function start(_event) {
        Script.gameState = new Script.GameState();
        viewport = _event.detail;
        Script.branch = viewport.getBranch();
        Script.ship = Script.branch.getChildrenByName("Ship")[0];
        enemies = Script.branch.getChildrenByName("Enemy_ships")[0];
        enemy = enemies.getChildrenByName("enemy_pos")[0].getChildrenByName("enemy")[0];
        cmpEngine = Script.ship.getComponent(Script.SpaceShipControls);
        let cmpCamera = Script.ship.getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        nodeTerrain = Script.branch.getChildrenByName("Floor_pos")[0].getChildrenByName("Floor")[0];
        Script.cmpMeshTerrain = nodeTerrain.getComponent(ƒ.ComponentMesh);
        Script.terrainMesh = Script.cmpMeshTerrain.mesh;
        initAnim();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function initAnim() {
        let animseq = new ƒ.AnimationSequence();
        animseq.addKey(new ƒ.AnimationKey(0, 0, 0, 360 / 3000));
        animseq.addKey(new ƒ.AnimationKey(3000, 360, 360 / 3000));
        new ƒ.ComponentMesh().mtxPivot;
        let animStructure = {
            components: {
                ComponentMesh: [
                    {
                        "ƒ.ComponentMesh": {
                            mtxPivot: {
                                rotation: {
                                    y: animseq
                                }
                            }
                        }
                    }
                ]
            }
        };
        let animation = new ƒ.Animation("testAnimation", animStructure, 30);
        let cmpAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE.LOOP, ƒ.ANIMATION_PLAYBACK.TIMEBASED_CONTINOUS);
        enemy.addComponent(cmpAnimator);
        cmpAnimator.activate(true);
    }
    function update(_event) {
        control();
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function hndMouse(e) {
        vctMouse.x = 2 * (e.clientX / window.innerWidth) - 1;
        vctMouse.y = 2 * (e.clientY / window.innerHeight) - 1;
    }
    function control() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
            cmpEngine.thrust();
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
            cmpEngine.backwards();
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
            cmpEngine.roll(-5);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
            cmpEngine.roll(5);
        }
        cmpEngine.pitch(vctMouse.y);
        cmpEngine.yaw(vctMouse.x);
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class SensorScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(SensorScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    //ƒ.Debug.log(this.message, this.node);
                    this.node.addEventListener("renderPrepare" /* ƒ.EVENT.RENDER_PREPARE */, this.update);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    break;
            }
        };
        // protected reduceMutator(_mutator: ƒ.Mutator): void {
        //   // delete properties that should not be mutated
        //   // undefined properties and private fields (#) will not be included by default
        // }
        update = (_event) => {
            let sensorPos = this.node.getParent();
            if (!Script.terrainMesh) {
                return;
            }
            let info = Script.terrainMesh.getTerrainInfo(sensorPos.mtxWorld.translation, Script.cmpMeshTerrain.mtxWorld);
            if (info.distance < 0) {
                this.node.dispatchEvent(new Event("SensorHit", { bubbles: true }));
            }
        };
    }
    Script.SensorScript = SensorScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class SpaceShipControls extends fc.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = fc.Component.registerSubclass(SpaceShipControls);
        // Properties may be mutated by users in the editor via the automatically created user interface
        rigidbody;
        power = 15000000;
        constructor() {
            super();
            // Don't start when running in editor
            if (fc.Project.mode == fc.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* fc.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* fc.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* fc.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* fc.EVENT.COMPONENT_ADD */:
                    //ƒ.Debug.log(this.message, this.node);
                    this.node.addEventListener("renderPrepare" /* fc.EVENT.RENDER_PREPARE */, this.update);
                    break;
                case "componentRemove" /* fc.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* fc.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* fc.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* fc.EVENT.NODE_DESERIALIZED */:
                    this.audioCrash = new fc.Audio("./sound/crash_augh.mp3");
                    this.node.addComponent(new fc.ComponentAudio(this.audioCrash));
                    this.rigidbody = this.node.getComponent(fc.ComponentRigidbody);
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    this.rigidbody.addEventListener("ColliderEnteredCollision" /* fc.EVENT_PHYSICS.COLLISION_ENTER */, this.hndCollision);
                    this.node.addEventListener("SensorHit", this.hndCollision);
                    break;
            }
        };
        audioCrash;
        hndCollision = () => {
            console.log("boom");
            let audioComp = this.node.getComponent(fc.ComponentAudio);
            audioComp.play(true);
            audioComp.volume = 2;
            let ufo = Script.branch.getChildrenByName("Enemy_ships")[0].getChildrenByName("enemy_pos")[0].getChildrenByName("enemy")[0];
            ufo.getComponent(fc.ComponentAnimator).activate(false);
        };
        // protected reduceMutator(_mutator: ƒ.Mutator): void {
        //   // delete properties that should not be mutated
        //   // undefined properties and private fields (#) will not be included by default
        // }
        update = (_event) => {
            if (!Script.gameState) {
                return;
            }
            Script.gameState.height = this.node.mtxWorld.translation.y;
            Script.gameState.velocity = 1;
        };
        yaw(_value) {
            this.rigidbody.applyTorque(fc.Vector3.SCALE(this.node.mtxWorld.getY(), _value * -10));
        }
        pitch(_value) {
            this.rigidbody.applyTorque(fc.Vector3.SCALE(this.node.mtxWorld.getX(), _value * -5));
        }
        roll(_value) {
            this.rigidbody.applyTorque(fc.Vector3.SCALE(this.node.mtxWorld.getZ(), -_value));
        }
        backwards() {
            this.rigidbody.applyForce(fc.Vector3.SCALE(this.node.mtxWorld.getZ(), this.power));
        }
        thrust() {
            this.rigidbody.applyForce(fc.Vector3.SCALE(this.node.mtxWorld.getZ(), -this.power));
        }
    }
    Script.SpaceShipControls = SpaceShipControls;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    var ƒAid = FudgeAid;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["ATTACK"] = 1] = "ATTACK";
    })(JOB || (JOB = {}));
    class StateMachine extends ƒAid.ComponentStateMachine {
        static iSubclass = fc.Component.registerSubclass(StateMachine);
        static instructions = StateMachine.get();
        torqueIdle = 5;
        turretJoint;
        constructor() {
            super();
            this.instructions = StateMachine.instructions; // setup instructions with the static set
            // Don't start when running in editor
            if (fc.Project.mode == fc.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* fc.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* fc.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* fc.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = StateMachine.transitDefault;
            setup.actDefault = StateMachine.actDefault;
            setup.setAction(JOB.IDLE, this.actIdle);
            setup.setAction(JOB.ATTACK, this.actAttack);
            return setup;
        }
        static transitDefault(_machine) {
            console.log("Transit to", _machine.stateNext);
        }
        static async actDefault(_machine) {
        }
        static async actAttack(_machine) {
            console.log("Attack");
        }
        static async actIdle(_machine) {
            _machine.turretJoint.mtxLocal.rotateY(1);
            StateMachine.actDefault(_machine);
            let distance = fc.Vector3.DIFFERENCE(Script.ship.mtxWorld.translation, _machine.node.mtxWorld.translation);
            if (distance.magnitude < 5) {
                _machine.transit(JOB.ATTACK);
            }
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* fc.EVENT.COMPONENT_ADD */:
                    fc.Loop.addEventListener("loopFrame" /* fc.EVENT.LOOP_FRAME */, this.update);
                    this.transit(JOB.IDLE);
                    break;
                case "componentRemove" /* fc.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* fc.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* fc.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    fc.Loop.removeEventListener("loopFrame" /* fc.EVENT.LOOP_FRAME */, this.update);
                    break;
                case "nodeDeserialized" /* fc.EVENT.NODE_DESERIALIZED */:
                    this.turretJoint = this.node.getChild(0);
                    break;
            }
        };
        update = (_event) => {
            this.act();
        };
    }
    Script.StateMachine = StateMachine;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
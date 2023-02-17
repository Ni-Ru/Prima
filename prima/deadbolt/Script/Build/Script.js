"use strict";
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let cmpAnimator;
    Script.xSpeed = 0;
    let directionRight = true;
    Script.usedStairs = false;
    Script.weapon = "knife";
    class CharacterComponent extends fc.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = fc.Component.registerSubclass(CharacterComponent);
        // Properties may be mutated by users in the editor via the automatically created user interface
        constructor() {
            super();
            // Don't start when running in editor
            if (fc.Project.mode == fc.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        walkSpeed = 0;
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        update(deltaTime) {
            this.node.getParent().mtxLocal.translateX(Script.xSpeed * deltaTime, true);
        }
        walk(direction) {
            Script.xSpeed = Script.walkSpeed * direction;
            if (direction > 0) {
                if (!directionRight) {
                    this.node.mtxLocal.rotateY(180);
                }
                directionRight = true;
            }
            else if (direction < 0) {
                if (directionRight) {
                    this.node.mtxLocal.rotateY(180);
                }
                directionRight = false;
            }
        }
        initAnim(enter) {
            let animseqEnter = new fc.AnimationSequence();
            animseqEnter.addKey(new fc.AnimationKey(0, 1));
            animseqEnter.addKey(new fc.AnimationKey(500, 0));
            let animStructureEnter = {
                components: {
                    ComponentMaterial: [
                        {
                            "fc.ComponentMaterial": {
                                clrPrimary: {
                                    a: animseqEnter
                                }
                            }
                        }
                    ]
                }
            };
            let animseqLeave = new fc.AnimationSequence();
            animseqLeave.addKey(new fc.AnimationKey(0, 0));
            animseqLeave.addKey(new fc.AnimationKey(500, 1));
            let animStructureLeave = {
                components: {
                    ComponentMaterial: [
                        {
                            "fc.ComponentMaterial": {
                                clrPrimary: {
                                    a: animseqLeave
                                }
                            }
                        }
                    ]
                }
            };
            let animationEnter = new ƒ.Animation("enterStairs", animStructureEnter, 30);
            let animationLeave = new ƒ.Animation("leaveStairs", animStructureLeave, 30);
            if (enter) {
                cmpAnimator = new ƒ.ComponentAnimator(animationEnter, ƒ.ANIMATION_PLAYMODE.PLAYONCE, ƒ.ANIMATION_PLAYBACK.TIMEBASED_CONTINOUS);
            }
            else {
                cmpAnimator = new ƒ.ComponentAnimator(animationLeave, ƒ.ANIMATION_PLAYMODE.PLAYONCE, ƒ.ANIMATION_PLAYBACK.TIMEBASED_CONTINOUS);
            }
            this.node.addComponent(cmpAnimator);
            cmpAnimator.activate(true);
        }
        useStairs(exit, stairInteract) {
            this.walk(0);
            this.initAnim(true);
            Script.allowInputs = false;
            setTimeout(() => {
                Script.characterPos.mtxLocal.translateY(exit);
                this.node.removeComponent(cmpAnimator);
                this.initAnim(false);
                if (stairInteract) {
                    stairInteract.noInteract();
                }
                setTimeout(() => {
                    this.node.removeComponent(cmpAnimator);
                    Script.allowInputs = true;
                }, 500);
            }, 500);
        }
        changeWeapon() {
            this.node.dispatchEvent(new Event("playSound", { bubbles: true }));
            if (Script.weapon === "knife") {
                Script.weapon = "stones";
                window.removeEventListener("click", Script.hndAttack);
                document.getElementById("knife").removeAttribute("class");
                document.getElementById("stones").setAttribute("class", "selected");
                document.getElementById("stoneImgs").setAttribute("class", "selected");
            }
            else {
                Script.weapon = "knife";
                window.addEventListener("click", Script.hndAttack);
                document.getElementById("stones").removeAttribute("class");
                document.getElementById("stoneImgs").removeAttribute("class");
                document.getElementById("knife").setAttribute("class", "selected");
            }
        }
        hndThrow(e) {
            if (Script.weapon === "stones" && Script.gameState.stones > 0) {
                let vctMouse = new fc.Vector2();
                vctMouse.x = 2 * (e.clientX / window.innerWidth) - 1;
                vctMouse.y = 2 * (e.clientY / window.innerHeight) - 1;
                let newStone = new Script.StoneNode(vctMouse);
                let items = Script.branch.getChildrenByName("environment")[0].getChildrenByName("items")[0];
                items.addChild(newStone);
                Script.gameState.stones -= 1;
                Script.gameState.stoneAmount(Script.gameState.stones, true);
            }
        }
        setSprite(sprite) {
            if (Script.currentAnimation !== sprite) {
                Script.characterSprite.showFrame(0);
                Script.characterSprite.setAnimation(sprite);
                Script.characterSprite.framerate = 12;
                Script.currentAnimation = sprite;
            }
        }
    }
    Script.CharacterComponent = CharacterComponent;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let doorTransform;
    let doorRigidBody;
    class DoorComponent extends fc.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = fc.Component.registerSubclass(DoorComponent);
        constructor() {
            super();
            // Don't start when running in editor
            if (fc.Project.mode == fc.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        openDoorVar = false;
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        getOpenDoorVar() {
            return this.openDoorVar;
        }
        interaction() {
            doorTransform = this.node.getComponent(fc.ComponentTransform);
            doorRigidBody = this.node.getComponent(fc.ComponentRigidbody);
            switch (this.openDoorVar) {
                case true:
                    this.closeDoor();
                    this.openDoorVar = false;
                    break;
                case false:
                    this.openDoor();
                    this.openDoorVar = true;
                    Script.allowWalkLeft = true;
                    Script.allowWalkRight = true;
                    break;
            }
        }
        loadTextures(closed) {
            let openDoorImage = new fc.TextureImage();
            let closedDoorImage = new fc.TextureImage();
            let openMaterial = new fc.Material("openDoorMat", fc.ShaderLitTextured);
            let openDoorCoat = new fc.CoatTextured(undefined, openDoorImage);
            let closedDoorCoat = new fc.CoatTextured(undefined, closedDoorImage);
            openDoorImage.load("./imgs/openDoor.gif");
            closedDoorImage.load("./imgs/closedDoor.gif");
            if (closed) {
                openMaterial.coat = closedDoorCoat;
            }
            else {
                openMaterial.coat = openDoorCoat;
            }
            let cmpTextureNode = this.node.getChildrenByName("DoorTexture")[0];
            let cmpMat = cmpTextureNode.getComponent(fc.ComponentMaterial);
            cmpMat.material = openMaterial;
        }
        openDoor() {
            doorRigidBody.activate(false);
            doorTransform.mtxLocal.translateX(0.25);
            doorTransform.mtxLocal.scaleX(3);
            this.loadTextures(false);
        }
        closeDoor() {
            doorRigidBody.activate(true);
            doorTransform.mtxLocal.scaleX(1 / 3);
            doorTransform.mtxLocal.translateX(-0.25);
            this.loadTextures(true);
        }
    }
    Script.DoorComponent = DoorComponent;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fAid = FudgeAid;
    var fc = FudgeCore;
    class EnemyNode extends fAid.NodeSprite {
        constructor() {
            super("EnemyNode");
            let EnemyImage = new fc.TextureImage();
            let enemyTransform = new fc.ComponentTransform();
            let Material = new fc.Material("enemyMat", fc.ShaderLitTextured);
            let enemyCoat = new fc.CoatTextured(undefined, EnemyImage);
            let stateMachine = new Script.EnemyStateMachine();
            this.addComponent(enemyTransform);
            this.addComponent(new Script.GravityComponent);
            this.addComponent(new Script.InteractComponent);
            this.addComponent(stateMachine);
            EnemyImage.load("./imgs/enemySprite.gif");
            Material.coat = enemyCoat;
            enemyTransform.mtxLocal.translateY(0.5);
            enemyTransform.mtxLocal.scaleX(0.5);
            let cmpMat = this.getComponent(fc.ComponentMaterial);
            cmpMat.material = Material;
            new fc.CoatTextured();
        }
    }
    Script.EnemyNode = EnemyNode;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    var fcAid = FudgeAid;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["SEARCH"] = 1] = "SEARCH";
        JOB[JOB["ATTACK"] = 2] = "ATTACK";
    })(JOB || (JOB = {}));
    class EnemyStateMachine extends fcAid.ComponentStateMachine {
        static iSubclass = fc.Component.registerSubclass(EnemyStateMachine);
        static instructions = EnemyStateMachine.get();
        enemy;
        enemySpeed = 0.05;
        //private directionRight: boolean;
        constructor() {
            super();
            this.instructions = EnemyStateMachine.instructions; // setup instructions with the static set
            // Don't start when running in editor
            if (fc.Project.mode == fc.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        static get() {
            let setup = new fcAid.StateMachineInstructions();
            setup.transitDefault = EnemyStateMachine.transitDefault;
            setup.actDefault = EnemyStateMachine.actDefault;
            setup.setAction(JOB.IDLE, this.actIdle);
            setup.setAction(JOB.SEARCH, this.actSearch);
            setup.setAction(JOB.ATTACK, this.actAttack);
            return setup;
        }
        static transitDefault(_machine) {
            console.log("Transit to", _machine.stateNext);
        }
        static async actDefault(_machine) {
            _machine.transit(JOB.IDLE);
        }
        static async actIdle(_machine) {
            _machine.checkView();
        }
        static async actSearch(_machine) {
            //console.log("search");
            // let distance: fc.Vector3 = fc.Vector3.DIFFERENCE(characterSprite.getParent().mtxWorld.translation, _machine.node.mtxWorld.translation);
            // if (distance.magnitude < 10)
            //   _machine.transit(JOB.ATTACK);
        }
        static async actAttack(_machine) {
            let distance = fc.Vector3.DIFFERENCE(Script.characterSprite.mtxWorld.translation, _machine.node.mtxWorld.translation);
            distance.normalize(1);
            let distanceX = _machine.enemySpeed * Math.abs(distance.x);
            _machine.enemy.getParent().mtxLocal.translateX(-1 * distanceX);
            _machine.checkView();
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    this.enemy = this.node;
                    this.transit(JOB.IDLE);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    fc.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    this.transit(JOB.IDLE);
                    break;
            }
        };
        update = (_event) => {
            this.act();
        };
        checkView = () => {
            let direction = new fc.Vector3(1, 0, 0);
            if (this.enemy.getParent().mtxLocal.rotation.y === 0) {
                direction = new fc.Vector3(-1, 0, 0);
            }
            let raycast = fc.Physics.raycast(this.enemy.mtxWorld.translation, direction, 7, true);
            if (raycast.hit) {
                if (raycast.rigidbodyComponent.node.name === "character") {
                    this.transit(JOB.ATTACK);
                }
                else {
                    this.transit(JOB.IDLE);
                }
            }
            else {
                this.transit(JOB.IDLE);
            }
        };
    }
    Script.EnemyStateMachine = EnemyStateMachine;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    var fui = FudgeUserInterface;
    class GameState extends f.Mutable {
        reduceMutator(_Mutator) { }
        stones;
        controller;
        stoneAmount(stones, reset) {
            if (reset) {
                document.getElementById("stoneImgs").innerHTML = "";
            }
            for (let i = 0; i < stones; i++) {
                let stoneImg = document.createElement("IMG");
                stoneImg.setAttribute("src", "./imgs/stone.gif");
                document.getElementById("stoneImgs").appendChild(stoneImg);
            }
        }
        constructor(_config) {
            super();
            this.stones = _config.stones;
            this.controller = new fui.Controller(this, document.getElementById("vui"));
            console.log(this.controller);
        }
    }
    Script.GameState = GameState;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    const gravity = -80;
    let ySpeed = 0;
    let velocityY = 0;
    let interactCmp;
    class GravityComponent extends fc.ComponentScript {
        static iSubclass = fc.Component.registerSubclass(GravityComponent);
        constructor() {
            super();
            // Don't start when running in editor
            if (fc.Project.mode == fc.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        walkSpeed = 0;
        pos;
        characterPos;
        obstaclePos;
        obstacleNode;
        obstacleMesh;
        obstacleLength;
        obstacleHeight;
        obstacleNodePos;
        obstacleCalcPos;
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    this.characterPos = this.node.getParent();
                    // this.floors = branch.getChildrenByName("environment")[0].getChildrenByName("floors")[0].getChildrenByName("floor_Pos");
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        update(deltaTime) {
            this.characterPos = this.node.getParent();
            velocityY += gravity * deltaTime;
            ySpeed = velocityY * deltaTime;
            this.checkCollission();
            this.characterPos.mtxLocal.translateY(ySpeed, true);
        }
        checkCollission() {
            this.characterPos = this.node.getParent();
            let floors = Script.branch.getChildrenByName("environment")[0].getChildrenByName("floors")[0].getChildrenByName("floor_Pos");
            let walls = Script.branch.getChildrenByName("environment")[0].getChildrenByName("walls")[0].getChildrenByName("wall_Pos");
            let doors = Script.branch.getChildrenByName("environment")[0].getChildrenByName("doors")[0].getChildrenByName("door_Pos");
            let stairs = Script.branch.getChildrenByName("environment")[0].getChildrenByName("stairs")[0].getChildrenByName("stair_Pos");
            let obstacles = [floors, walls, doors, stairs];
            this.pos = this.characterPos.mtxLocal.translation;
            for (let obstacleType of obstacles) {
                for (let obstacle of obstacleType) {
                    this.obstaclePos = obstacle.mtxLocal.translation;
                    this.obstacleNode = obstacle.getChildren()[0];
                    this.obstacleMesh = this.obstacleNode.getComponent(fc.ComponentMesh);
                    this.obstacleLength = this.obstacleMesh.mtxPivot.getX().x;
                    this.obstacleHeight = this.obstacleMesh.mtxPivot.getY().y;
                    this.obstacleNodePos = this.obstacleNode.mtxLocal.translation;
                    this.obstacleCalcPos = fc.Vector3.SUM(this.obstaclePos, this.obstacleNodePos);
                    interactCmp = this.obstacleNode.getComponent(Script.InteractComponent);
                    switch (obstacle.name) {
                        case "floor_Pos":
                            this.yCollission();
                            break;
                        default:
                            if ((Math.abs(this.pos.y - ((this.obstaclePos.y + 0.5) + ((this.obstacleHeight / 2) - 1)))) < (this.obstacleHeight / 2) + 0.5) {
                                if (Math.abs(this.pos.x - this.obstaclePos.x) < 2) {
                                    switch (obstacle.name) {
                                        case "door_Pos":
                                            interactCmp.update(this);
                                            break;
                                        case "stair_Pos":
                                            interactCmp.update(this);
                                            break;
                                        default:
                                            this.wallCollission();
                                            break;
                                    }
                                }
                            }
                    }
                }
            }
        }
        wallCollission() {
            let nodeName = this.node.name;
            if (Math.abs(this.pos.x - this.obstaclePos.x) <= (this.obstacleLength / 2) + 0.25) {
                if (this.pos.x > this.obstaclePos.x) {
                    if (nodeName === "character") {
                        Script.allowWalkLeft = false;
                    }
                    this.pos.x = this.obstaclePos.x + (this.obstacleLength / 2) + 0.25;
                    this.characterPos.mtxLocal.translation = this.pos;
                }
                else {
                    if (nodeName === "character") {
                        Script.allowWalkRight = false;
                    }
                    this.pos.x = this.obstaclePos.x - (this.obstacleLength / 2) - 0.25;
                    this.characterPos.mtxLocal.translation = this.pos;
                }
            }
            else {
                if (nodeName === "character") {
                    Script.allowWalkLeft = true;
                    Script.allowWalkRight = true;
                }
            }
        }
        yCollission() {
            if (Math.abs(this.pos.x - this.obstacleCalcPos.x) < (this.obstacleLength / 2) + 0.2) {
                if (Math.abs(this.pos.y - this.obstaclePos.y) < 1) {
                    if (this.pos.y <= this.obstaclePos.y) {
                        ySpeed = 0;
                        velocityY = 0;
                        this.pos.y = this.obstaclePos.y;
                        this.node.getParent().mtxLocal.translation = this.pos;
                    }
                }
            }
        }
    }
    Script.GravityComponent = GravityComponent;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let DoorCmp;
    let StairCmp;
    class InteractComponent extends fc.ComponentScript {
        static iSubclass = fc.Component.registerSubclass(InteractComponent);
        constructor() {
            super();
            // Don't start when running in editor
            if (fc.Project.mode == fc.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        keyEPressed = true;
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        update(entityGravityCmp) {
            DoorCmp = this.node.getComponent(Script.DoorComponent);
            StairCmp = this.node.getComponent(Script.StairComponent);
            this.checkPlayerPos(entityGravityCmp);
        }
        actionControls() {
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.E])) {
                if (Script.allowInputs) {
                    if (!this.keyEPressed) {
                        this.keyEPressed = true;
                        switch (this.node.name) {
                            case "Door":
                                DoorCmp.interaction();
                                break;
                            case "Stair":
                                if (!Script.usedStairs) {
                                    StairCmp.interaction();
                                    Script.usedStairs = true;
                                }
                                break;
                        }
                    }
                }
            }
            else {
                Script.usedStairs = false;
                this.keyEPressed = false;
            }
        }
        showInteract(entityGravityCmp) {
            let nodeName = entityGravityCmp.node.name;
            if (nodeName === "character") {
                this.node.getComponent(fc.ComponentMaterial).clrPrimary.a = 1;
            }
            if (DoorCmp) {
                if (!DoorCmp.getOpenDoorVar()) {
                    entityGravityCmp.wallCollission();
                }
            }
        }
        noInteract() {
            this.node.getComponent(fc.ComponentMaterial).clrPrimary.a = 0;
        }
        checkPlayerPos(entityGravityCmp) {
            let playerPos = entityGravityCmp.node.getParent().mtxLocal.translation;
            let interactablePos = this.node.getParent().mtxLocal.translation;
            if (StairCmp) {
                if (Math.abs(playerPos.x - interactablePos.x) < 0.3) {
                    this.showInteract(entityGravityCmp);
                    this.actionControls();
                }
                else {
                    this.noInteract();
                }
            }
            else {
                if (Math.abs(playerPos.x - interactablePos.x) < 1) {
                    this.showInteract(entityGravityCmp);
                    this.actionControls();
                }
                else {
                    this.noInteract();
                }
            }
        }
    }
    Script.InteractComponent = InteractComponent;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    var fcAid = FudgeAid;
    let viewport;
    let cmpCamera;
    let enemyNodes;
    let characterTransform;
    let imgSpriteSheet = new ƒ.TextureImage();
    let imgSpriteSheetWalk = new ƒ.TextureImage();
    let imgSpriteSheetAttack = new ƒ.TextureImage();
    let idleCoat;
    let walkingCoat;
    let attackingCoat;
    Script.walkSpeed = 3;
    Script.allowWalkRight = true;
    Script.allowWalkLeft = true;
    Script.allowInputs = true;
    Script.attackingMotion = false;
    let config;
    let spacePressed = false;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        fetchData();
        setup(_event);
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        fc.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    async function fetchData() {
        let response = await fetch("config.json");
        config = await response.json();
        Script.gameState = new Script.GameState(config);
        Script.gameState.stoneAmount(Script.gameState.stones, false);
    }
    function setup(_event) {
        viewport = _event.detail;
        Script.branch = viewport.getBranch();
        loadSprites();
        loadCharacter();
        Script.branch.addEventListener("playSound", hndPlaySound);
        Script.branch.addComponent(new fc.ComponentAudio());
        enemyNodes = Script.branch.getChildrenByName("enemies")[0].getChildrenByName("enemy_Pos");
        for (let enemy of enemyNodes) {
            let newEnemy = new Script.EnemyNode();
            enemy.appendChild(newEnemy);
        }
        cmpCamera = viewport.camera;
        cmpCamera.mtxPivot.rotateY(180);
        cmpCamera.mtxPivot.translation = new fc.Vector3(0, 0, 15);
        window.addEventListener("mousedown", hndAim);
        window.addEventListener("mouseup", (e) => {
            if (e.button === 2) {
                window.removeEventListener("click", Script.characterCmp.hndThrow);
                document.body.style.cursor = "default";
            }
        });
        window.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
        window.addEventListener("click", hndAttack);
    }
    function update(_event) {
        Script.deltaTime = fc.Loop.timeFrameGame / 1000;
        Script.characterCmp.update(Script.deltaTime);
        Script.gravityCmp.update(Script.deltaTime);
        for (let enemy of enemyNodes) {
            enemy.getChild(0).getComponent(Script.GravityComponent).update(Script.deltaTime);
        }
        viewport.physicsDebugMode = 2;
        controls();
        fc.Physics.simulate(); // if physics is included and used
        viewport.draw();
        updateCamera();
        fc.AudioManager.default.update();
    }
    function loadCharacter() {
        loadSprites();
        Script.characterSprite = new fcAid.NodeSprite("character");
        Script.characterSprite.addComponent(new fc.ComponentTransform(new fc.Matrix4x4()));
        characterTransform = Script.characterSprite.getComponent(fc.ComponentTransform);
        characterTransform.mtxLocal.scaleX(0.5);
        characterTransform.mtxLocal.translateY(0.5);
        Script.currentAnimation = Script.idle;
        Script.characterPos = Script.branch.getChildrenByName("Player")[0].getChildrenByName("character_Pos")[0];
        Script.characterPos.appendChild(Script.characterSprite);
        Script.characterSprite.addComponent(new Script.CharacterComponent);
        Script.characterSprite.addComponent(new Script.GravityComponent);
        let characterRigidBody = new fc.ComponentRigidbody();
        characterRigidBody.typeBody = fc.BODY_TYPE.KINEMATIC;
        characterRigidBody.mtxPivot.translateY(-0.2);
        Script.characterSprite.addComponent(characterRigidBody);
        Script.characterCmp = Script.characterSprite.getComponent(Script.CharacterComponent);
        Script.gravityCmp = Script.characterSprite.getComponent(Script.GravityComponent);
    }
    async function loadSprites() {
        await imgSpriteSheet.load("./imgs/Idle.png");
        idleCoat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        await imgSpriteSheetWalk.load("./imgs/Walk.png");
        walkingCoat = new ƒ.CoatTextured(undefined, imgSpriteSheetWalk);
        await imgSpriteSheetAttack.load("./imgs/Attack.png");
        attackingCoat = new ƒ.CoatTextured(undefined, imgSpriteSheetAttack);
        Script.idle = new fcAid.SpriteSheetAnimation("Idle", idleCoat);
        Script.idle.generateByGrid(ƒ.Rectangle.GET(0, 0, 96, 96), 5, 65, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(96));
        Script.walk = new fcAid.SpriteSheetAnimation("Walk", walkingCoat);
        Script.walk.generateByGrid(ƒ.Rectangle.GET(0, 0, 96, 96), 8, 65, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(96));
        Script.attack = new fcAid.SpriteSheetAnimation("Attack", attackingCoat);
        Script.attack.generateByGrid(ƒ.Rectangle.GET(0, 0, 96, 96), 4, 65, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(96));
        Script.characterSprite.mtxLocal.translateY(0.12);
        Script.characterSprite.mtxLocal.scaleX(1.3);
        Script.currentAnimation = Script.idle;
        Script.characterSprite.setAnimation(Script.currentAnimation);
        Script.characterSprite.setFrameDirection(1);
        Script.characterSprite.framerate = 12;
    }
    function hndPlaySound(e) {
        e.currentTarget;
        let audioComp = Script.branch.getComponent(fc.ComponentAudio);
        let inventorySound = new fc.Audio("./sounds/cloth-inventory.wav");
        let stoneSound = new fc.Audio("./sounds/stone.mp3");
        if (e.target == Script.characterSprite) {
            audioComp.setAudio(inventorySound);
            audioComp.volume = 0.5;
        }
        else {
            audioComp.setAudio(stoneSound);
            audioComp.volume = 1.5;
        }
        audioComp.play(true);
    }
    function controls() {
        if (Script.allowInputs) {
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.D])) {
                if (Script.allowWalkRight) {
                    Script.characterCmp.setSprite(Script.walk);
                    Script.characterCmp.walk(1);
                }
            }
            else if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A])) {
                if (Script.allowWalkLeft) {
                    Script.characterCmp.setSprite(Script.walk);
                    Script.characterCmp.walk(-1);
                }
            }
            else if (!fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.D])) {
                if (!Script.attackingMotion) {
                    Script.characterCmp.setSprite(Script.idle);
                }
                Script.characterCmp.walk(0);
            }
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE])) {
                if (!spacePressed) {
                    spacePressed = true;
                    Script.characterCmp.changeWeapon();
                }
            }
            else {
                spacePressed = false;
            }
        }
    }
    function hndAttack() {
        Script.attackingMotion = true;
        Script.characterCmp.setSprite(Script.attack);
        setTimeout(() => {
            Script.attackingMotion = false;
        }, 400);
    }
    Script.hndAttack = hndAttack;
    function hndAim(e) {
        if (Script.weapon === "stones") {
            if (e.button === 2) {
                document.body.style.cursor = "crosshair";
                window.addEventListener("click", Script.characterCmp.hndThrow);
            }
        }
    }
    function updateCamera() {
        let pos = Script.characterSprite.getParent().mtxLocal.translation;
        let origin = cmpCamera.mtxPivot.translation;
        cmpCamera.mtxPivot.translation = new fc.Vector3(pos.x, pos.y + 1, origin.z);
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class StairComponent extends fc.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = fc.Component.registerSubclass(StairComponent);
        constructor() {
            super();
            // Don't start when running in editor
            if (fc.Project.mode == fc.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        activeStairNodePos;
        activeStairPos;
        calcActiveStairPos;
        StairNodePos;
        StairNode;
        StairPos;
        calcStairPos;
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        interaction() {
            this.findDoor();
        }
        findDoor() {
            this.activeStairNodePos = this.node.mtxLocal.translation;
            this.activeStairPos = this.node.getParent().mtxLocal.translation;
            this.calcActiveStairPos = fc.Vector3.SUM(this.activeStairNodePos, this.activeStairPos);
            let stairs = Script.branch.getChildrenByName("environment")[0].getChildrenByName("stairs")[0].getChildrenByName("stair_Pos");
            for (let stair of stairs) {
                this.StairPos = stair.mtxLocal.translation;
                this.StairNode = stair.getChild(0);
                this.StairNodePos = this.StairNode.mtxLocal.translation;
                this.calcStairPos = fc.Vector3.SUM(this.StairNodePos, this.StairPos);
                if (Math.abs(this.calcStairPos.x - this.calcActiveStairPos.x) < 1) {
                    if (Math.abs(this.calcStairPos.y - this.calcActiveStairPos.y) > 1) {
                        if (Script.allowWalkLeft || Script.allowWalkRight) {
                            Script.characterCmp.useStairs(this.calcStairPos.y - this.calcActiveStairPos.y, this.node.getComponent(Script.InteractComponent));
                        }
                    }
                }
            }
        }
    }
    Script.StairComponent = StairComponent;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fAid = FudgeAid;
    var fc = FudgeCore;
    class StoneNode extends fAid.NodeSprite {
        stoneDirection;
        constructor(_stoneDirection) {
            super("stone");
            this.stoneDirection = _stoneDirection;
            let Material = new fc.Material("stoneMat", fc.ShaderLitTextured);
            let StoneImage = new fc.TextureImage();
            StoneImage.load("./imgs/stone.gif");
            let stoneCoat = new fc.CoatTextured(undefined, StoneImage);
            Material.coat = stoneCoat;
            let stoneTransform = new fc.ComponentTransform();
            this.addComponent(stoneTransform);
            let stoneRigid = new fc.ComponentRigidbody(10, fc.BODY_TYPE.DYNAMIC, fc.COLLIDER_TYPE.CUBE, fc.COLLISION_GROUP.DEFAULT);
            this.addComponent(stoneRigid);
            let characterPosTrans = Script.characterPos.mtxWorld.translation;
            characterPosTrans.y += 0.5;
            let scaleVec = new fc.Vector3(0.2, 0.15, 0.5);
            stoneTransform.mtxLocal.translate(characterPosTrans);
            stoneTransform.mtxLocal.translateZ(0.1);
            stoneTransform.mtxLocal.scale(scaleVec);
            let forceVector = new fc.Vector3(1000, 1000, 0);
            forceVector.x = this.stoneDirection.x;
            forceVector.y = -this.stoneDirection.y;
            forceVector.scale(5000);
            stoneRigid.applyForce(forceVector);
            stoneRigid.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.hndCollision);
            let cmpMat = this.getComponent(fc.ComponentMaterial);
            cmpMat.material = Material;
            new fc.CoatTextured();
        }
        hndCollision = () => {
            this.dispatchEvent(new Event("playSound", { bubbles: true }));
        };
    }
    Script.StoneNode = StoneNode;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
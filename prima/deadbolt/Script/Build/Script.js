"use strict";
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    Script.xSpeed = 0;
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
        characterPos;
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
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        update(deltaTime) {
            this.characterPos.mtxLocal.translateX(Script.xSpeed * deltaTime, true);
        }
        walk(direction) {
            Script.xSpeed = Script.walkSpeed * direction;
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
    Script.openDoor = false;
    let doorTransform;
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
            doorTransform = this.node.getComponent(fc.ComponentTransform);
            switch (Script.openDoor) {
                case true:
                    this.closeDoor();
                    Script.openDoor = false;
                    break;
                case false:
                    this.openDoor();
                    Script.openDoor = true;
                    Script.allowWalkLeft = true;
                    Script.allowWalkRight = true;
                    break;
            }
        }
        openDoor() {
            doorTransform.mtxLocal.translateX(0.25);
            doorTransform.mtxLocal.scaleX(3);
            doorTransform.mtxLocal.translateZ(-0.1);
        }
        closeDoor() {
            doorTransform.mtxLocal.scaleX(1 / 3);
            doorTransform.mtxLocal.translateX(-0.25);
            doorTransform.mtxLocal.translateZ(0.1);
        }
    }
    Script.DoorComponent = DoorComponent;
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
            velocityY += gravity * deltaTime;
            ySpeed = velocityY * deltaTime;
            this.characterPos.mtxLocal.translateY(ySpeed, true);
            this.checkCollission();
        }
        checkCollission() {
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
                            if (Math.abs(this.pos.y - this.obstacleCalcPos.y) <= (this.obstacleHeight / 2)) {
                                if (Math.abs(this.pos.x - this.obstaclePos.x) < 2) {
                                    switch (obstacle.name) {
                                        case "door_Pos":
                                            interactCmp.update();
                                            if (!Script.openDoor) {
                                                this.wallCollission();
                                            }
                                            break;
                                        case "stair_Pos":
                                            interactCmp.update();
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
            if (Math.abs(this.pos.x - this.obstaclePos.x) <= (this.obstacleLength / 2) + 0.25) {
                if (this.pos.x > this.obstaclePos.x) {
                    Script.allowWalkLeft = false;
                    this.pos.x = this.obstaclePos.x + (this.obstacleLength / 2) + 0.25;
                    this.characterPos.mtxLocal.translation = this.pos;
                }
                else {
                    Script.allowWalkRight = false;
                    this.pos.x = this.obstaclePos.x - (this.obstacleLength / 2) - 0.25;
                    this.characterPos.mtxLocal.translation = this.pos;
                }
            }
            else {
                Script.allowWalkLeft = true;
                Script.allowWalkRight = true;
            }
        }
        yCollission() {
            if (Math.abs(this.pos.x - this.obstacleCalcPos.x) < (this.obstacleLength / 2) + 0.2) {
                if (Math.abs(this.pos.y - this.obstaclePos.y) < 1) {
                    if (this.pos.y < this.obstaclePos.y) {
                        this.pos.y = this.obstaclePos.y;
                        this.characterPos.mtxLocal.translation = this.pos;
                        ySpeed = 0;
                        velocityY = 0;
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
        keyEPressed = false;
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
        update() {
            this.checkPlayerPos();
            console.log(this.node.name);
        }
        actionControls() {
            DoorCmp = this.node.getComponent(Script.DoorComponent);
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.E])) {
                if (!this.keyEPressed) {
                    this.keyEPressed = true;
                    switch (this.node.name) {
                        case "Door":
                            DoorCmp.interaction();
                            break;
                        case "Stair":
                            Script.openDoor = true;
                            Script.allowWalkLeft = true;
                            Script.allowWalkRight = true;
                            break;
                    }
                }
            }
            else {
                this.keyEPressed = false;
            }
        }
        showInteract() {
            this.node.getComponent(fc.ComponentMaterial).clrPrimary.a = 1;
        }
        noInteract() {
            this.node.getComponent(fc.ComponentMaterial).clrPrimary.a = 0;
        }
        checkPlayerPos() {
            let playerPos = Script.characterNode.getParent().mtxLocal.translation;
            let interactablePos = this.node.getParent().mtxLocal.translation;
            if (Math.abs(playerPos.x - interactablePos.x) < 1) {
                this.showInteract();
                this.actionControls();
            }
            else {
                this.noInteract();
            }
        }
    }
    Script.InteractComponent = InteractComponent;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    Script.walkSpeed = 3;
    Script.allowWalkRight = true;
    Script.allowWalkLeft = true;
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let characterCmp;
    let gravityCmp;
    function start(_event) {
        viewport = _event.detail;
        Script.branch = viewport.getBranch();
        Script.characterNode = Script.branch.getChildrenByName("Player")[0].getChildrenByName("character_Pos")[0].getChildrenByName("Character")[0];
        characterCmp = Script.characterNode.getComponent(Script.CharacterComponent);
        gravityCmp = Script.characterNode.getComponent(Script.GravityComponent);
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        fc.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        let deltaTime = fc.Loop.timeFrameGame / 1000;
        characterCmp.update(deltaTime);
        gravityCmp.update(deltaTime);
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        fc.AudioManager.default.update();
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.D])) {
            if (Script.allowWalkRight) {
                characterCmp.walk(1);
            }
        }
        else if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A])) {
            if (Script.allowWalkLeft) {
                characterCmp.walk(-1);
            }
        }
        else if (!fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.D])) {
            characterCmp.walk(0);
        }
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
            let stairs = Script.branch.getChildrenByName("environment")[0].getChildrenByName("stairs")[0].getChildrenByName("stair_Pos");
            for (let stair of stairs) {
            }
        }
    }
    Script.StairComponent = StairComponent;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
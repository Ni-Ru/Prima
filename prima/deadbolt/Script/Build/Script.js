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
            let obstacles = [floors, walls, doors];
            this.pos = this.characterPos.mtxLocal.translation;
            for (let obstacleType of obstacles) {
                for (let obstacle of obstacleType) {
                    this.obstaclePos = obstacle.mtxLocal.translation;
                    this.obstacleNode = obstacle.getChildren()[0];
                    this.obstacleMesh = this.obstacleNode.getComponent(fc.ComponentMesh);
                    this.obstacleLength = this.obstacleMesh.mtxPivot.getX().x;
                    this.obstacleHeight = this.obstacleMesh.mtxPivot.getY().y;
                    let obstacleNodePos = this.obstacleNode.mtxLocal.translation;
                    let obstacleCalcPos = fc.Vector3.SUM(this.obstaclePos, obstacleNodePos);
                    if (obstacle.name === "floor_Pos") {
                        if (Math.abs(this.pos.x - obstacleCalcPos.x) < (this.obstacleLength / 2) + 0.2) {
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
                    else {
                        if (Math.abs(this.pos.y - obstacleCalcPos.y) <= (this.obstacleHeight / 2)) {
                            if (Math.abs(this.pos.x - this.obstaclePos.x) < 1) {
                                if (obstacle.name === "door_Pos") {
                                    interactCmp = this.obstacleNode.getComponent(Script.InteractComponent);
                                    interactCmp.update();
                                    if (!Script.openDoor) {
                                        this.doorCollission();
                                    }
                                }
                                else {
                                    this.doorCollission();
                                }
                            }
                        }
                    }
                }
            }
        }
        doorCollission() {
            if (Math.abs(this.pos.x - this.obstaclePos.x) <= (this.obstacleLength / 2) + 0.25) {
                if (this.pos.x > this.obstaclePos.x) {
                    Script.allowWalkLeft = false;
                    this.pos.x = this.obstaclePos.x + (this.obstacleLength / 2) + 0.25;
                    this.characterPos.mtxLocal.translation = this.pos;
                }
                else {
                    Script.allowWalkRight = false;
                    console.log(Script.allowWalkRight);
                    this.pos.x = this.obstaclePos.x - (this.obstacleLength / 2) - 0.25;
                    this.characterPos.mtxLocal.translation = this.pos;
                }
            }
            else {
                Script.allowWalkLeft = true;
                Script.allowWalkRight = true;
            }
        }
    }
    Script.GravityComponent = GravityComponent;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    Script.openDoor = false;
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
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.E])) {
                if (!this.keyEPressed) {
                    this.keyEPressed = true;
                    switch (Script.openDoor) {
                        case true:
                            Script.openDoor = false;
                            break;
                        case false:
                            console.log(Script.openDoor);
                            Script.openDoor = true;
                            console.log(Script.openDoor);
                            break;
                    }
                }
            }
            else {
                this.keyEPressed = false;
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
    let characterNode;
    function start(_event) {
        viewport = _event.detail;
        Script.branch = viewport.getBranch();
        characterNode = Script.branch.getChildrenByName("character_Pos")[0].getChildrenByName("Character")[0];
        characterCmp = characterNode.getComponent(Script.CharacterComponent);
        gravityCmp = characterNode.getComponent(Script.GravityComponent);
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
//# sourceMappingURL=Script.js.map
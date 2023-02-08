"use strict";
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    Script.xSpeed = 0;
    Script.usedStairs = false;
    let weapon = "knife";
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
        useStairs(exit) {
            this.characterPos.mtxLocal.translateY(exit);
        }
        changeWeapon() {
            if (weapon === "knife") {
                weapon = "stones";
                document.getElementById("knife").removeAttribute("class");
                document.getElementById("stones").setAttribute("class", "selected");
                document.getElementById("stoneImgs").setAttribute("class", "selected");
            }
            else {
                weapon = "knife";
                document.getElementById("stones").removeAttribute("class");
                document.getElementById("stoneImgs").removeAttribute("class");
                document.getElementById("knife").setAttribute("class", "selected");
            }
        }
        hndThrow(e) {
            if (weapon === "stones" && Script.gameState.stones > 0) {
                console.log(e);
                let newStone = new Script.StoneNode();
                Script.branch.getChildrenByName("environment")[0].getChildrenByName("items")[0].addChild(newStone);
                Script.gameState.stones -= 1;
                Script.gameState.stoneAmount(Script.gameState.stones, true);
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
            velocityY += gravity * deltaTime;
            ySpeed = velocityY * deltaTime;
            this.checkCollission();
            this.characterPos.mtxLocal.translateY(ySpeed, true);
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
                            if ((Math.abs(this.pos.y - ((this.obstaclePos.y + 0.5) + ((this.obstacleHeight / 2) - 1)))) < (this.obstacleHeight / 2) + 0.5) {
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
                    if (this.pos.y <= this.obstaclePos.y) {
                        ySpeed = 0;
                        velocityY = 0;
                        this.pos.y = this.obstaclePos.y;
                        this.characterPos.mtxLocal.translation = this.pos;
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
        update() {
            this.checkPlayerPos();
        }
        actionControls() {
            DoorCmp = this.node.getComponent(Script.DoorComponent);
            StairCmp = this.node.getComponent(Script.StairComponent);
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.E])) {
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
            else {
                Script.usedStairs = false;
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
    let viewport;
    let cmpCamera;
    let gravityCmp;
    Script.walkSpeed = 3;
    Script.allowWalkRight = true;
    Script.allowWalkLeft = true;
    let config;
    Script.vctMouse = fc.Vector2.ZERO();
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
        Script.characterNode = Script.branch.getChildrenByName("Player")[0].getChildrenByName("character_Pos")[0].getChildrenByName("Character")[0];
        Script.characterCmp = Script.characterNode.getComponent(Script.CharacterComponent);
        gravityCmp = Script.characterNode.getComponent(Script.GravityComponent);
        cmpCamera = viewport.camera;
        cmpCamera.mtxPivot.rotateY(180);
        cmpCamera.mtxPivot.translation = new fc.Vector3(0, 0, 40);
        window.addEventListener("click", Script.characterCmp.hndThrow);
        window.addEventListener("mousemove", hndMouse);
    }
    function update(_event) {
        let deltaTime = fc.Loop.timeFrameGame / 1000;
        Script.characterCmp.update(deltaTime);
        gravityCmp.update(deltaTime);
        controls();
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        updateCamera();
        fc.AudioManager.default.update();
    }
    function hndMouse(e) {
        Script.vctMouse.x = 2 * (e.clientX / window.innerWidth) - 1;
        Script.vctMouse.y = 2 * (e.clientY / window.innerHeight) - 1;
    }
    function controls() {
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.D])) {
            if (Script.allowWalkRight) {
                Script.characterCmp.walk(1);
            }
        }
        else if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A])) {
            if (Script.allowWalkLeft) {
                Script.characterCmp.walk(-1);
            }
        }
        else if (!fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.D])) {
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
    function updateCamera() {
        let pos = Script.characterNode.getParent().mtxLocal.translation;
        let origin = cmpCamera.mtxPivot.translation;
        cmpCamera.mtxPivot.translation = new fc.Vector3(pos.x, pos.y, origin.z);
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let InteractCmp;
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
            InteractCmp = this.node.getComponent(Script.InteractComponent);
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
                        console.log(this.calcStairPos.y - this.calcActiveStairPos.y);
                        Script.characterCmp.useStairs(this.calcStairPos.y - this.calcActiveStairPos.y);
                        InteractCmp.noInteract();
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
        constructor() {
            super("stone");
            let Material = new fc.Material("stoneMat", fc.ShaderLitTextured);
            let StoneImage = new fc.TextureImage();
            StoneImage.load("./imgs/stone.gif");
            let stoneCoat = new fc.CoatTextured(undefined, StoneImage);
            Material.coat = stoneCoat;
            let stoneTransform = new fc.ComponentTransform();
            this.addComponent(stoneTransform);
            let stoneRigid = new fc.ComponentRigidbody(2, fc.BODY_TYPE.DYNAMIC, fc.COLLIDER_TYPE.CUBE, fc.COLLISION_GROUP.DEFAULT);
            this.addComponent(stoneRigid);
            let characterPos = Script.characterNode.getParent().mtxWorld.translation;
            let scaleVec = new fc.Vector3(0.4, 0.3, 0.5);
            stoneTransform.mtxLocal.scale(scaleVec);
            stoneTransform.mtxLocal.translate(characterPos);
            console.log(characterPos);
            let cmpMat = this.getComponent(fc.ComponentMaterial);
            cmpMat.material = Material;
            new fc.CoatTextured();
        }
    }
    Script.StoneNode = StoneNode;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
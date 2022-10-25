"use strict";
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
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    const gravity = -2;
    const sprintSpeed = 10;
    const walkSpeed = 5;
    const jumpForce = 0.4;
    //Variables
    let marioSpeed;
    let directionRight;
    let onGround;
    let justJumped;
    // Animation variables
    let duck;
    let walk;
    let jump;
    let currentAnimation;
    // Nodes Transformations
    let spriteNode;
    let marioPosNode;
    let marioPosTransform;
    let spriteTransform;
    let pos;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    //let marioNode: ƒ.Node;
    function start(_event) {
        viewport = _event.detail;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        //ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        console.log(viewport);
        hndLoad();
        let branch = viewport.getBranch();
        console.log(branch);
        marioPosNode = branch.getChildrenByName("Mario position")[0];
        marioPosNode.mtxLocal.translation.y;
        //marioNode= marioPosNode.getChildrenByName("Mario")[0];
    }
    async function hndLoad() {
        //let root: ƒ.Node = new ƒ.Node("root");
        let imgSpriteSheet = new ƒ.TextureImage();
        let imgSpriteSheetDuck = new ƒ.TextureImage();
        let imgSpriteSheetJump = new ƒ.TextureImage();
        await imgSpriteSheet.load("./images/walkAnimation.png");
        let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        await imgSpriteSheetDuck.load("./images/duckingMario.png");
        let duckingCoat = new ƒ.CoatTextured(undefined, imgSpriteSheetDuck);
        await imgSpriteSheetJump.load("./images/jumpingMario.png");
        let jumpingCoat = new ƒ.CoatTextured(undefined, imgSpriteSheetJump);
        duck = new ƒAid.SpriteSheetAnimation("Duck", duckingCoat);
        duck.generateByGrid(ƒ.Rectangle.GET(0, 0, 27, 34), 1, 15, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(27));
        jump = new ƒAid.SpriteSheetAnimation("Duck", jumpingCoat);
        jump.generateByGrid(ƒ.Rectangle.GET(0, 0, 27, 34), 1, 15, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(27));
        walk = new ƒAid.SpriteSheetAnimation("Walk", coat);
        walk.generateByGrid(ƒ.Rectangle.GET(0, 0, 21, 34), 4, 15, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(21));
        //todo set more animations
        currentAnimation = walk;
        spriteNode = new ƒAid.NodeSprite("Sprite");
        spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteNode.setAnimation(currentAnimation);
        spriteNode.setFrameDirection(1);
        spriteNode.mtxLocal.translateY(-1);
        spriteNode.framerate = 12;
        marioPosNode.removeAllChildren();
        marioPosNode.appendChild(spriteNode);
        spriteNode.showFrame(3);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 200);
    }
    marioSpeed = 0;
    directionRight = true;
    onGround = true;
    justJumped = false;
    let velocityY = 0;
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        marioPosTransform = marioPosNode.getComponent(ƒ.ComponentTransform);
        spriteTransform = spriteNode.getComponent(ƒ.ComponentTransform);
        pos = marioPosTransform.mtxLocal.translation;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && !justJumped) {
            if (onGround) {
                velocityY = jumpForce;
                onGround = false;
                spriteNode.setAnimation(jump);
                currentAnimation = jump;
                justJumped = true;
            }
        }
        else if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            justJumped = false;
        }
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        velocityY = velocityY + gravity * deltaTime;
        marioPosTransform.mtxLocal.translateY(velocityY * deltaTime);
        if (pos.y + velocityY > 0.3) {
            marioPosTransform.mtxLocal.translateY(velocityY);
            spriteNode.setAnimation(jump);
            currentAnimation = jump;
        }
        else {
            onGround = true;
            velocityY = 0;
            pos.y = 0.3;
            marioPosTransform.mtxLocal.translation = pos;
            if (currentAnimation != walk && currentAnimation != duck) {
                spriteNode.setAnimation(walk);
                currentAnimation = walk;
            }
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D]) && currentAnimation != duck) {
            marioPosTransform.mtxLocal.translateX(marioSpeed * ƒ.Loop.timeFrameGame / 1000);
            if (directionRight == false) {
                spriteTransform.mtxLocal.rotateY(180);
                directionRight = true;
            }
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A]) && currentAnimation != duck) {
            marioPosTransform.mtxLocal.translateX(-(marioSpeed * ƒ.Loop.timeFrameGame / 1000));
            if (directionRight == true) {
                spriteTransform.mtxLocal.rotateY(180);
                directionRight = false;
            }
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
            spriteNode.setAnimation(duck);
            currentAnimation = duck;
        }
        else {
            if (currentAnimation != walk) {
                spriteNode.setAnimation(walk);
                spriteNode.setFrameDirection(1);
                spriteNode.framerate = 12;
                currentAnimation = walk;
            }
            spriteNode.showFrame(3);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])) {
            marioSpeed = sprintSpeed;
        }
        else {
            marioSpeed = walkSpeed;
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
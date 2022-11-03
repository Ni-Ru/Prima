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
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    const gravity = -80;
    const sprintSpeed = 10;
    const walkSpeed = 5;
    const jumpForce = 20;
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
    let floorListNode;
    let floorGroups;
    let floorGroupsize;
    let floorPositions = [];
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
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        //ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        hndLoad();
        let branch = viewport.getBranch();
        let audioBeep;
        console.log(branch);
        audioBeep = new ƒ.Audio("audio/SuperMarioBros.mp3");
        let cmpAudio = new ƒ.ComponentAudio(audioBeep, false, false);
        cmpAudio.connect(true);
        cmpAudio.volume = 1;
        cmpAudio.play(false);
        branch.addComponent(cmpAudio);
        marioPosNode = branch.getChildrenByName("Mario position")[0];
        floorListNode = branch.getChildrenByName("All Floors")[0];
        floorGroups = floorListNode.getChildrenByName("Floors");
        for (let GroupCounter = 0; GroupCounter < floorGroups.length; GroupCounter++) {
            floorGroupsize = floorGroups[GroupCounter].getChildrenByName("Floor Position");
            for (let inGroupCounter = 0; inGroupCounter < floorGroupsize.length; inGroupCounter++) {
                floorPositions.push(floorGroupsize[inGroupCounter]);
            }
        }
        console.log(floorPositions);
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
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        velocityY += gravity * deltaTime;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && !justJumped && onGround) {
            velocityY = jumpForce;
            onGround = false;
            spriteNode.setAnimation(jump);
            currentAnimation = jump;
            justJumped = true;
        }
        else if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            justJumped = false;
        }
        console.log(pos.y + velocityY);
        let yOffset = velocityY * deltaTime;
        marioPosTransform.mtxLocal.translateY(yOffset);
        checkCollision();
        // if((pos.y + velocityY < 0.3) && pos.y < 0.3){
        //   onGround = true;
        //   velocityY = 0;
        //   pos.y = 0.3;
        //   marioPosTransform.mtxLocal.translation = pos;
        //   if(currentAnimation != walk && currentAnimation != duck){
        //     spriteNode.setAnimation(walk);
        //     currentAnimation = walk;
        //   }
        // }
        if (!onGround) {
            spriteNode.setAnimation(jump);
            currentAnimation = jump;
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
        else if (currentAnimation != walk) {
            spriteNode.setAnimation(walk);
            spriteNode.setFrameDirection(1);
            spriteNode.framerate = 12;
            currentAnimation = walk;
        }
        else {
            spriteNode.showFrame(3);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])) {
            marioSpeed = sprintSpeed;
        }
        else {
            marioSpeed = walkSpeed;
        }
    }
    function checkCollision() {
        let blocks = floorPositions;
        console.log(blocks);
        let pos = marioPosNode.mtxLocal.translation;
        for (let block of blocks) {
            let posBlock = block.mtxLocal.translation;
            let posParentBlock = block.getParent().mtxLocal.translation;
            let calcPosBlock = ƒ.Vector3.SUM(posBlock, posParentBlock);
            if (Math.abs(pos.x - calcPosBlock.x) < 0.6) {
                if (pos.y < calcPosBlock.y + 1.3) {
                    pos.y = calcPosBlock.y + 1.3;
                    marioPosNode.mtxLocal.translation = pos;
                    velocityY = 0;
                    onGround = true;
                }
            }
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
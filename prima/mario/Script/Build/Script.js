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
    ƒ.Debug.info("Main Program Template running!");
    let spriteNode;
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let marioPosNode;
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
        //marioNode= marioPosNode.getChildrenByName("Mario")[0];
    }
    async function hndLoad() {
        //let root: ƒ.Node = new ƒ.Node("root");
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("./images/walkAnimation.png");
        let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        let animation = new ƒAid.SpriteSheetAnimation("Walk", coat);
        animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 21, 34), 4, 15, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(21));
        //todo set more animations
        spriteNode = new ƒAid.NodeSprite("Sprite");
        spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteNode.setAnimation(animation);
        spriteNode.setFrameDirection(1);
        spriteNode.mtxLocal.translateY(-1);
        spriteNode.framerate = 12;
        marioPosNode.removeAllChildren();
        marioPosNode.appendChild(spriteNode);
        spriteNode.showFrame(3);
        //viewport.initialize("Viewport", root, cmpCamera, canvas);
        //viewport.camera.clrBackground = ƒ.Color.CSS("White");
        //viewport.draw();
        //ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 200);
        //document.forms[0].addEventListener("change", handleChange);
    }
    let directionRight = true;
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
            marioPosNode.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(0.05);
            if (directionRight == false) {
                spriteNode.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(180);
                directionRight = true;
            }
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
            marioPosNode.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(-0.05);
            if (directionRight == true) {
                spriteNode.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(180);
                directionRight = false;
            }
        }
        else {
            spriteNode.showFrame(3);
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
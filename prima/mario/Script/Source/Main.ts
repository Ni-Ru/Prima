namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  ƒ.Debug.info("Main Program Template running!");

  let spriteNode: ƒAid.NodeSprite;
  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let marioPosNode: ƒ.Node;
  let marioNode: ƒ.Node;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    //ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    console.log(viewport);
    hndLoad();
    
    let branch: ƒ.Node = viewport.getBranch();
    console.log(branch);
    marioPosNode= branch.getChildrenByName("Mario position")[0];
    marioNode= marioPosNode.getChildrenByName("Mario")[0];

  }

  async function hndLoad(): Promise<void> {
    //let root: ƒ.Node = new ƒ.Node("root");

    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./images/walkAnimation.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

    let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
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
  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    viewport.draw();
    ƒ.AudioManager.default.update();
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])){
      marioPosNode.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(0.05);
      if(directionRight==false){
        spriteNode.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(180);
        directionRight = true;
      }
    }
    else if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])){
      marioPosNode.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(-0.05);
      if(directionRight==true){
        spriteNode.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(180);
        directionRight = false;
      }
    }else{
      spriteNode.showFrame(3);
    }
  }
}
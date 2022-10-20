namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  ƒ.Debug.info("Main Program Template running!");

  let spriteNode: ƒAid.NodeSprite;
  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let marioPosNode: ƒ.Node;
  let duck: ƒAid.SpriteSheetAnimation;
  let walk: ƒAid.SpriteSheetAnimation;
  //let marioNode: ƒ.Node;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    //ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    console.log(viewport);
    hndLoad();
    let branch: ƒ.Node = viewport.getBranch();
    console.log(branch);
    marioPosNode= branch.getChildrenByName("Mario position")[0];
    //marioNode= marioPosNode.getChildrenByName("Mario")[0];

  }

  async function hndLoad(): Promise<void> {
    //let root: ƒ.Node = new ƒ.Node("root");

    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    let imgSpriteSheetDuck: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./images/walkAnimation.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);
    await imgSpriteSheetDuck.load("./images/duckingMario.png");
    let duckingCoat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheetDuck);


    duck = new ƒAid.SpriteSheetAnimation("Duck", duckingCoat);
    duck.generateByGrid(ƒ.Rectangle.GET(0, 0, 27, 34), 1, 15, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(27));

    walk = new ƒAid.SpriteSheetAnimation("Walk", coat);
    walk.generateByGrid(ƒ.Rectangle.GET(0, 0, 21, 34), 4, 15, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(21));

    //todo set more animations

    spriteNode = new ƒAid.NodeSprite("Sprite");
    spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    spriteNode.setAnimation(walk);
    spriteNode.setFrameDirection(1);
    spriteNode.mtxLocal.translateY(-1);
    spriteNode.framerate = 12;

    marioPosNode.removeAllChildren();
    marioPosNode.appendChild(spriteNode);

    spriteNode.showFrame(3);

    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 200);

  }

  let marioSpeed = 0;
  let sprintSpeed = 10;
  let walkSpeed = 5;
  let directionRight = true; 
  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    let marioPosTransform:ƒ.ComponentTransform = marioPosNode.getComponent(ƒ.ComponentTransform);
    let spriteTransform:ƒ.ComponentTransform = spriteNode.getComponent(ƒ.ComponentTransform)

    viewport.draw();
    ƒ.AudioManager.default.update();
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])){
      marioPosTransform.mtxLocal.translateX(marioSpeed*ƒ.Loop.timeFrameGame/1000);
      if(directionRight==false){
        spriteTransform.mtxLocal.rotateY(180);
        directionRight = true;
      }
    }
    else if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])){
      marioPosTransform.mtxLocal.translateX(-(marioSpeed*ƒ.Loop.timeFrameGame/1000));
      if(directionRight==true){
        spriteTransform.mtxLocal.rotateY(180);
        directionRight = false;
      }
    }else{
      spriteNode.showFrame(3);
    }


    // if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])){
    //   spriteNode.setAnimation(duck);
    //   console.log(duck)
    // }else{
    //   console.log(walk)
    //   spriteNode.setAnimation(walk);
    // }

    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])){
      marioSpeed=sprintSpeed;
    }
    else{
      marioSpeed=walkSpeed;
    }
  }
}
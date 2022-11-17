namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  const gravity: number = -80;
  const sprintSpeed: number = 10;
  const walkSpeed: number = 5;
  const jumpForce: number = 20;

//Variables
let marioSpeed: number;
let directionRight: boolean; 
let onGround: boolean;
let justJumped: boolean;
  
// Animation variables
  let duck: ƒAid.SpriteSheetAnimation;
  let walk: ƒAid.SpriteSheetAnimation;
  let jump: ƒAid.SpriteSheetAnimation;
  let currentAnimation: ƒAid.SpriteSheetAnimation;

// Nodes Transformations
  let spriteNode: ƒAid.NodeSprite;
  let floorListNode: ƒ.Node;
  let floorGroups: ƒ.Node[];
  let floorGroupsize: ƒ.Node[];
  let floorPositions: ƒ.Node[] = [];
  let marioPosNode: ƒ.Node;
  let marioPosTransform:ƒ.ComponentTransform;
  let spriteTransform:ƒ.ComponentTransform; 
  let pos: ƒ.Vector3;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  //let marioNode: ƒ.Node;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    //ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    hndLoad();
    let branch: ƒ.Node = viewport.getBranch();
    let audioBeep: ƒ.Audio;

    // console.log(branch);

    audioBeep = new ƒ.Audio("audio/SuperMarioBros.mp3");

    let cmpAudio: ƒ.ComponentAudio = new ƒ.ComponentAudio(audioBeep, false, false);
    cmpAudio.connect(true);
    cmpAudio.volume = 1;
    cmpAudio.play(true);

    branch.addComponent(cmpAudio);

    marioPosNode= branch.getChildrenByName("Mario position")[0];
    floorListNode = branch.getChildrenByName("All Floors")[0];
    floorGroups = floorListNode.getChildrenByName("Floors");


    for(let GroupCounter = 0; GroupCounter<floorGroups.length; GroupCounter++){
      floorGroupsize = floorGroups[GroupCounter].getChildrenByName("Floor Position");
      for(let inGroupCounter = 0; inGroupCounter<floorGroupsize.length; inGroupCounter++){

        floorPositions.push(floorGroupsize[inGroupCounter]);
        
      }
    }

    // console.log(floorPositions);

    marioPosNode.mtxLocal.translation.y
    //marioNode= marioPosNode.getChildrenByName("Mario")[0];

  }



  async function hndLoad(): Promise<void> {
    //let root: ƒ.Node = new ƒ.Node("root");

    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    let imgSpriteSheetDuck: ƒ.TextureImage = new ƒ.TextureImage();
    let imgSpriteSheetJump: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./images/walkAnimation.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);
    await imgSpriteSheetDuck.load("./images/duckingMario.png");
    let duckingCoat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheetDuck);
    await imgSpriteSheetJump.load("./images/jumpingMario.png");
    let jumpingCoat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheetJump);


    duck = new ƒAid.SpriteSheetAnimation("Duck", duckingCoat);
    duck.generateByGrid(ƒ.Rectangle.GET(0, 0, 27, 34), 1, 15, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(27));

    jump = new ƒAid.SpriteSheetAnimation("Duck", jumpingCoat);
    jump.generateByGrid(ƒ.Rectangle.GET(0, 0, 27, 34), 1, 15, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(27));

    walk = new ƒAid.SpriteSheetAnimation("Walk", coat);
    walk.generateByGrid(ƒ.Rectangle.GET(0, 0, 21, 34), 4, 15, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(21));

    //todo set more animations
    currentAnimation=walk;
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

  let velocityY:number  = 0
  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    marioPosTransform = marioPosNode.getComponent(ƒ.ComponentTransform);
    spriteTransform = spriteNode.getComponent(ƒ.ComponentTransform);
    pos = marioPosTransform.mtxLocal.translation;

    let deltaTime:number = ƒ.Loop.timeFrameGame/1000;
    velocityY += gravity * deltaTime;

    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && !justJumped && onGround){
      velocityY = jumpForce;
      onGround = false;
      spriteNode.setAnimation(jump);
      currentAnimation = jump;
      justJumped = true;
      
    }else if(!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])){
      justJumped = false;
    }

    // console.log(pos.y + velocityY);

    let yOffset: number = velocityY * deltaTime;
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

    if(!onGround){
      spriteNode.setAnimation(jump);
      currentAnimation = jump;
    }
    

    viewport.draw();
    ƒ.AudioManager.default.update();
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D]) && currentAnimation != duck){
      marioPosTransform.mtxLocal.translateX(marioSpeed*ƒ.Loop.timeFrameGame/1000);
      if(directionRight==false){
        spriteTransform.mtxLocal.rotateY(180);
        directionRight = true;
      }
    }
    else if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A]) && currentAnimation != duck){
      marioPosTransform.mtxLocal.translateX(-(marioSpeed*ƒ.Loop.timeFrameGame/1000));
      if(directionRight==true){
        spriteTransform.mtxLocal.rotateY(180);
        directionRight = false;
      }
    }else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])){
      spriteNode.setAnimation(duck);
      currentAnimation = duck;
    }else if(currentAnimation != walk){
      spriteNode.setAnimation(walk);
      spriteNode.setFrameDirection(1);
      spriteNode.framerate = 12;
      currentAnimation = walk;
    }else{
      spriteNode.showFrame(3);
    }

    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])){
      marioSpeed=sprintSpeed;
    }
    else{
      marioSpeed=walkSpeed;
    }
     
  }


  function checkCollision(): void {
    let blocks: ƒ.Node[] = floorPositions;
    // console.log(blocks);
    let pos: ƒ.Vector3 = marioPosNode.mtxLocal.translation;
    for (let block of blocks) {
      let posBlock: ƒ.Vector3 = block.mtxLocal.translation;
      let posParentBlock: ƒ.Vector3 = block.getParent().mtxLocal.translation;
      let calcPosBlock: ƒ.Vector3 = ƒ.Vector3.SUM(posBlock, posParentBlock);
      if (Math.abs(pos.x - calcPosBlock.x) < 0.6) {
        if (pos.y < calcPosBlock.y + 1.3) {
          pos.y = calcPosBlock.y + 1.3;
          marioPosNode.mtxLocal.translation = pos;
          velocityY = 0;
          onGround = true
        }
      }
    }
  }

  }

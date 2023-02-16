namespace Script {
  import fc = FudgeCore;
  import fcAid = FudgeAid

  let viewport: fc.Viewport;
  
  export let characterCmp: CharacterComponent;
  let cmpCamera: fc.ComponentCamera;
  let gravityCmp: GravityComponent;
  
  export let branch: fc.Node;
  export let characterPos: fc.Node;
  let enemyNodes: fc.Node[];
  export let characterSprite: fcAid.NodeSprite;
  let characterTransform: fc.ComponentTransform;

  let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
  let imgSpriteSheetWalk: ƒ.TextureImage = new ƒ.TextureImage();
  let imgSpriteSheetAttack: ƒ.TextureImage = new ƒ.TextureImage();

  let idleCoat: ƒ.CoatTextured;
  let walkingCoat: ƒ.CoatTextured;
  let attackingCoat: ƒ.CoatTextured;

  export let idle: ƒAid.SpriteSheetAnimation;
  export let walk: ƒAid.SpriteSheetAnimation;
  export let attack: ƒAid.SpriteSheetAnimation;


  export let gameState: GameState;

  export const walkSpeed: number = 3;
  let deltaTime: number;

  export let allowWalkRight: boolean = true;
  export let allowWalkLeft: boolean = true;
  let config: {[key: string]: number};

  let spacePressed: boolean = false;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

   function start(_event: CustomEvent) {
    fetchData()
    setup(_event);
    fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, update);
    fc.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  async function fetchData(): Promise<void>{
    let response: Response = await fetch("config.json");
    config = await response.json();

    gameState = new GameState(config)
    gameState.stoneAmount(gameState.stones, false);
  }

   function setup(_event: CustomEvent){

    viewport = _event.detail;
    branch = viewport.getBranch();

    loadSprites();
    loadCharacter();
    branch.addEventListener("playSound", hndPlaySound);

    branch.addComponent(new fc.ComponentAudio());

    enemyNodes = branch.getChildrenByName("enemies")[0].getChildrenByName("enemy_Pos");


    for(let enemy of enemyNodes){
      let newEnemy: EnemyNode = new EnemyNode();
      enemy.appendChild(newEnemy);
    }

    cmpCamera = viewport.camera;
    cmpCamera.mtxPivot.rotateY(180);
    cmpCamera.mtxPivot.translation = new fc.Vector3(0, 0, 15);

    window.addEventListener("mousedown", hndAim);
    window.addEventListener("mouseup", (e) => {
      if (e.button === 2){
        window.removeEventListener("click", characterCmp.hndThrow);
        document.body.style.cursor = "default";
      }
    });
    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

  }

  function update(_event: Event): void {
    deltaTime = fc.Loop.timeFrameGame / 1000;
    characterCmp.update(deltaTime)
    gravityCmp.update(deltaTime)
    controls();
    fc.Physics.simulate();  // if physics is included and used
    viewport.draw();
    updateCamera();
    fc.AudioManager.default.update();
  }



  function loadCharacter(){
    loadSprites();
    characterSprite = new fcAid.NodeSprite("character");
    characterSprite.addComponent(new fc.ComponentTransform(new fc.Matrix4x4()));
    characterTransform = characterSprite.getComponent(fc.ComponentTransform);
    characterTransform.mtxLocal.scaleX(0.5);
    characterTransform.mtxLocal.translateY(0.5);
    

    currentAnimation = idle;
    
    characterPos = branch.getChildrenByName("Player")[0].getChildrenByName("character_Pos")[0];

    characterPos.appendChild(characterSprite);
    characterSprite.addComponent(new CharacterComponent);
    characterSprite.addComponent(new GravityComponent);
    characterCmp = characterSprite.getComponent(CharacterComponent);
    gravityCmp = characterSprite.getComponent(GravityComponent);
    console.log(characterPos);
  }

  async function loadSprites(){
    await imgSpriteSheet.load("./imgs/Idle.png");
    idleCoat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
    await imgSpriteSheetWalk.load("./imgs/Walk.png");
    walkingCoat = new ƒ.CoatTextured(undefined, imgSpriteSheetWalk);
    await imgSpriteSheetAttack.load("./imgs/Idle.gif");
    attackingCoat = new ƒ.CoatTextured(undefined, imgSpriteSheetAttack);

    idle = new fcAid.SpriteSheetAnimation("Idle", idleCoat);
    idle.generateByGrid(ƒ.Rectangle.GET(0, 0, 96, 96), 5,65, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(96));

    walk = new fcAid.SpriteSheetAnimation("Walk", walkingCoat);
    walk.generateByGrid(ƒ.Rectangle.GET(0, 0, 96, 96), 8, 65, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(96));
    characterSprite.mtxLocal.translateY(0.12);
    characterSprite.mtxLocal.scaleX(1.3)
    console.log(walk);

    currentAnimation = idle;
    characterSprite.setAnimation(currentAnimation);
    characterSprite.setFrameDirection(1);
    characterSprite.framerate = 12;
  }


  function hndPlaySound(e: Event): void{
    e.currentTarget;
    let audioComp: fc.ComponentAudio = branch.getComponent(fc.ComponentAudio);
    let inventorySound: fc.Audio = new fc.Audio("./sounds/cloth-inventory.wav");
    let stoneSound: fc.Audio = new fc.Audio("./sounds/stone.mp3");
    if(e.target == characterSprite){
      audioComp.setAudio(inventorySound);
      audioComp.volume = 0.5;
    }else{
      audioComp.setAudio(stoneSound);
      audioComp.volume = 1.5;
    }
      audioComp.play(true);
  }

  function controls(){
      if(fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.D])){
        if(allowWalkRight){
          characterCmp.setSprite(walk);
          characterCmp.walk(1);
        }
      }else if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A])){
        if(allowWalkLeft){
          characterCmp.setSprite(walk);
          characterCmp.walk(-1);
        }
      }else if (!fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.D])){
        characterCmp.setSprite(idle)
        characterCmp.walk(0);
      }
      
      if(fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE])){
        if(!spacePressed) {
          spacePressed = true;
          characterCmp.changeWeapon();
        }
      }else{
        spacePressed = false;
      }
  }

  
  function hndAim(e: MouseEvent): void{
    if(weapon === "stones"){ 
      if(e.button === 2){
        document.body.style.cursor ="crosshair";
        window.addEventListener("click", characterCmp.hndThrow);
      }
    }
  }

  function updateCamera(): void {
      let pos: fc.Vector3 = characterSprite.getParent().mtxLocal.translation;
      let origin: fc.Vector3 = cmpCamera.mtxPivot.translation;
      cmpCamera.mtxPivot.translation = new fc.Vector3( pos.x, pos.y + 1, origin.z);
  }
}
namespace Script {
  import fc = FudgeCore;

  let viewport: fc.Viewport;
  
  export let characterCmp: CharacterComponent;
  let cmpCamera: fc.ComponentCamera;
  let gravityCmp: GravityComponent;
  
  export let branch: fc.Node;
  export let characterNode: fc.Node;
  let enemyNodes: fc.Node[];

  export let gameState: GameState;

  export const walkSpeed: number = 3;
  let deltaTime: number;

  export let allowWalkRight: boolean = true;
  export let allowWalkLeft: boolean = true;
  let config: {[key: string]: number};

  let spacePressed: boolean = false;

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

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

    branch.addEventListener("playSound", hndPlaySound);

    branch.addComponent(new fc.ComponentAudio());

    enemyNodes = branch.getChildrenByName("enemies")[0].getChildrenByName("enemy_Pos");
    
    for(let enemy of enemyNodes){
      let newEnemy: EnemyNode = new EnemyNode();
      enemy.appendChild(newEnemy);
    }

    characterNode = branch.getChildrenByName("Player")[0].getChildrenByName("character_Pos")[0].getChildrenByName("Character")[0];

    characterCmp = characterNode.getComponent(CharacterComponent);
    gravityCmp = characterNode.getComponent(GravityComponent);

    cmpCamera = viewport.camera;
    cmpCamera.mtxPivot.rotateY(180);
    cmpCamera.mtxPivot.translation = new fc.Vector3(0, 0, 40);

    window.addEventListener("mousedown", hndAim);
    window.addEventListener("mouseup", (e) => {
      if (e.button === 2){
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


  function hndPlaySound(e: Event): void{
    e.currentTarget;
    let audioComp: fc.ComponentAudio = branch.getComponent(fc.ComponentAudio);
    let inventorySound: fc.Audio = new fc.Audio("./sounds/cloth-inventory.wav");
    let stoneSound: fc.Audio = new fc.Audio("./sounds/stone.mp3");
    if(e.target == characterNode){
      audioComp.setAudio(inventorySound);
      audioComp.volume = 0.5;
    }else{
      audioComp.setAudio(stoneSound);
      audioComp.volume = 1.5;
    }
      audioComp.play(true);
  }

  function hndAim(e: MouseEvent): void{
    if(weapon === "stones"){ 
      if(e.button === 2){
        document.body.style.cursor ="crosshair";
        window.addEventListener("click",characterCmp.hndThrow);
      }
    }
  }

  function controls(){
      if(fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.D])){
        if(allowWalkRight){
          characterCmp.walk(1)
        }
      }else if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A])){
        if(allowWalkLeft){
          characterCmp.walk(-1)
        }
      }else if (!fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.D])){
        characterCmp.walk(0)
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

  function updateCamera(): void {
      let pos: fc.Vector3 = characterNode.getParent().mtxLocal.translation;
      let origin: fc.Vector3 = cmpCamera.mtxPivot.translation;
      cmpCamera.mtxPivot.translation = new fc.Vector3( pos.x, pos.y, origin.z);
  }
}
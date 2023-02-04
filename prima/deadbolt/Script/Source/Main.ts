namespace Script {
  import fc = FudgeCore;

  export const walkSpeed: number = 3;
  export let allowWalkRight: boolean = true;
  export let allowWalkLeft: boolean = true;

  let viewport: fc.Viewport;
  export let branch: fc.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let characterCmp: CharacterComponent;
  let gravityCmp: GravityComponent;
  let characterNode: fc.Node;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    branch = viewport.getBranch();

    characterNode = branch.getChildrenByName("character_Pos")[0].getChildrenByName("Character")[0];
    characterCmp = characterNode.getComponent(CharacterComponent);
    gravityCmp = characterNode.getComponent(GravityComponent);

    fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, update);
    fc.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    let deltaTime: number = fc.Loop.timeFrameGame / 1000;
    characterCmp.update(deltaTime)
    gravityCmp.update(deltaTime)
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    fc.AudioManager.default.update();

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
    }
}
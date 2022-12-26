namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let cmpEngine: SpaceShipControls;
  export let ship: ƒ.Node;
  let enemies: ƒ.Node;
  let enemy: ƒ.Node;
  let nodeTerrain: ƒ.Node;
  export let branch: ƒ.Node;
  export let cmpMeshTerrain: ƒ.ComponentMesh;
  export let terrainMesh: ƒ.MeshTerrain;
  export let gameState: GameState;
  let vctMouse: ƒ.Vector2 = ƒ.Vector2.ZERO();
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  window.addEventListener("mousemove", hndMouse);

  function start(_event: CustomEvent): void {
    gameState = new GameState()

    viewport = _event.detail;
    branch = viewport.getBranch()
    ship = branch.getChildrenByName("Ship")[0];
    enemies = branch.getChildrenByName("Enemy_ships")[0];
    enemy = enemies.getChildrenByName("enemy_pos")[0].getChildrenByName("enemy")[0];
    cmpEngine = ship.getComponent(SpaceShipControls);
    let cmpCamera = ship.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;

    nodeTerrain = branch.getChildrenByName("Floor_pos")[0].getChildrenByName("Floor")[0];
    cmpMeshTerrain = nodeTerrain.getComponent(ƒ.ComponentMesh);
    terrainMesh = <ƒ.MeshTerrain>cmpMeshTerrain.mesh;
  
    initAnim();
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function initAnim (): void {
    
    let animseq: ƒ.AnimationSequence = new ƒ.AnimationSequence();
    animseq.addKey(new ƒ.AnimationKey(0,0, 0, 360/3000));
    animseq.addKey(new ƒ.AnimationKey(3000,360, 360/3000));

    new ƒ.ComponentMesh().mtxPivot

    let animStructure: ƒ.AnimationStructure = {
      components: {
        ComponentMesh: [
          {
            "ƒ.ComponentMesh": {
              mtxPivot: {
                rotation: {
                  y: animseq
                }
              }
            }
          }
        ]
      }
    };

    let animation: ƒ.Animation = new ƒ.Animation("testAnimation", animStructure, 30);
    let cmpAnimator: ƒ.ComponentAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE.LOOP, ƒ.ANIMATION_PLAYBACK.TIMEBASED_CONTINOUS);
    enemy.addComponent(cmpAnimator);
    cmpAnimator.activate(true);
  }

  function update(_event: Event): void {
    control();
    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function hndMouse(e: MouseEvent): void {
    vctMouse.x = 2 * (e.clientX / window.innerWidth) - 1;
    vctMouse.y = 2 * (e.clientY / window.innerHeight) - 1;
  }

  function control() {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
      cmpEngine.thrust();
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
      cmpEngine.backwards();
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
      cmpEngine.roll(-5);
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
      cmpEngine.roll(5);
    }
    cmpEngine.pitch(vctMouse.y);
    cmpEngine.yaw(vctMouse.x);
  }
}
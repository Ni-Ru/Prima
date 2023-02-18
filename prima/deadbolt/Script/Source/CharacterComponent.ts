namespace Script {
  import fc = FudgeCore;
  import fcAid = FudgeAid;
  fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  let cmpAnimator: ƒ.ComponentAnimator;

  export let xSpeed = 0;

  let directionRight: boolean = true;
  
  export let usedStairs: boolean = false;
  
  export let weapon: String = "knife";

  export let currentAnimation: ƒAid.SpriteSheetAnimation;
  
  export let dead: boolean = false;

  export class CharacterComponent extends fc.ComponentScript {

    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = fc.Component.registerSubclass(CharacterComponent);
    // Properties may be mutated by users in the editor via the automatically created user interface

    constructor() {
      super();

      // Don't start when running in editor
      if (fc.Project.mode == fc.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(fc.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }


    public walkSpeed: number = 0;


    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case fc.EVENT.COMPONENT_ADD:
          break;
        case fc.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case fc.EVENT.NODE_DESERIALIZED:

          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    update(deltaTime: number) {
      this.node.getParent().mtxLocal.translateX(xSpeed * deltaTime, true)
    }

    walk(direction: number) {
      xSpeed = walkSpeed * direction;
      if(direction > 0){
        if(!directionRight){
          this.node.mtxLocal.rotateY(180);
        }
        directionRight = true;
      }else if(direction < 0){
        if(directionRight){
          this.node.mtxLocal.rotateY(180);
        }
        directionRight = false;
      }
      
    }

    initAnim (enter: boolean): void {
    
      let animseqEnter: fc.AnimationSequence = new fc.AnimationSequence();
      animseqEnter.addKey(new fc.AnimationKey(0,1));
      animseqEnter.addKey(new fc.AnimationKey(500, 0));
  
      let animStructureEnter: fc.AnimationStructure = {
        components: {
          ComponentMaterial: [
            {
              "fc.ComponentMaterial": {
                clrPrimary: {
                  a: animseqEnter
                }
              }
            }
          ]
        }
      };


      let animseqLeave: fc.AnimationSequence = new fc.AnimationSequence();
      animseqLeave.addKey(new fc.AnimationKey(0,0));
      animseqLeave.addKey(new fc.AnimationKey(500, 1));
      let animStructureLeave: fc.AnimationStructure = {
        components: {
          ComponentMaterial: [
            {
              "fc.ComponentMaterial": {
                clrPrimary: {
                  a: animseqLeave
                }
              }
            }
          ]
        }
      };
  
      let animationEnter: ƒ.Animation = new ƒ.Animation("enterStairs", animStructureEnter, 30);
      let animationLeave: ƒ.Animation = new ƒ.Animation("leaveStairs", animStructureLeave, 30);

      if(enter){
        cmpAnimator = new ƒ.ComponentAnimator(animationEnter, ƒ.ANIMATION_PLAYMODE.PLAYONCE, ƒ.ANIMATION_PLAYBACK.TIMEBASED_CONTINOUS);
      }else{
        cmpAnimator = new ƒ.ComponentAnimator(animationLeave, ƒ.ANIMATION_PLAYMODE.PLAYONCE, ƒ.ANIMATION_PLAYBACK.TIMEBASED_CONTINOUS);
      }
      this.node.addComponent(cmpAnimator);
      cmpAnimator.activate(true);
    }

    useStairs(exit: number, stairInteract: InteractComponent){
      this.walk(0);
      this.initAnim(true);
      allowInputs =false
      setTimeout(() => {
        characterPos.mtxLocal.translateY(exit);
        this.node.removeComponent(cmpAnimator);
        this.initAnim(false);
        if(stairInteract){
          stairInteract.noInteract();
        }
        setTimeout(() => {
          this.node.removeComponent(cmpAnimator);
          allowInputs=true;
        }, 500);
      }, 500);
    }



    changeWeapon(){
      this.node.dispatchEvent(new Event("playSound", {bubbles: true}));
      if(weapon === "knife"){
        weapon = "stones";
        window.removeEventListener("click", hndAttack);
        document.getElementById("knife").removeAttribute("class");
        document.getElementById("stones").setAttribute("class", "selected");
        document.getElementById("stoneImgs").setAttribute("class", "selected");
      }else{
        weapon = "knife";
        window.addEventListener("click", hndAttack);
        document.getElementById("stones").removeAttribute("class");
        document.getElementById("stoneImgs").removeAttribute("class");
        document.getElementById("knife").setAttribute("class", "selected");
      }
    }

    hndThrow(e: MouseEvent): void{
      if(weapon === "stones" && gameState.stones > 0){
        let vctMouse: fc.Vector2 = new fc.Vector2();
        vctMouse.x = 2 * (e.clientX / window.innerWidth) -1;
        vctMouse.y = 2 * (e.clientY / window.innerHeight) -1;
        let newStone = new StoneNode(vctMouse);
        let items: fc.Node = branch.getChildrenByName("environment")[0].getChildrenByName("items")[0];
        items.addChild(newStone);
        gameState.stones -= 1;
        gameState.stoneAmount(gameState.stones, true);
      }

    }

    die(){
      dead = true;
      this.setSprite(death);
    }

    setSprite( sprite: fcAid.SpriteSheetAnimation){
      if (currentAnimation !== sprite){
        characterSprite.showFrame(0);
        characterSprite.setAnimation(sprite);
        characterSprite.framerate = 12;
        currentAnimation=sprite;
      }
    }


    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}
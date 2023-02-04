namespace Script {
  import fc = FudgeCore;
  fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  
  const gravity: number = -80;

  let ySpeed: number = 0;
  let velocityY: number = 0;

  let interactCmp: InteractComponent;

  export class GravityComponent extends fc.ComponentScript {

    public static readonly iSubclass: number = fc.Component.registerSubclass(GravityComponent);

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

    private pos: fc.Vector3;

    private characterPos: fc.Node;
    private obstaclePos: fc.Vector3;
    private obstacleNode: fc.Node;
    private obstacleMesh: fc.ComponentMesh;
    private obstacleLength: number;
    private obstacleHeight: number;

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
        this.characterPos = this.node.getParent();
        // this.floors = branch.getChildrenByName("environment")[0].getChildrenByName("floors")[0].getChildrenByName("floor_Pos");
         
        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    update(deltaTime: number) {
      velocityY += gravity * deltaTime;
      ySpeed = velocityY * deltaTime;
      this.characterPos.mtxLocal.translateY(ySpeed, true);
      this.checkCollission();
    }

    checkCollission(){
      let floors: fc.Node[] = branch.getChildrenByName("environment")[0].getChildrenByName("floors")[0].getChildrenByName("floor_Pos");
      let walls: fc.Node[] = branch.getChildrenByName("environment")[0].getChildrenByName("walls")[0].getChildrenByName("wall_Pos");
      let doors: fc.Node[] = branch.getChildrenByName("environment")[0].getChildrenByName("doors")[0].getChildrenByName("door_Pos");
      let obstacles = [floors, walls, doors];
      this.pos = this.characterPos.mtxLocal.translation;
      for (let obstacleType of obstacles){
        for (let obstacle of obstacleType) {
          this.obstaclePos = obstacle.mtxLocal.translation;
          this.obstacleNode = obstacle.getChildren()[0];
          this.obstacleMesh = this.obstacleNode.getComponent(fc.ComponentMesh);
          this.obstacleLength = this.obstacleMesh.mtxPivot.getX().x;
          this.obstacleHeight = this.obstacleMesh.mtxPivot.getY().y;
          
          let obstacleNodePos: fc.Vector3 = this.obstacleNode.mtxLocal.translation;
          let obstacleCalcPos: fc.Vector3 = fc.Vector3.SUM(this.obstaclePos, obstacleNodePos);
          if(obstacle.name === "floor_Pos"){
            if(Math.abs(this.pos.x - obstacleCalcPos.x) < (this.obstacleLength/2) + 0.2){
              if(Math.abs(this.pos.y - this.obstaclePos.y) < 1){
                if(this.pos.y < this.obstaclePos.y) {
                  this.pos.y = this.obstaclePos.y;
                  this.characterPos.mtxLocal.translation = this.pos;
                  ySpeed = 0;
                  velocityY = 0;
                }
              }
            }
          }else{
            if(Math.abs(this.pos.y - obstacleCalcPos.y) <= (this.obstacleHeight/2)){
              if(Math.abs(this.pos.x - this.obstaclePos.x) < 1){
                if (obstacle.name === "door_Pos"){
                  interactCmp = this.obstacleNode.getComponent(InteractComponent);
                  interactCmp.update();
                  if(!openDoor){
                    this.doorCollission();
                  }
                }
                else{
                  this.doorCollission();
                }
              }
            }
          }
        }
      }
    }

    doorCollission(){
      if(Math.abs(this.pos.x - this.obstaclePos.x) <= (this.obstacleLength/2) + 0.25) {
        if(this.pos.x > this.obstaclePos.x){
          allowWalkLeft = false;
          this.pos.x = this.obstaclePos.x + (this.obstacleLength/2) + 0.25;
          this.characterPos.mtxLocal.translation = this.pos;
        }else{
          allowWalkRight = false;
          console.log(allowWalkRight)
          this.pos.x = this.obstaclePos.x - (this.obstacleLength/2) - 0.25;
          this.characterPos.mtxLocal.translation = this.pos;
        }
      } else{
        allowWalkLeft = true;
        allowWalkRight = true;
      }
    }



    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}
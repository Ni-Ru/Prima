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
    private obstacleNodePos: fc.Vector3;
    private obstacleCalcPos: fc.Vector3;

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
      this.characterPos = this.node.getParent();
      velocityY += gravity * deltaTime;
      ySpeed = velocityY * deltaTime;
      this.checkCollission();
      this.characterPos.mtxLocal.translateY(ySpeed, true);
     
    }

    checkCollission(){
      this.characterPos = this.node.getParent();
      let floors: fc.Node[] = branch.getChildrenByName("environment")[0].getChildrenByName("floors")[0].getChildrenByName("floor_Pos");
      let walls: fc.Node[] = branch.getChildrenByName("environment")[0].getChildrenByName("walls")[0].getChildrenByName("wall_Pos");
      let doors: fc.Node[] = branch.getChildrenByName("environment")[0].getChildrenByName("doors")[0].getChildrenByName("door_Pos");
      let stairs: fc.Node[] = branch.getChildrenByName("environment")[0].getChildrenByName("stairs")[0].getChildrenByName("stair_Pos");

      let obstacles = [floors, walls, doors, stairs];
      this.pos = this.characterPos.mtxLocal.translation;
      
      for (let obstacleType of obstacles){
        for (let obstacle of obstacleType) {

          this.obstaclePos = obstacle.mtxLocal.translation;
          this.obstacleNode = obstacle.getChildren()[0];
          this.obstacleMesh = this.obstacleNode.getComponent(fc.ComponentMesh);
          this.obstacleLength = this.obstacleMesh.mtxPivot.getX().x;
          this.obstacleHeight = this.obstacleMesh.mtxPivot.getY().y;
          this.obstacleNodePos = this.obstacleNode.mtxLocal.translation;
          this.obstacleCalcPos = fc.Vector3.SUM(this.obstaclePos, this.obstacleNodePos);
          interactCmp = this.obstacleNode.getComponent(InteractComponent);

          switch(obstacle.name){
            case "floor_Pos":
              this.yCollission();
              break;
            default:
              if((Math.abs(this.pos.y - ((this.obstaclePos.y + 0.5) + ((this.obstacleHeight/2) -1) ))) < (this.obstacleHeight/2) +0.5){
                if(Math.abs(this.pos.x - this.obstaclePos.x) < 2){
                  switch(obstacle.name){
                    case "door_Pos":
                      interactCmp.update(this);
                      break;

                    case "stair_Pos":
                        interactCmp.update(this);
                      break;

                    default:
                      this.wallCollission();
                      break;
                  }
                }
              }
          }
        }
      }
    }

    wallCollission(){
      let nodeName: string = this.node.name;
        if(Math.abs(this.pos.x - this.obstaclePos.x) <= (this.obstacleLength/2) + 0.25) {
          if(this.pos.x > this.obstaclePos.x){
            if(nodeName === "character"){
              allowWalkLeft = false;
            }
            this.pos.x = this.obstaclePos.x + (this.obstacleLength/2) + 0.25;
            this.characterPos.mtxLocal.translation = this.pos;
          }else{
            if(nodeName === "character"){
              allowWalkRight = false;
            }
            this.pos.x = this.obstaclePos.x - (this.obstacleLength/2) - 0.25;
            this.characterPos.mtxLocal.translation = this.pos;
          }
        } else{
          if(nodeName === "character"){
            allowWalkLeft = true;
            allowWalkRight = true;
          }
        }
    }

    yCollission(){
      if(Math.abs(this.pos.x - this.obstacleCalcPos.x) < (this.obstacleLength/2) + 0.2){
        if(Math.abs(this.pos.y - this.obstaclePos.y) < 1){
          if(this.pos.y <= this.obstaclePos.y) {
            ySpeed = 0;
            velocityY = 0;
            this.pos.y = this.obstaclePos.y;
            this.node.getParent().mtxLocal.translation = this.pos;
          }
        }
      }
    }



    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}
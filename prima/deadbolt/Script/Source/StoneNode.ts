namespace Script {

    import fAid = FudgeAid;
    import fc = FudgeCore;


    export class StoneNode extends fAid.NodeSprite {
        stoneDirection: fc.Vector2;


        constructor(_stoneDirection: fc.Vector2) {
            super("stone");

            this.stoneDirection = _stoneDirection;
            let Material: fc.Material = new fc.Material("stoneMat", fc.ShaderLitTextured);
            let StoneImage: fc.TextureImage = new fc.TextureImage();
            StoneImage.load("./imgs/stone.gif");
            let stoneCoat: fc.CoatTextured = new fc.CoatTextured(undefined, StoneImage);
            Material.coat = stoneCoat;

            let stoneTransform: fc.ComponentTransform = new fc.ComponentTransform();
            this.addComponent(stoneTransform);

            let stoneRigid: fc.ComponentRigidbody = new fc.ComponentRigidbody(10, fc.BODY_TYPE.DYNAMIC, fc.COLLIDER_TYPE.CUBE, fc.COLLISION_GROUP.DEFAULT);
            this.addComponent(stoneRigid);

            let gravityCmp: GravityComponent = new GravityComponent();
            this.addComponent(gravityCmp);

            let characterPosTrans = characterPos.mtxWorld.translation;
            characterPosTrans.y += 0.5;


            let scaleVec: fc.Vector3 = new fc.Vector3(0.2, 0.15, 0.5);

            stoneTransform.mtxLocal.translate(characterPosTrans);
            stoneTransform.mtxLocal.translateZ(0.1);
            stoneTransform.mtxLocal.scale(scaleVec);
            console.log(this.stoneDirection.x);

            let forceVector: fc.Vector3 = new fc.Vector3(1000, 1000, 0);
            forceVector.x = this.stoneDirection.x;
            forceVector.y = -this.stoneDirection.y;
            forceVector.scale(5000);
            
            stoneRigid.applyForce(forceVector);
            stoneRigid.addEventListener(fc.EVENT_PHYSICS.COLLISION_ENTER, this.hndCollision);
            

            let cmpMat: fc.ComponentMaterial = this.getComponent(fc.ComponentMaterial);
            cmpMat.material = Material;
            new fc.CoatTextured()
        }

        hndCollision = (): void =>{
            this.dispatchEvent(new Event("playSound", {bubbles: true}));
        }



    }
}
namespace Script {

    import fAid = FudgeAid;
    import fc = FudgeCore;


    export class StoneNode extends fAid.NodeSprite {

        inInventory: boolean;


        constructor() {
            super("stone");

            let Material: fc.Material = new fc.Material("stoneMat", fc.ShaderLitTextured);
            let StoneImage: fc.TextureImage = new fc.TextureImage();
            StoneImage.load("./imgs/stone.gif");
            let stoneCoat: fc.CoatTextured = new fc.CoatTextured(undefined, StoneImage);
            Material.coat = stoneCoat;

            let stoneTransform: fc.ComponentTransform = new fc.ComponentTransform();
            this.addComponent(stoneTransform);

            let stoneRigid: fc.ComponentRigidbody = new fc.ComponentRigidbody(2, fc.BODY_TYPE.DYNAMIC, fc.COLLIDER_TYPE.CUBE, fc.COLLISION_GROUP.DEFAULT);
            this.addComponent(stoneRigid);

            let characterPos = characterNode.getParent().mtxWorld.translation;


            let scaleVec: fc.Vector3 = new fc.Vector3(0.4, 0.3, 0.5);

            stoneTransform.mtxLocal.scale(scaleVec);
            stoneTransform.mtxLocal.translate(characterPos);
            console.log(characterPos);
            


            let cmpMat: fc.ComponentMaterial = this.getComponent(fc.ComponentMaterial);
            cmpMat.material = Material;
            new fc.CoatTextured()
        }



    }
}
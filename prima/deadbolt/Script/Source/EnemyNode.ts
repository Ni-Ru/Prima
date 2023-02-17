namespace Script {

    import fAid = FudgeAid;
    import fc = FudgeCore;


    export class EnemyNode extends fAid.NodeSprite {

        constructor() {
            super("EnemyNode");
            let EnemyImage: fc.TextureImage = new fc.TextureImage();
            let enemyTransform: fc.ComponentTransform = new fc.ComponentTransform();
            let Material: fc.Material = new fc.Material("enemyMat", fc.ShaderLitTextured);
            let enemyCoat: fc.CoatTextured = new fc.CoatTextured(undefined, EnemyImage);
            let stateMachine: EnemyStateMachine = new EnemyStateMachine();

            this.addComponent(enemyTransform);
            this.addComponent(new GravityComponent);
            this.addComponent(new InteractComponent);
            this.addComponent(stateMachine);
            EnemyImage.load("./imgs/enemySprite.gif");
            Material.coat = enemyCoat;


            enemyTransform.mtxLocal.translateY(0.5);
            enemyTransform.mtxLocal.scaleX(0.5);

            let cmpMat: fc.ComponentMaterial = this.getComponent(fc.ComponentMaterial);
            cmpMat.material = Material;
            new fc.CoatTextured()
        }


    }
}
declare namespace Script {
    import f = FudgeCore;
    class GameState extends f.Mutable {
        protected reduceMutator(_Mutator: f.Mutator): void;
        height: number;
        velocity: number;
        private controller;
        constructor();
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let ship: ƒ.Node;
    let branch: ƒ.Node;
    let cmpMeshTerrain: ƒ.ComponentMesh;
    let terrainMesh: ƒ.MeshTerrain;
    let gameState: GameState;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class SensorScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
    }
}
declare namespace Script {
    import fc = FudgeCore;
    class SpaceShipControls extends fc.ComponentScript {
        static readonly iSubclass: number;
        private rigidbody;
        power: number;
        constructor();
        hndEvent: (_event: Event) => void;
        private audioCrash;
        hndCollision: () => void;
        update: (_event: Event) => void;
        yaw(_value: number): void;
        pitch(_value: number): void;
        roll(_value: number): void;
        backwards(): void;
        thrust(): void;
    }
}
declare namespace Script {
    import ƒAid = FudgeAid;
    enum JOB {
        IDLE = 0,
        ATTACK = 1
    }
    export class StateMachine extends ƒAid.ComponentStateMachine<JOB> {
        static readonly iSubclass: number;
        private static instructions;
        torqueIdle: number;
        private turretJoint;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        private static transitDefault;
        private static actDefault;
        private static actAttack;
        private static actIdle;
        private hndEvent;
        private update;
    }
    export {};
}

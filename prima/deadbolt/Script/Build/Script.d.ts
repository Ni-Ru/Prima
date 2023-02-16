declare namespace Script {
    import fc = FudgeCore;
    import fcAid = FudgeAid;
    let xSpeed: number;
    let usedStairs: boolean;
    let weapon: String;
    let currentAnimation: ƒAid.SpriteSheetAnimation;
    class CharacterComponent extends fc.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        walkSpeed: number;
        hndEvent: (_event: Event) => void;
        update(deltaTime: number): void;
        walk(direction: number): void;
        useStairs(exit: number): void;
        changeWeapon(): void;
        hndThrow(e: MouseEvent): void;
        setSprite(sprite: fcAid.SpriteSheetAnimation): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import fc = FudgeCore;
    class DoorComponent extends fc.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        private openDoorVar;
        hndEvent: (_event: Event) => void;
        getOpenDoorVar(): boolean;
        interaction(): void;
        loadTextures(closed: Boolean): void;
        openDoor(): void;
        closeDoor(): void;
    }
}
declare namespace Script {
    import fAid = FudgeAid;
    class EnemyNode extends fAid.NodeSprite {
        constructor();
    }
}
declare namespace Script {
    import fcAid = FudgeAid;
    enum JOB {
        IDLE = 0,
        SEARCH = 1,
        ATTACK = 2
    }
    export class EnemyStateMachine extends fcAid.ComponentStateMachine<JOB> {
        static readonly iSubclass: number;
        private static instructions;
        constructor();
        static get(): fcAid.StateMachineInstructions<JOB>;
        private static transitDefault;
        private static actDefault;
        private static actIdle;
        private static actSearch;
        private static actAttack;
        private hndEvent;
        private update;
        private checkView;
    }
    export {};
}
declare namespace Script {
    import f = FudgeCore;
    class GameState extends f.Mutable {
        protected reduceMutator(_Mutator: f.Mutator): void;
        stones: number;
        private controller;
        stoneAmount(stones: number, reset: boolean): void;
        constructor(_config: {
            [key: string]: number;
        });
    }
}
declare namespace Script {
    import fc = FudgeCore;
    class GravityComponent extends fc.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        walkSpeed: number;
        private pos;
        private characterPos;
        private obstaclePos;
        private obstacleNode;
        private obstacleMesh;
        private obstacleLength;
        private obstacleHeight;
        private obstacleNodePos;
        private obstacleCalcPos;
        hndEvent: (_event: Event) => void;
        update(deltaTime: number): void;
        checkCollission(): void;
        wallCollission(): void;
        yCollission(): void;
    }
}
declare namespace Script {
    import fc = FudgeCore;
    class InteractComponent extends fc.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        private keyEPressed;
        hndEvent: (_event: Event) => void;
        update(): void;
        actionControls(): void;
        showInteract(): void;
        noInteract(): void;
        checkPlayerPos(): void;
    }
}
declare namespace Script {
    import fc = FudgeCore;
    import fcAid = FudgeAid;
    let characterCmp: CharacterComponent;
    let gravityCmp: GravityComponent;
    let branch: fc.Node;
    let characterPos: fc.Node;
    let characterSprite: fcAid.NodeSprite;
    let idle: ƒAid.SpriteSheetAnimation;
    let walk: ƒAid.SpriteSheetAnimation;
    let attack: ƒAid.SpriteSheetAnimation;
    let gameState: GameState;
    const walkSpeed: number;
    let allowWalkRight: boolean;
    let allowWalkLeft: boolean;
    let attackingMotion: boolean;
    function hndAttack(): void;
}
declare namespace Script {
    import fc = FudgeCore;
    class StairComponent extends fc.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        private activeStairNodePos;
        private activeStairPos;
        private calcActiveStairPos;
        private StairNodePos;
        private StairNode;
        private StairPos;
        private calcStairPos;
        hndEvent: (_event: Event) => void;
        interaction(): void;
        findDoor(): void;
    }
}
declare namespace Script {
    import fAid = FudgeAid;
    import fc = FudgeCore;
    class StoneNode extends fAid.NodeSprite {
        stoneDirection: fc.Vector2;
        constructor(_stoneDirection: fc.Vector2);
        hndCollision: () => void;
    }
}

declare namespace Script {
    import fc = FudgeCore;
    let xSpeed: number;
    let usedStairs: boolean;
    class CharacterComponent extends fc.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        walkSpeed: number;
        private characterPos;
        hndEvent: (_event: Event) => void;
        update(deltaTime: number): void;
        walk(direction: number): void;
        useStairs(exit: number): void;
        hndThrow(e: MouseEvent): void;
        changeWeapon(): void;
        stoneAmount(stones: number): void;
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
    let openDoor: boolean;
    class DoorComponent extends fc.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
        interaction(): void;
        openDoor(): void;
        closeDoor(): void;
    }
}
declare namespace Script {
    import f = FudgeCore;
    class GameState extends f.Mutable {
        protected reduceMutator(_Mutator: f.Mutator): void;
        stones: number;
        private controller;
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
    let characterCmp: CharacterComponent;
    let branch: fc.Node;
    let characterNode: fc.Node;
    let gameState: GameState;
    const walkSpeed: number;
    let allowWalkRight: boolean;
    let allowWalkLeft: boolean;
    let vctMouse: fc.Vector2;
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
    class StoneNode extends fAid.NodeSprite {
        inInventory: boolean;
        constructor();
    }
}

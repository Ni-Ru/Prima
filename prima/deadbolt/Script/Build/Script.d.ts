declare namespace Script {
    import fc = FudgeCore;
    let xSpeed: number;
    class CharacterComponent extends fc.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        walkSpeed: number;
        private characterPos;
        hndEvent: (_event: Event) => void;
        update(deltaTime: number): void;
        walk(direction: number): void;
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
        hndEvent: (_event: Event) => void;
        update(deltaTime: number): void;
        checkCollission(): void;
        wallCollission(): void;
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
    const walkSpeed: number;
    let allowWalkRight: boolean;
    let allowWalkLeft: boolean;
    let branch: fc.Node;
    let characterNode: fc.Node;
}

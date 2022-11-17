declare namespace Script {
}
declare namespace Script {
    import ƒ = FudgeCore;
    class ScriptRotator extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        update: () => void;
        hndEvent: (_event: Event) => void;
    }
}

namespace Script{
    import f = FudgeCore
    import fui = FudgeUserInterface

    export class GameState extends f.Mutable {
        protected reduceMutator(_Mutator : f.Mutator): void {/**/}

        public height: number = 1;
        public velocity: number = 2;
        private controller: fui.Controller

        constructor() {
            super();
            this.controller = new fui.Controller(this, document.getElementById("vui"));
            console.log(this.controller);
        }
    }
}
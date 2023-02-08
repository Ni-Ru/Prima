namespace Script{
    import f = FudgeCore
    import fui = FudgeUserInterface

    export class GameState extends f.Mutable {
        protected reduceMutator(_Mutator : f.Mutator): void {/**/}

        public stones: number;
        private controller: fui.Controller

        constructor(_config: {[key: string]: number}) {
            super();
            this.stones = _config.stones
            this.controller = new fui.Controller(this, document.getElementById("vui"));
            console.log(this.controller);
        }
    }
}
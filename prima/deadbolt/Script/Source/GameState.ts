namespace Script{
    import f = FudgeCore
    import fui = FudgeUserInterface

    export class GameState extends f.Mutable {
        protected reduceMutator(_Mutator : f.Mutator): void {/**/}

        public stones: number;
        private controller: fui.Controller

        stoneAmount(stones: number, reset: boolean){
            if(reset){
                document.getElementById("stoneImgs").innerHTML="";
            }
            for (let i = 0; i < stones; i++){
              let stoneImg = document.createElement("IMG");
              stoneImg.setAttribute("src", "./imgs/stone.gif");
              document.getElementById("stoneImgs").appendChild(stoneImg);
            }
          }

        constructor(_config: {[key: string]: number}) {
            super();
            this.stones = _config.stones
            this.controller = new fui.Controller(this, document.getElementById("vui"));
        }
    }
}
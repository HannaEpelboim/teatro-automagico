class Personagem {
    constructor(nome, id) {
        this.nome = nome;
        this.id = id;
        if(id === "A") {
            this.i = 0;
            this.cor = color(255, 50, 150);
        } else if (id === "B") {
            this.i = 1;
            this.cor = color(50, 150, 0);
        } else if (id === "C") {
            this.i = 2;
            this.cor = color(150, 50, 255);
        } else {
            this.i = -1;
            this.cor = color(0);
        }
        this.x = getPos("offstage-left");
        this.y = height - 120 + 15 * this.i;
        this.rot = 0;
        this.acaoAtual = null;
        this.actionList = [];
    }

    startScene(dadosAtuais, dadosProximos) {
        this.acaoAtual = null;
        this.actionList = [];
        let curr;
        let next;
        let acao;

        curr = dadosAtuais["action"] || "none";
        next = dadosProximos["action"] || "none";
        acao = new Action("act", curr, next, 2000, 5000, this.x);
        this.actionList.unshift(acao);

        curr = dadosAtuais["stage_position"] || "offstage-left";
        next = dadosProximos["stage_position"] || "offstage-left";
        acao = new Action("pes", curr, next, 2000, 16000, this.x);
        this.actionList.unshift(acao);
    }

    atualizar(t) {
        if (this.acaoAtual === null)  {
            if(this.actionList.length > 0) {             
                this.acaoAtual = this.actionList.pop();
                this.acaoAtual.create();
                if(this.acaoAtual.type == "pes") {
                    let pos;
                    switch(this.acaoAtual.next) {
                        case "offstage-left":
                            pos = "ol";
                            break;
                        case "left":
                            pos = "l";
                            break;
                        case "center":
                            pos = "c";
                            break;
                        case "right":
                            pos = "r";
                            break;
                        case "offstage-right":
                            pos = "or";
                            break;
                        default:
                            pos = ""
                            break;
                    }

                    sendToArduino(this.acaoAtual.type+","+ toString(this.i)+","+ pos)
                }
                else if(this.acaoAtual.type == "act"){
                    let act;
                    switch(this.acaoAtual.curr) {
                        case "tilted-left":
                            act = "l";
                            break;
                        case "none":
                            act = "m";
                            break;
                        case "tilted-right":
                            act = "r";
                            break;
                        default:
                            act = ""
                            break;
                    }

                    sendToArduino(this.acaoAtual.type+","+ toString(this.i)+","+ act)
                }
            }
        }
        else {
            if (this.acaoAtual.emAndamento()) {
                this.acaoAtual.act();
                this.x = this.acaoAtual.getX();
                this.rot = this.acaoAtual.getRot();
            }    
            else {
                if(this.acaoAtual.creation !== null) {
                    this.acaoAtual.waitStart();
                } 
                else {
                    this.acaoAtual.encerrar();
                    this.x = this.acaoAtual.getX();
                    this.rot = this.acaoAtual.getRot();
                    this.acaoAtual = null
                }
            }
        } 

        


    }

    desenhar() {
        push();
        translate(this.x, this.y);
        rotate(this.rot);
        stroke(255);
        fill(this.cor);
        rectMode(CENTER);
        rect(0, 0, 40, 50);
        noStroke();
        fill(255);
        textSize(7);
        textAlign(CENTER, CENTER);
        text(this.nome, 0, 0, 30);
        pop();
    }

}

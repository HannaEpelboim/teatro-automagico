class Action {
    constructor(type, curr, next, comeco, duracao, x, origin) {
        this.type = type
        this.comeco = comeco;
        this.duracao = duracao;
        this.inicio = null;
        this.curr = curr;
        this.next = next;
        this.creation = null;
        this.x = x;
        this.rot = 0;
        this.origin = origin;
        this.sent = -1;
    }

    create() {
        this.creation = millis();
    }

    emAndamento() {
        return this.inicio !== null && millis() - this.inicio < this.duracao;
    }

    progresso() {
        if (this.inicio === null) return 0;
        return constrain((millis() - this.inicio) / this.duracao, 0, 1);
    }

    waitStart() {
        if(this.creation !== null && millis() - this.creation > this.comeco) {
            this.inicio = millis();
            this.creation = null;
        }
    }

    act() {
        if(this.curr === "tilted-left" || this.curr === "none" || this.curr === "tilted-right") {
            this.rot = this.leanAction();
        } 
        else if(this.curr === "speaking") {
            this.rot = this.speakAction(); 
        } 
        else if(this.curr === "left" || this.curr === "right" || this.curr === "center" || this.curr === "offstage-left" || this.curr === "offstage-right") {
            this.x = this.walkAction();
        } 
        
        if(!this.emAndamento()) this.encerrar();

    }   

    encerrar() {
        this.rot = 0;
        this.inicio = null;
    }

    speakAction() {
        let n = 2;
        let nmult = 4 * n;
        let intervalo = this.duracao / nmult;
        let qualIntervalo = Math.floor((millis() - this.inicio) / intervalo);

        let t_ = (millis() - this.inicio - qualIntervalo*intervalo) / intervalo;
        if(qualIntervalo % 4 === 0) {
            if(this.sent === 3) this.sent = -1;
            if(this.sent === -1) this.send();
            return lerp(0, getAngle("tilted-right"), t_);
        }
        else if(qualIntervalo % 4 === 1) {
            if(this.sent === 0) this.send();
            return lerp(getAngle("tilted-right"), 0, t_);
        } 
        else if(qualIntervalo % 4 === 2) {
            if(this.sent === 1) this.send();
            return lerp(0, getAngle("tilted-left"), t_);
        }
        else if(qualIntervalo % 4 === 3) {
            if(this.sent === 2) this.send();
            return lerp(getAngle("tilted-left"), 0, t_);
        } 
        
    }

    leanAction() {
        let angle = getAngle(this.curr);

        let intervalo = this.duracao / 2;
        let qualIntervalo = Math.floor((millis() - this.inicio) / intervalo);

        let t_ = (millis() - this.inicio - qualIntervalo*intervalo) / intervalo;
        if(qualIntervalo % 4 === 0) {
            if(this.sent === -1) this.send();
            return lerp(0, angle, t_);
        }
        else if(qualIntervalo % 4 === 1) {
            if(this.sent === 0) this.send();
            return lerp(angle, 0, t_);
        } 
    }

    walkAction() {
        let pos = getPos(this.next);
        let old_pos = getPos(this.curr);
        if(this.sent === -1) this.send();
        return lerp(old_pos, pos, this.progresso());
    }

    send() {
        let info;
        if(this.type === "pes") {
            switch(this.next) {
                case "offstage-left":
                    info = "ol";
                    break;
                case "left":
                    info = "l";
                    break;
                case "center":
                    info = "c";
                    break;
                case "right":
                    info = "r";
                    break;
                case "offstage-right":
                    info = "or";
                    break;
                default:
                    info = ""
                    break;
            }

        }
        else if(this.type === "act"){
            switch(this.curr) {
                case "tilted-left":
                    info = "l";
                    break;
                case "none":
                    info = "m";
                    break;
                case "tilted-right":
                    info = "r";
                    break;
                default:
                    info = ""
                    break;
            }
        }
        sendToArduino(this.type+", "+ this.origin +", "+ info)
        this.sent = this.sent + 1;
    }

    getX() {
        return this.x;
    }

    getRot() {
        return this.rot;
    }

}

class Action {
    constructor(type, curr, next, comeco, duracao, x) {
        this.type = type
        this.comeco = comeco;
        this.duracao = duracao;
        this.inicio = null;
        this.curr = curr;
        this.next = next;
        this.creation = null;
        this.x = x;
        this.rot = 0;
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
        let n = 4;
        let nmult = 4 * n;
        let intervalo = this.duracao / nmult;
        let qualIntervalo = Math.floor((millis() - this.inicio) / intervalo);

        let t_ = (millis() - this.inicio - qualIntervalo*intervalo) / intervalo;
        if(qualIntervalo % 4 === 0) {
            return lerp(0, getAngle("tilted-right"), t_);
        }
        else if(qualIntervalo % 4 === 1) {
            return lerp(getAngle("tilted-right"), 0, t_);
        } 
        else if(qualIntervalo % 4 === 2) {
            return lerp(0, getAngle("tilted-left"), t_);
        }
        else if(qualIntervalo % 4 === 3) {
            return lerp(getAngle("tilted-left"), 0, t_);
        } 
    }

    leanAction() {
        let angle = getAngle(this.curr);

        let intervalo = this.duracao / 2;
        let qualIntervalo = Math.floor((millis() - this.inicio) / intervalo);

        let t_ = (millis() - this.inicio - qualIntervalo*intervalo) / intervalo;
        if(qualIntervalo % 4 === 0) {
            return lerp(0, angle, t_);
        }
        else if(qualIntervalo % 4 === 1) {
            return lerp(angle, 0, t_);
        } 
    }

    walkAction() {
        let pos = getPos(this.next);
        let old_pos = getPos(this.curr);
        return lerp(old_pos, pos, this.progresso());
    }

    getX() {
        return this.x;
    }

    getRot() {
        return this.rot;
    }

}

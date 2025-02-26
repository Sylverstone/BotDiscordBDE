export default class heure {
    constructor(numHeure) {
        this._numHeure = numHeure;
    }
    set numHeure(value) {
        if (value < 0)
            value = 0;
        else if (value > 23)
            value = 23;
        this._numHeure = value;
    }
    get numHeure() {
        return this._numHeure;
    }
    toString() {
        return this._numHeure < 10 ? `0${this._numHeure}` : `${this._numHeure}`;
    }
    toSeconde() {
        return this._numHeure * 3600;
    }
}

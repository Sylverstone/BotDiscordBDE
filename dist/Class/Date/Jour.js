export default class Jour {
    constructor(numJour) {
        if (numJour < 0)
            numJour = 0;
        else if (numJour > 31)
            numJour = 31;
        this._numJour = numJour;
    }
    get numJour() {
        return this._numJour;
    }
    set numJour(numJour) {
        if (numJour < 0)
            numJour = 0;
        else if (numJour > 31)
            numJour = 31;
        this._numJour = numJour;
    }
    toString() {
        if (this._numJour < 10)
            return "0" + this._numJour.toString();
        return this._numJour.toString();
    }
    toSeconde() {
        return this._numJour * 24 * 60 * 60;
    }
}

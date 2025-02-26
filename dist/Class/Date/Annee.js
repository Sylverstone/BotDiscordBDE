export default class annee {
    constructor(annee) {
        this._annee = annee;
    }
    set annee(value) {
        if (value <= 0)
            value = 0;
        this._annee = value;
    }
    get annee() {
        return this._annee;
    }
    toString() {
        return this._annee.toString();
    }
    toSeconde() {
        return this._annee * 365 * 24 * 60 * 60;
    }
}

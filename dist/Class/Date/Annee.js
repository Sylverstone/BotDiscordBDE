export default class annee {
    constructor(annee) {
        this._annee = annee;
    }
    set annee(value) {
        if (value <= 0)
            value = 0;
        this._annee = value;
    }
    isBissextile() {
        return this._annee % 4 === 0 && (this._annee % 100 === 0 || this._annee % 400 === 0);
    }
    get annee() {
        return this._annee;
    }
    toString() {
        return this._annee.toString();
    }
    getNbJour() {
        if (this._annee === 0)
            return 0;
        const ancienneAnne = new annee(this._annee - 1);
        if (this.isBissextile())
            return 366 + ancienneAnne.getNbJour();
        return 365 + ancienneAnne.getNbJour();
    }
    toSeconde() {
        return this.getNbJour() * 24 * 60 * 60;
    }
}

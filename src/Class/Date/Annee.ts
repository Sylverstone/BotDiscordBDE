export default class annee 
{
    private _annee : number;

    constructor(annee : number) {
        this._annee = annee;
    }

    set annee(value : number)
    {
        if(value <= 0)
            value = 0;
        this._annee = value;
    }

    public isBissextile() : boolean
    {
        return this._annee % 4 === 0 && (this._annee % 100 === 0 || this._annee % 400 === 0);
    }

    get annee(): number
    {
        return this._annee;
    }

    public toString(): string
    {
        return this._annee.toString();
    }

    public getNbJour() : number
    {
        if(this._annee === 0)
            return 0;
        const ancienneAnne = new annee(this._annee -1);
        if(this.isBissextile())
            return 366 + ancienneAnne.getNbJour();
        return 365 + ancienneAnne.getNbJour();
    }

    public toSeconde() : number
    {
        return this.getNbJour() * 24 *60 *60;
    }
}
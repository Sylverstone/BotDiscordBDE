export default class mois 
{
    private _numMois : number;
    private maxJour : number;
    private Bissextile : boolean;

    constructor(numMois : number)
    {
        this._numMois = numMois;
        this.maxJour = this.getMaxJour();
        this.Bissextile = this.isBissextile();
    }

    set numMois(numMois : number)
    {
        if(numMois < 1)
            numMois = 1;        
        else if(numMois > 12)
            numMois = 12;
        
        this._numMois = numMois;
    }

    get numMois() : number
    {
        return this._numMois;
    }

    public isBissextile() : boolean
    {
        return this.numMois % 4 === 0 && (this.numMois % 100 === 0 || this.numMois % 400 === 0); 
    }

    public getMaxJour() : number 
    {
        if(this.numMois <= 7 && this.numMois !== 2)
            return this.numMois % 2 === 0 ? 30 : 31;
        else if(this.numMois > 7)
            return this.numMois % 2 === 0 ? 31 : 30;
        else 
            return this.Bissextile ? 29 : 28;
    }

    public toString() : string
    {
        const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
        return mois[this._numMois - 1];
    }

    public toNum() : string 
    {
        return this.numMois < 10 ? `0${this._numMois}` : `${this._numMois}`;
    }

    

    public toSeconde() : number 
    {
        return this.numMois * this.maxJour * 24 * 60 * 60;
    }
}
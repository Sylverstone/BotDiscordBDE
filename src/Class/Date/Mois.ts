import annee  from "./Annee";
export default class mois
{
    private _numMois : number;
    private maxJour : number;
    private Bissextile : boolean;
    private year : annee;

    constructor(numMois : number, year : annee)
    {
        this._numMois = numMois;
        this.maxJour = this.getMaxJour();
        this.Bissextile = year.isBissextile();
        this.year = year;
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

    

    //Renvoie le nombre de jour
    public getNbJour() : number
    {
        if(this.numMois == 1)
            return 0;
        const ancienneMois = new mois(this._numMois - 1,this.year);
        return ancienneMois.getMaxJour() + ancienneMois.getNbJour();
    }

    public toSeconde() : number
    {
        return this.getNbJour() * 24 * 60 *60;
    }
}
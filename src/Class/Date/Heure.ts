export default class heure 
{
    private _numHeure : number;

    constructor(numHeure : number)
    {
        this._numHeure = numHeure;
    }

    set numHeure(value : number)
    {
        if(value < 0)
            value = 0;
        else if(value > 23)
             value = 23;
        this._numHeure = value;
    }

    get numHeure() : number
    {
        return this._numHeure;
    }

    public toString() : string 
    {
        return this._numHeure < 10 ? `0${this._numHeure}` : `${this._numHeure}`;
    }

    public toSeconde() : number 
    {
        return this._numHeure * 60 * 60;
    }
}
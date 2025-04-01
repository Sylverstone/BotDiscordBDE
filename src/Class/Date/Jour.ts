export default class Jour 
{
    private _numJour : number;

    constructor(numJour : number)
    {
        if (numJour < 0)
            numJour = 0;
        else if(numJour > 31)
            numJour = 31;
        this._numJour = numJour;
    }

    get numJour(): number
    {
        return this._numJour;
    }

    set numJour(numJour: number)
    {
        if (numJour < 0)
            numJour = 0;
        else if(numJour > 31)
            numJour = 31;
        this._numJour = numJour;
    }

    public toString() : string 
    {
        if(this._numJour < 10)
            return "0" + this._numJour.toString();
        return this._numJour.toString();
    }

    public toSeconde() : number 
    {
        return this._numJour * 24 * 60 * 60;
    }

}
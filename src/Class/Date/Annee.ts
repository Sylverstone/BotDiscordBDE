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

    get annee(): number
    {
        return this._annee;
    }

    public toString(): string
    {
        return this._annee.toString();
    }

    public toSeconde() : number
    {
        return this._annee * 365 * 24 * 60 * 60;
    }
}
export default class minute 
{
    private _seconde: number;

    constructor(minute: number) {
        this._seconde = minute;
    }

    get seconde(): number {
        return this._seconde;
    }
    
    set seconde(value: number)
    {
        if(value < 0)
            value = 0;
        else if(value > 59)
            value = 59;
        this._seconde = value;
    }

    public toString() : string
    {
        return this._seconde < 10? `0${this._seconde}` : `${this._seconde}`;
    }

    public toSeconde() : number
    {
        return this._seconde;
    }

}

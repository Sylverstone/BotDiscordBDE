export default class minute 
{
    private _minute: number;

    constructor(minute: number) {
        this._minute = minute;
    }

    get minute(): number {
        return this._minute;
    }
    
    set minute(value: number)
    {
        if(value < 0)
            value = 0;
        else if(value > 59)
            value = 59;
        this._minute = value;
    }

    public toString() : string
    {
        return this._minute < 10? `0${this._minute}` : `${this._minute}`;
    }

    public toSeconde() : number
    {
        return this._minute * 60;
    }

}

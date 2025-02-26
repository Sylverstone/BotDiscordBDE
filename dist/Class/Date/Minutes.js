export default class minute {
    constructor(minute) {
        this._minute = minute;
    }
    get minute() {
        return this._minute;
    }
    set minute(value) {
        if (value < 0)
            value = 0;
        else if (value > 59)
            value = 59;
        this._minute = value;
    }
    toString() {
        return this._minute < 10 ? `0${this._minute}` : `${this._minute}`;
    }
    toSeconde() {
        return this._minute * 60;
    }
}

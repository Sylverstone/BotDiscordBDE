export default class minute {
    constructor(minute) {
        this._seconde = minute;
    }
    get seconde() {
        return this._seconde;
    }
    set seconde(value) {
        if (value < 0)
            value = 0;
        else if (value > 59)
            value = 59;
        this._seconde = value;
    }
    toString() {
        return this._seconde < 10 ? `0${this._seconde}` : `${this._seconde}`;
    }
    toSeconde() {
        return this._seconde;
    }
}

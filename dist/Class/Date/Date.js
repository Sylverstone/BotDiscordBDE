import annee from "./Annee.js";
import heure from "./Heure.js";
import Jour from "./Jour.js";
import minute from "./Minutes.js";
import mois from "./Mois.js";
import seconde from "./Seconde.js";
import * as util from "util";
export default class date {
    constructor(date = "") {
        if (date !== "") {
            const dateSplit = date.split(" ");
            if (dateSplit.length === 1)
                dateSplit.push("00:00:00");
            const datePart = dateSplit[0].split("-");
            if (datePart.length !== 3)
                throw new Error("Date invalide");
            this._jour = new Jour(parseInt(datePart[0]));
            this._mois = new mois(parseInt(datePart[1]));
            this._annee = new annee(parseInt(datePart[2]));
            const heurePart = dateSplit[1].split(":");
            if (heurePart.length !== 3)
                throw new Error("Heure invalide");
            this._heure = new heure(parseInt(heurePart[0]));
            this._minute = new minute(parseInt(heurePart[1]));
            this._seconde = new seconde(parseInt(heurePart[2]));
        }
        else {
            const dateActu = new Date().toISOString().slice(0, 19).replace("T", " ");
            const dateSplit = dateActu.split(" ");
            const datePart = dateSplit[0].split("-");
            if (datePart.length !== 3)
                throw new Error("Date invalide");
            this._jour = new Jour(parseInt(datePart[2]));
            this._mois = new mois(parseInt(datePart[1]));
            this._annee = new annee(parseInt(datePart[0]));
            const heurePart = dateSplit[1].split(":");
            if (heurePart.length !== 3)
                throw new Error("Heure invalide");
            this._heure = new heure(parseInt(heurePart[0]));
            this._minute = new minute(parseInt(heurePart[1]));
            this._seconde = new seconde(parseInt(heurePart[2]));
        }
    }
    [util.inspect.custom]() {
        return `\nDate : ${this.toString()}\nDate (origin Date type) : ${this.toDate()}\n Time : ${this.getTime()}\n`;
    }
    toDate() {
        return new Date(this.toString());
    }
    getHours() {
        return `${this._heure.toString()}:${this._minute.toString()}:${this._seconde.toString()}`;
    }
    getTime() {
        return this._annee.toSeconde() + this._mois.toSeconde() + this._jour.toSeconde() + this._heure.toSeconde() + this._minute.toSeconde() + this._seconde.seconde;
    }
    toString() {
        return `${this._annee.toString()}-${this._mois.toNum()}-${this._jour.toString()} ${this._heure.toString()}:${this._minute.toString()}:${this._seconde.toString()}`;
    }
    setHours(hours, minutes) {
        this._heure = new heure(hours);
        this._minute = new minute(minutes);
    }
}

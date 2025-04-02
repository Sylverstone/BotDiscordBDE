import annee from "./Annee.js";
import heure from "./Heure.js";
import Jour from "./Jour.js";
import minute from "./Minutes.js";
import mois from "./Mois.js";
import seconde from "./Seconde.js";
import * as util from "util";
import { InvalidDateError } from "../Errors/InvalidDate.js";
export default class date {
    /**
     * @constructor
     * @param {string} strDate  Date au format jj-mm-yyyy HH:mm:ss où l'heure n'est pas obligatoire.
     * @returns retourne la date rentrée en string ou la date actuelle si rien n'est mis en paramètre.
     * @exception {InvalidDateError} Quand la date n'est pas dans un format valide
     */
    constructor(strDate = "") {
        if (strDate !== "") {
            if (!date.IsDate(strDate))
                throw new InvalidDateError("Invalid date");
            const dateSplit = strDate.split(" ");
            if (dateSplit.length === 1)
                dateSplit.push("00:00:00");
            const datePart = dateSplit[0].split("-");
            if (datePart.length !== 3)
                throw new Error("Date invalide");
            this._jour = new Jour(parseInt(datePart[0]));
            this._annee = new annee(parseInt(datePart[2]));
            this._mois = new mois(parseInt(datePart[1]), this._annee);
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
            this._annee = new annee(parseInt(datePart[0]));
            this._mois = new mois(parseInt(datePart[1]), this._annee);
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
    //Renvoie true si ndate est une date cohérente (au niveau du format.)
    static IsDate(ndate) {
        let jour = "";
        let mois = "";
        let annee = "";
        if (ndate.includes("/")) {
            const split = ndate.split("/");
            return split.length === 3;
        }
        else if (ndate.includes("-")) {
            const split = ndate.split("-");
            return split.length === 3;
        }
        return false;
    }
    /**
     *
     * @returns {Date} - une date au format Date équivalente
     */
    toDate() {
        return new Date(this.toString());
    }
    /**
     *
     * @returns {string} - l'heure au format HH:mm:ss
     */
    getHours() {
        return `${this._heure.toString()}:${this._minute.toString()}:${this._seconde.toString()}`;
    }
    /**
     *
     * @returns {number} - la date converti en seconde, utile pour les comparaison de date !
     */
    getTime() {
        return this._annee.toSeconde() + this._mois.toSeconde() + this._jour.toSeconde() + this._heure.toSeconde() + this._minute.toSeconde() + this._seconde.seconde;
    }
    /**
     *
     * @returns {number} - le jour de la date
     */
    getDay() {
        return this._jour.numJour;
    }
    /**
     *
     * @returns {number} - le mois de la date
     */
    getMonth() {
        return this._mois.numMois;
    }
    /**
     *
     * @return {number} - l'année de la date
     */
    getYear() {
        return this._annee.annee;
    }
    /**
     * Retourne un format date compatible avec le type MySQL Timestamp
     * @returns {string} - date au format sql timestamp
     */
    toString() {
        return `${this._annee.toString()}-${this._mois.toNum()}-${this._jour.toString()} ${this._heure.toString()}:${this._minute.toString()}:${this._seconde.toString()}`;
    }
    /**
     *
     * @param {number} hours - l'heure de la date
     * @param {number} minutes - les minutes de la date
     * @param {number} secondes - les secondes de la date
     */
    setHours(hours = -1, minutes = -1, secondes = -1) {
        this._heure = hours != -1 ? new heure(hours) : this._heure;
        this._minute = minutes != -1 ? new minute(minutes) : this._minute;
        this._seconde = secondes != -1 ? new seconde(secondes) : this._seconde;
    }
}

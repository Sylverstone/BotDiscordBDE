import annee from "./Annee.js";
import heure from "./Heure.js";
import Jour from "./Jour.js";
import minute from "./Minutes.js";
import mois from "./Mois.js";
import seconde from "./Seconde.js";
import * as util from "util";
export default class date 
{
    private _jour : Jour;
    private _mois : mois;
    private _annee : annee;
    private _heure : heure;
    private _minute : minute;
    private _seconde : seconde;

    constructor(date : string = "")
    {
        if(date !== "")
        {
            const dateSplit = date.split(" ");
            if(dateSplit.length === 1)
                dateSplit.push("00:00:00");
            
            const datePart = dateSplit[0].split("-");
    
            if(datePart.length !== 3) throw new Error("Date invalide");
            
            this._jour = new Jour(parseInt(datePart[0]));
            this._mois = new mois(parseInt(datePart[1]));
            this._annee = new annee(parseInt(datePart[2]));
    
            const heurePart = dateSplit[1].split(":");
            if(heurePart.length!== 3) throw new Error("Heure invalide");
    
            this._heure = new heure(parseInt(heurePart[0]));
            this._minute = new minute(parseInt(heurePart[1]));
            this._seconde = new seconde(parseInt(heurePart[2]));
        }
        else
        {
            const dateActu = new Date().toISOString().slice(0,19).replace("T", " ");
            const dateSplit = dateActu.split(" ");

            const datePart = dateSplit[0].split("-");
            if(datePart.length !== 3) throw new Error("Date invalide");
            
            this._jour = new Jour(parseInt(datePart[2]));
            this._mois = new mois(parseInt(datePart[1]));
            this._annee = new annee(parseInt(datePart[0]));
            
            const heurePart = dateSplit[1].split(":");
            if(heurePart.length!== 3) throw new Error("Heure invalide");
    
            this._heure = new heure(parseInt(heurePart[0]));
            this._minute = new minute(parseInt(heurePart[1]));
            this._seconde = new seconde(parseInt(heurePart[2]));   
        }
    }

    [util.inspect.custom]() : string {
        return `\nDate : ${this.toString()}\nDate (origin Date type) : ${this.toDate()}\n Time : ${this.getTime()}\n`;
    }
    
    public toDate(): Date
    {
        return new Date(this.toString());
    }

    public getHours(): string 
    {
        return `${this._heure.toString()}:${this._minute.toString()}:${this._seconde.toString()}`;
    }
    public getTime() : number
    {
        return this._annee.toSeconde() + this._mois.toSeconde() + this._jour.toSeconde() + this._heure.toSeconde() + this._minute.toSeconde() + this._seconde.seconde;
    }

    public toString() : string
    {
        return `${this._annee.toString()}-${this._mois.toNum()}-${this._jour.toString()} ${this._heure.toString()}:${this._minute.toString()}:${this._seconde.toString()}`;
    }

    public setHours(hours : number, minutes : number)
    {
        this._heure = new heure(hours);
        this._minute = new minute(minutes);
    }
}
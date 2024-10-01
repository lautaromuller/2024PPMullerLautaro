import { Vehiculo } from "./Vehiculo.js";


export default class Aereo extends Vehiculo{
    constructor(id,modelo,anoFab,velMax, altMax, autonomia){
        super(id,modelo,anoFab,velMax)
        if(altMax > 0 && autonomia > 0){
            this.altMax = altMax;
            this.autonomia = autonomia;
        }
    }
}
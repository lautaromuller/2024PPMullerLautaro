import { Vehiculo } from "./Vehiculo.js";


export default class Terrestre extends Vehiculo{
    constructor(id,modelo,anoFab,velMax, cantPue, cantRue){
        super(id,modelo,anoFab,velMax)
        if(cantPue > -1 && cantRue> 0){
            this.cantPue = cantPue;
            this.cantRue = cantRue;
        }
    }
}
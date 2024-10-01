export class Vehiculo {

    constructor(id, modelo, anoFab, velMax) {
        if (id > 0 && modelo && anoFab > 1885 && velMax > 0) {
            this.id = id;
            this.modelo = modelo ? modelo : '';
            this.anoFab = anoFab ? anoFab : 1886;
            this.velMax = velMax ? velMax : 1;
        }
    }

    toString() {
        return `Id: ${this.id}, Modelo: ${this.modelo}, Año de fabricación: ${this.anoFab}, Velocidad máxima: ${this.velMax}`;
    }
}
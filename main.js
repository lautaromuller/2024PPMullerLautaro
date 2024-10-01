import Aereo from './Aereo.js';
import Terrestre from './Terrestre.js';

const jsonString = '[{"id":14, "modelo":"Ferrari F100", "anoFab":1998, "velMax":400, "cantPue":2, "cantRue":4},{"id":51, "modelo":"Dodge Viper", "anoFab":1991, "velMax":266, "cantPue":2, "cantRue":4},{"id":67, "modelo":"Boeing CH-47 Chinook", "anoFab":1962, "velMax":302, "altMax":6, "autonomia":1200},{"id":666, "modelo":"Aprilia RSV 1000 R", "anoFab":2004, "velMax":280, "cantPue":0, "cantRue":2},{"id":872, "modelo":"Boeing 747-400", "anoFab":1989, "velMax":988, "altMax":13, "autonomia":13450},{"id":742, "modelo":"Cessna CH-1 SkyhookR", "anoFab":1953, "velMax":174, "altMax":3, "autonomia":870}]'

const data = JSON.parse(jsonString);

const vehiculosCargados = data.map(obj => {
    if (obj.altMax || obj.autonomia) {
        return new Aereo(obj.id, obj.modelo, obj.anoFab, obj.velMax, obj.altMax, obj.autonomia);
    }
    else if (obj.cantPue || obj.cantRue) {
        return new Terrestre(obj.id, obj.modelo, obj.anoFab, obj.velMax, obj.cantPue, obj.cantRue);
    }
});


let filtroActual = document.getElementById("filtro").value

const crearId = () => {
    return vehiculosCargados.length ? Math.max(...vehiculosCargados.map(p => p.id)) + 1 : 1;
}

const arrFiltrados = (array) => {
    let a = array.filter((elemento) => {
        if ((filtro.value == "1" && elemento instanceof Aereo) || (filtro.value == "2" && elemento instanceof Terrestre) || filtro.value == "0") {
            return true;
        }
        return false;
    });
    return a
}


function DibujarTabla(array) {
    const tbody = document.querySelector('#miTabla tbody');
    const thead = document.querySelector('#miTabla thead');
    tbody.innerHTML = '';
    thead.innerHTML = '';

    const columnas = [
        { id: 'chkid', nombre: 'ID', key: 'id' },
        { id: 'chkModelo', nombre: 'Modelo', key: 'modelo' },
        { id: 'chkAnoFab', nombre: 'AnoFab', key: 'anoFab' },
        { id: 'chkVelMax', nombre: 'VelMax', key: 'velMax' },
        { id: 'chkAltMax', nombre: 'AltMax', key: 'altMax' },
        { id: 'chkAutonomia', nombre: 'Autonomia', key: 'autonomia' },
        { id: 'chkCantPue', nombre: 'CantPue', key: 'cantPue' },
        { id: 'chkCantRue', nombre: 'CantRue', key: 'cantRue' }
    ];

    const columSeleccionadas = columnas.filter(col => document.getElementById(col.id).checked);
    const encabezados = document.createElement('tr');

    columSeleccionadas.forEach(col => {
        const encabezado = document.createElement('th');
        encabezado.textContent = col.nombre;

        encabezado.addEventListener('dblclick', () => {
            array.sort((a, b) => {
                const valorA = a[col.key] !== undefined ? a[col.key] : null;
                const valorB = b[col.key] !== undefined ? b[col.key] : null;

                if (['id', 'anoFab', 'velMax', 'altMax', 'autonomia', 'cantPue', 'cantRue'].includes(col.key)) {
                    return (valorA || Infinity) - (valorB || Infinity);
                } else {
                    return valorA.localeCompare(valorB);
                }
            });

            DibujarTabla(array);
        });

        encabezados.appendChild(encabezado);
    });
    thead.appendChild(encabezados);

    arrFiltrados(array).forEach(elem => {
        if (elem) {

            const fila = document.createElement("tr");
            fila.setAttribute('data-id', elem.id);

            columSeleccionadas.forEach(col => {
                const celda = document.createElement('td');
                celda.textContent = elem[col.key] !== undefined ? elem[col.key] : '-';
                fila.appendChild(celda);
            });

            fila.addEventListener('dblclick', () => {
                document.getElementById('guardarBtn').style.display = 'none'
                document.getElementById('modificarBtn').style.display = ''
                mostrarFormularioABM(elem);
            });

            tbody.appendChild(fila);
        }
    });
}

const habilitarPorTipo = (datos) => {
    document.getElementById('abmAltMax').disabled = !datos;
    document.getElementById('abmAutonomia').disabled = !datos;
    document.getElementById('abmCantPue').disabled = datos;
    document.getElementById('abmCantRue').disabled = datos;
};

const habilitarCampos = (datos) => {
    document.getElementById('abmAltMax').disabled = datos;
    document.getElementById('abmAutonomia').disabled = datos;
    document.getElementById('abmCantPue').disabled = datos;
    document.getElementById('abmCantRue').disabled = datos;
    document.getElementById('abmAltMax').value = '';
    document.getElementById('abmAutonomia').value = '';
    document.getElementById('abmCantPue').value = '';
    document.getElementById('abmCantRue').value = '';
};


function mostrarFormularioABM(datos = {}) {
    document.getElementById('formDatos').style.display = 'none';
    document.getElementById('formABM').style.display = 'block';

    document.getElementById('abmId').value = datos.id || '';
    document.getElementById('abmId').disabled = true;
    document.getElementById('abmModelo').value = datos.modelo || '';
    document.getElementById('abmAnoFab').value = datos.anoFab || '';
    document.getElementById('abmVelMax').value = datos.velMax || '';
    if (datos.altMax || datos.autonomia) {
        document.getElementById('abmAltMax').value = datos.altMax;
        document.getElementById('abmAutonomia').value = datos.autonomia;
        document.getElementById('abmCantPue').value = '';
        document.getElementById('abmCantRue').value = '';
        document.getElementById('tipoVehiculo').value = '1';
        habilitarPorTipo(true);
    } else if (datos.cantPue || datos.cantRue) {
        document.getElementById('abmCantPue').value = datos.cantPue || '';
        document.getElementById('abmCantRue').value = datos.cantRue || '';
        document.getElementById('abmAltMax').value = '';
        document.getElementById('abmAutonomia').value = '';
        document.getElementById('tipoVehiculo').value = '2';
        habilitarPorTipo(false);
    }
}

document.getElementById('calcularBtn').addEventListener('click', () => {

    filtroActual = document.getElementById("filtro").value
    let vehiculosFiltrados = arrFiltrados(vehiculosCargados)
    let velocidadTotal = vehiculosFiltrados.reduce((total, elemen) => total + elemen.velMax, 0);

    document.getElementById("promedioVelocidad").value = velocidadTotal / vehiculosFiltrados.length;
});

document.getElementById('agregarBtn').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('guardarBtn').style.display = ''
    document.getElementById('modificarBtn').style.display = 'none'
    document.getElementById('tipoVehiculo').value = '0'
    habilitarCampos(true)

    mostrarFormularioABM({});
});

document.getElementById('guardarBtn').addEventListener('click', () => {
    const id = document.getElementById('abmId').value || crearId();
    const modelo = document.getElementById('abmModelo').value;
    const anoFab = document.getElementById('abmAnoFab').value;
    const velMax = document.getElementById('abmVelMax').value;
    const altMax = document.getElementById('abmAltMax').value;
    const autonomia = document.getElementById('abmAutonomia').value;
    const cantPuertas = document.getElementById('abmCantPue').value;
    const cantRuedas = document.getElementById('abmCantRue').value;
    console.log(id)

    if (!modelo) {
        alert("El modelo no puede quedar vacio")
        return
    }
    if (anoFab <= 1885) {
        alert("El año de fabricación debe ser mayor a 1885")
        return
    }
    if (velMax <= 0) {
        alert("La velocidad maxima debe ser mayor a cero")
        return
    }

    if (document.getElementById('tipoVehiculo').value != '0') {
        if ((altMax && autonomia) || (cantPuertas && cantRuedas)) {
            if ((altMax && autonomia)) {
                if (altMax <= 0) {
                    alert("Altura maxima debe ser mayor a cero")
                    return
                }
                if (autonomia <= 0) {
                    alert("Autonomia debe ser mayor a cero")
                    return
                }

                const indice = vehiculosCargados.findIndex(item => item.id === parseInt(id));

                if (indice !== -1) vehiculosCargados[indice] = new Aereo(id, modelo, anoFab, velMax, altMax, autonomia);
                else vehiculosCargados.push(new Aereo(id, modelo, anoFab, velMax, altMax, autonomia))
            } else if ((cantPuertas && cantRuedas)) {
                if (cantPuertas <= -1) {
                    alert("Cantidad Puertas debe ser mayor a -1")
                    return
                }
                if (cantRuedas <= 0) {
                    alert("Cantidad Ruedas debe ser mayor a cero")
                    return
                }

                const indice = vehiculosCargados.findIndex(item => item.id === parseInt(id));
                if (indice !== -1) vehiculosCargados[indice] = new Terrestre(id, modelo, anoFab, velMax, cantPuertas, cantRuedas);
                else vehiculosCargados.push(new Terrestre(id, modelo, anoFab, velMax, cantPuertas, cantRuedas))
            }
        } else {
            alert("faltan datos por completar")
            return
        }
    } else {
        alert("Seleccione un tipo de vehiculo")
        return
    }

    document.getElementById('formDatos').style.display = 'block';
    document.getElementById('formABM').style.display = 'none';
    DibujarTabla(vehiculosCargados);
});

document.getElementById('modificarBtn').addEventListener('click', () => {
    const id = document.getElementById('abmId').value;
    const modelo = document.getElementById('abmModelo').value;
    const anoFab = document.getElementById('abmAnoFab').value;
    const velMax = document.getElementById('abmVelMax').value;
    const altMax = document.getElementById('abmAltMax').value;
    const autonomia = document.getElementById('abmAutonomia').value;
    const cantPuertas = document.getElementById('abmCantPue').value;
    const cantRuedas = document.getElementById('abmCantRue').value;

    if (!modelo) {
        alert("El modelo no puede quedar vacio");
        return;
    }
    if (anoFab <= 1885) {
        alert("El año de fabricación debe ser mayor a 1885");
        return;
    }
    if (velMax <= 0) {
        alert("La velocidad maxima debe ser mayor a cero");
        return;
    }

    const indice = vehiculosCargados.findIndex(item => item.id === parseInt(id));

    if (indice !== -1) {
        if (document.getElementById('tipoVehiculo').value == '1') {
            if (altMax > 0 && autonomia > 0) {
                vehiculosCargados[indice] = new Aereo(id, modelo, anoFab, velMax, altMax, autonomia);
            } else {
                alert("Altura máxima y autonomía deben ser mayores a cero.");
                return;
            }
        } else {
            if (cantPuertas >= 0 && cantRuedas > 0) {
                vehiculosCargados[indice] = new Terrestre(id, modelo, anoFab, velMax, cantPuertas, cantRuedas);
            } else {
                alert("Cantidad de puertas y ruedas deben ser válidas.");
                return;
            }
        }
    }

    document.getElementById('formDatos').style.display = 'block';
    document.getElementById('formABM').style.display = 'none';
    DibujarTabla(vehiculosCargados);
});

document.getElementById('eliminarBtn').addEventListener('click', () => {
    const idAEliminar = document.getElementById('abmId').value;

    const indice = vehiculosCargados.findIndex(elemento => {
        return elemento.id === idAEliminar
    });

    if (indice !== -1) {
        vehiculosCargados.splice(indice, 1);
    }

    document.getElementById('formDatos').style.display = 'block';
    document.getElementById('formABM').style.display = 'none';
    DibujarTabla(vehiculosCargados);
});


document.getElementById('cancelarBtn').addEventListener('click', () => {
    document.getElementById('formDatos').style.display = 'block';
    document.getElementById('formABM').style.display = 'none';
});


document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        DibujarTabla(vehiculosCargados);
    });
});


document.getElementById('filtro').addEventListener('click', () => {
    if (filtro.value !== filtroActual) {
        document.getElementById("promedioVelocidad").value = ""
    }
    DibujarTabla(vehiculosCargados)
})

window.addEventListener('load', () => {
    DibujarTabla(vehiculosCargados)
})


document.getElementById('tipoVehiculo').addEventListener('change', () => {
    if (tipoVehiculo.value == '1') {
        document.getElementById('abmCantPue').disabled = true;
        document.getElementById('abmCantRue').disabled = true;
        document.getElementById('abmAltMax').disabled = false;
        document.getElementById('abmAutonomia').disabled = false;
    } else if (tipoVehiculo.value == '2') {
        document.getElementById('abmCantPue').disabled = false;
        document.getElementById('abmCantRue').disabled = false;
        document.getElementById('abmAltMax').disabled = true;
        document.getElementById('abmAutonomia').disabled = true;
    }
})
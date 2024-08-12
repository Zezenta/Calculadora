const botones = document.querySelectorAll('.container__boton'); //seleccionamos todos los botones
let numerosOperables = [];  //array 2d vacio, que va a contener todos los numeros a operar, junto con su identificador de operacion
let filaDeNumeros = []; //array individual que tiene los numeros a operar, que se almacena en el array 2d
const operaciones = ['+', '-', '%', '÷', 'x'];

//funcion que se ejecuta cuando apretamos un boton
const identificarNumeros = (event) => {

    //verificamos que el contenido del event sea un numero, en caso de no serlo no se hace push a la fila de numeros
    if (!isNaN(parseInt(event.target.textContent))) {
        filaDeNumeros.push(event.target.textContent);
    }
    
    //Ejecutamos solo cuando tenemos al menos un numero en el array
    if (filaDeNumeros.length > 0) {
        //verificamos que boton de operacion apretamos, segun eso hacemos una accion u otra
        switch (event.target.textContent) {
            case 'C':

                break;
            case 'AC':

                break;
            case '%':
                filaDeNumeros.unshift('%');
                numerosOperables.push(filaDeNumeros.slice())
                filaDeNumeros.length = 0;
                break;
            case '÷':
                filaDeNumeros.unshift('÷');
                numerosOperables.push(filaDeNumeros.slice())
                filaDeNumeros.length = 0;
                break;
            case 'x':
                filaDeNumeros.unshift('x');
                numerosOperables.push(filaDeNumeros.slice())
                filaDeNumeros.length = 0;
                break;
            case '-':
                filaDeNumeros.unshift('-');
                numerosOperables.push(filaDeNumeros.slice())
                filaDeNumeros.length = 0;
                break;
            case '+':
                filaDeNumeros.unshift('+');
                numerosOperables.push(filaDeNumeros.slice())
                filaDeNumeros.length = 0;
                break;
            case ',':
                break;
            case '=':
                filaDeNumeros.unshift('=');
                numerosOperables.push(filaDeNumeros.slice())
                filaDeNumeros.length = 0;
                console.log(numerosOperables);
                console.log(checkOp(numerosOperables, '+'));
                

                //Se itera solo cuando exista las siguientes operaciones pendientes.
                while (numerosOperables.length > 0) {
                    //verificamos primeramente si tenemos operaciones de mult y div, para ejecutarlas primero, segun jerarquia.
                    if (checkOp(numerosOperables, 'x') || checkOp(numerosOperables, '÷')) {
                        for (let i = numerosOperables.length - 1; i >= 0; i--) {
                            if (numerosOperables[i][0] === 'x') {
                                let multiplicando = multiplicar(numerosOperables[i], numerosOperables[i+1])
                                console.log(multiplicando);
                                
                            } else if (numerosOperables[i][0] === '÷') {
                                let dividiendo = dividir(numerosOperables[i], numerosOperables[i+1])
                                console.log(dividiendo);
                                
                            }
                        }
                    } else {
                        for (let i = numerosOperables.length - 1; i >= 0; i--) {
                            if (numerosOperables[i][0] === '+') {
                                let sumando = sumar(numerosOperables[i], numerosOperables[i+1])

                            } else if (numerosOperables[i][0] === '-') {
                                let restando = restar(numerosOperables[i], numerosOperables[i+1])
                                
                            }
                        }
                    }
                }
            break;
        }
    }
}

//funcion que verifica que operaciones tenemos en el array 2d
function checkOp(array, valor) {
    return array.some(subArray => subArray.includes(valor));
}


function fromArrayToNumber(op1, op2) {
    //quitamos el primer elemento, que es el identificador de operacion, y solo dejamos las cantidades
    op1.shift()
    op2.shift()
    //unimos el array de strings sin espacios, y lo convertimos con la funcion Number, que funciona para ints y floats.
    op1 = Number(op1.join(''));
    op2 = Number(op2.join(''));

    return {op1, op2};
}


//funciones de operaciones
function sumar(op1, op2) {
    let numbers = fromArrayToNumber(op1, op2);
    return numbers.op1 + numbers.op2;
}
function restar(op1, op2) {
    let numbers = fromArrayToNumber(op1, op2);
    return numbers.op1 - numbers.op2;
}
function multiplicar(op1, op2) {
    let numbers = fromArrayToNumber(op1, op2);
    return numbers.op1 * numbers.op2;
}
function dividir(op1, op2) {
    let numbers = fromArrayToNumber(op1, op2);
    return numbers.op1 / numbers.op2;
}
function sacarPorcentaje(op1, op2) {
    
}












botones.forEach(boton => {
    boton.addEventListener('click', identificarNumeros) //funcion que se ejecuta cada vez que le damos click a un boton
})


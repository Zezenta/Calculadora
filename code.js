const botones = document.querySelectorAll('.container__boton'); //seleccionamos todos los botones
const textoPantalla = document.querySelector('.container__textoPantalla') //etiqueta p de texto en la pantalla

let numerosOperables = [];  //array 2d vacio, que va a contener todos los numeros a operar, junto con su identificador de operacion
let filaDeNumeros = []; //array individual que tiene los numeros a operar, que se almacena en el array 2d
let sacandoPorcentaje= []; //En caso de tener porcentajes, guardamos la transformacion de 9% a 0.09 aqui y manipulamos
let operadores = ['x', '+', '-', '÷', 'AC', 'C', '='];
let percentaje = false;     //Para determinar si actualmente se esta manipulando un numero con porcentaje
let operandoSigno = false;  //Para identificar si en el momento tenemos en pantalla un signo de operacion
let solved = false;    //Para determinar si recien se opero un numero, entonces no se permite modificarlo

//funcion que se ejecuta cuando apretamos un boton
const identificarNumeros = (event) => {
    let evento = event.target.textContent;  //numero o boton que presionamos, en formato str por default
    
    if (!operadores.includes(evento) && !percentaje && !solved) {
        //Hacemos push todo lo que no sea un signo, sin tomar en cuenta el % y el . , no repetimos le punto 
        if (evento !== '%') {
            filaDeNumeros.push(evento);
            //en caso de haber puntos repetidos, se eliminan del array y de la pantalla 
            evento === '.' && operandoSigno ? (filaDeNumeros.pop(), textoPantalla.textContent = textoPantalla.textContent.slice(0, -1)) : null;
            operandoSigno = false;
        }
        textoPantalla.textContent += evento;
        evento === '.' ? operandoSigno = true : null;

    } else if(evento === 'AC') {
        //Reiniciamos todo en caso de borrar completo
        filaDeNumeros.length = 0;
        numerosOperables.length = 0;
        textoPantalla.textContent = '';
        solved = false;
        percentaje = false;
        operandoSigno = false;

    } else if(evento === 'C' && !solved) {
        //Condicion para borrar la fila que escribimos antes de designarle un operador
        if (filaDeNumeros.length > 0) {
            filaDeNumeros.pop();
            textoPantalla.textContent = textoPantalla.textContent.slice(0, -1);     //eliminamos el ultimo elemento

        } else if(filaDeNumeros.length === 0 && numerosOperables.length > 0){   //Siguiente elemento, es el operador
            if(textoPantalla.textContent.charAt(textoPantalla.textContent.length - 1) === '%') {    //determinamos si el siguiente operador es %
                textoPantalla.textContent = textoPantalla.textContent.slice(0, -1); //borramos un espacio
                let numeroDePorcentaje = Number(numerosOperables[numerosOperables.length - 1].join('')); //guardamos el valor del porcentaje
                numeroDePorcentaje *= 100;  //lo convertimos a su numero original, ejem: 0.09 = 9
                filaDeNumeros.push(numeroDePorcentaje);                                                    
                numerosOperables[numerosOperables.length - 1] = filaDeNumeros;
                
            } else {    //Es cualquier operador, menos el de %
                numerosOperables[numerosOperables.length - 1].shift();  //eliminamos el operador del ultimo array de nuestro array 2d
                filaDeNumeros = numerosOperables[numerosOperables.length - 1].slice();  //Reiniciamos
                numerosOperables.pop();//Eliminamos el ultimo elemento de nuestro array 2d, nunca existio
                //Borramos en pantalla el operador anterior, junto con sus espacios que le habiamos dejado
                textoPantalla.textContent = textoPantalla.textContent.slice(0, -3);
            }
        }
    }
    
    //Ejecutamos cuando queremos operar y no poner un numero
    if ( (isNaN(Number(evento)) && evento !== 'C' && !operandoSigno) && (filaDeNumeros.length > 0 || percentaje || evento === '%')) {
        
        solved = false; 
        operandoSigno = true;
        operadores.includes(evento) ? textoPantalla.textContent += ` ${evento} ` : null;    //Para escribir los operadores con espacios

        //verificamos que boton de operacion apretamos, segun eso hacemos una accion u otra
        switch (evento) {
            case '%': 
                sacandoPorcentaje = sacarPorcentaje(filaDeNumeros);
                numerosOperables.push(sacandoPorcentaje.slice());
                percentaje = true;
                filaDeNumeros.length = 0;
                operandoSigno = false;
                break;

            case '÷':
                operar(evento);
                break;

            case 'x': 
                operar(evento)
                break;

            case '-':
                operar(evento)
                break;

            case '+':
                operar(evento)
                break;

            case '=':   //Se ejecuta ya cuando operamos

                if (percentaje) {   //En caso que el ultimo numero sea un porcentaje
                    numerosOperables[numerosOperables.length - 1].unshift('='); //Para identificar que esa es la ultima fila a operar
                    percentaje = false;
                } else {
                    filaDeNumeros.unshift('='); //Para identificar que esa es la ultima fila a operar
                    numerosOperables.push(filaDeNumeros.slice())
                    filaDeNumeros.length = 0;
                }
                
                //Se itera solo cuando exista las siguientes operaciones pendientes. (logica de jerarquia de numeros)
                while (numerosOperables.length > 1) {
                    //verificamos primeramente si tenemos operaciones de mult y div, para ejecutarlas primero, segun jerarquia.
                    if (checkOp(numerosOperables, 'x') || checkOp(numerosOperables, '÷')) {
                        //iteramos las filas del array al reves, es decir, de la ultima a la primera
                        for (let i = 0; i <= numerosOperables.length - 1; i++) {
                            if (numerosOperables[i][0] === 'x') {
                                //guardamos la operacion que va a seguir en el array resultado
                                let aux = numerosOperables[i+1][0];
                                let multiplicando = multiplicar(numerosOperables[i], numerosOperables[i+1]);    //resultado de la op
                                //funcion que convierte mi numero, a array y lo coloca el array 2d, remplazando los dos anteriores
                                fromNumberToArray(i, multiplicando, aux);
                                
                            } else if (numerosOperables[i][0] === '÷') {
                                //Aca vamos a hacer lo mismo que en la multiplicacion
                                let aux = numerosOperables[i+1][0]; 
                                let dividiendo = dividir(numerosOperables[i], numerosOperables[i+1]);
                                fromNumberToArray(i, dividiendo, aux);
                            }
                        }
                    } else {
                        //iteramos las filas del array al reves, es decir, de la ultima a la primera
                        for (let i = 0; i <= numerosOperables.length - 1; i++) {
                            //hacemos lo mismo de lo anterior con ambas
                            if (numerosOperables[i][0] === '+') {
                                let aux = numerosOperables[i+1][0];
                                let sumando = sumar(numerosOperables[i], numerosOperables[i+1])
                                fromNumberToArray(i, sumando, aux);

                            } else if (numerosOperables[i][0] === '-') {
                                let aux = numerosOperables[i+1][0];
                                let restando = restar(numerosOperables[i], numerosOperables[i+1])
                                fromNumberToArray(i, restando, aux);
                            }
                        }
                    }
                }

                //Eliminamos el operador '='
                numerosOperables[0].shift();

                //reiniciamos todo el programa, borramos el array de numeros 2d y hacemos copia
                filaDeNumeros = numerosOperables[0].slice();
                
                //Convertimos nuestro array a numero, y lo mostramos
                let resultado = Number(numerosOperables[0].join('')); 
                textoPantalla.textContent = resultado;
                numerosOperables.length = 0;    //Vaciamos el contendio del array 2d.
                solved = true;     //Decimos que el numero actual es el que recien se acaba de operar
                operandoSigno = false;
            break;
        }
    }
}

// Funcion para operar un numero al que se le designo porcentaje, por ejemplo 0.09 + otro numero
function operar(operador) {
    if(percentaje) {
        numerosOperables[numerosOperables.length - 1].unshift(operador);
        percentaje = false;
        sacandoPorcentaje.length = 0;
    } else {
        filaDeNumeros.unshift(operador);
        numerosOperables.push(filaDeNumeros.slice())
        filaDeNumeros.length = 0;
    }
}

//funcion que verifica que operaciones tenemos en el array 2d
function checkOp(array, valor) {
    return array.some(subArray => subArray.includes(valor));
}

//convertir nuestro array en un numero para poder operar
function fromArrayToNumber(op1, op2) {
    //quitamos el primer elemento, que es el identificador de operacion, y solo dejamos las cantidades
    op1.shift();
    op2.shift();
    //unimos el array de strings sin espacios, y lo convertimos con la funcion Number, que funciona para ints y floats.
    op1 = Number(op1.join(''));
    op2 = Number(op2.join(''));

    return {op1, op2};
}
//convertir nuestro numero en array, para poder guardarlo en el array 2d
function fromNumberToArray(index, number, aux) {
    //convertimos nuestro numero en string, y a su vez lo hacemos un array dividiendolo por cada componente que tenga.
    number = number.toString().split('');
    number.unshift(aux);
    //remplazamos los dos arrays anteriores, y lo metemos el nuevo donde debe de estar
    numerosOperables.splice(index, 2, number);
}

//funciones de operaciones
function sumar(op1, op2) {
    let numbers = fromArrayToNumber(op1, op2);
    let result = numbers.op1 + numbers.op2;
    return parseFloat(result.toFixed(3));
}
function restar(op1, op2) {
    let numbers = fromArrayToNumber(op1, op2);
    let result = numbers.op1 - numbers.op2;
    return parseFloat(result.toFixed(3));
}
function multiplicar(op1, op2) {
    let numbers = fromArrayToNumber(op1, op2);
    let result = numbers.op1 * numbers.op2;
    return parseFloat(result.toFixed(3));
}
function dividir(op1, op2) {
    let numbers = fromArrayToNumber(op1, op2);
    let result = numbers.op1 / numbers.op2;
    return parseFloat(result.toFixed(3));
}
function sacarPorcentaje(num) {
    //el numero independiente lo convertimos a su valor calculable, ejem: 9% = 0.09
    let numero = Number(num.join(''));
    numero /= 100;
    numero = numero.toString().split('');
    return numero;
}

//funcion que se ejecuta cada vez que le damos click a un boton
botones.forEach(boton => {
    boton.addEventListener('click', identificarNumeros)
})

// Cosas que faltan:
// Arreglar como se distribuye el texto en la pantalla

// OPCIONAL:
// Si es que se puede, buscarle lugar a usar parentesis, eso desenglosaria un poco de problemas mas grandes
//Implementar la opcion de teclado
const botones = document.querySelectorAll('.container__boton'); //seleccionamos todos los botones
const textoPantalla = document.querySelector('.container__textoPantalla') //etiqueta p de texto en la pantalla

let numerosOperables = [];  //array 2d vacio, que va a contener todos los numeros a operar, junto con su identificador de operacion
let filaDeNumeros = []; //array individual que tiene los numeros a operar, que se almacena en el array 2d
let sacandoPorcentaje= []; //En caso de tener porcentajes, guardamos la transformacion de 9% a 0.09 aqui y manipulamos
let operadores = ['x', '+', '-', '÷', 'AC', 'C', '='];
let percentaje = false;     //Para determinar si actualmente se esta manipulando un numero con porcentaje
let operado = false;    //Para determinar si recien se opero un numero, entonces no se permite modificarlo

//funcion que se ejecuta cuando apretamos un boton
const identificarNumeros = (event) => {
    //Evaluamos condiciones para los botones de borrar y como se agrega el texto
    switch (true) {
        //verificamos que el contenido del event sea un numero, en caso de no serlo no se hace push a la fila de numeros
        case !operadores.includes(event.target.textContent) && !percentaje && !operado:
            if (!isNaN(Number(event.target.textContent)) || event.target.textContent === '.') {
                filaDeNumeros.push(event.target.textContent);
                console.log(filaDeNumeros);
                
            }
            textoPantalla.textContent += event.target.textContent;
            break;

        //Borramos la info de todos los arrays, y lo que aparece en el texto
        case event.target.textContent === 'AC':
            filaDeNumeros.length = 0;
            numerosOperables.length = 0;
            textoPantalla.textContent = '';
            operado = false;
            percentaje = false;
            break;
        
        //Borramos uno por uno
        case event.target.textContent === 'C' && !operado:
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
                    
                } else {    //es cualquier operador, menos el de %

                    numerosOperables[numerosOperables.length - 1].shift();  //eliminamos el operador del ultimo array de nuestro array 2d
                    filaDeNumeros = numerosOperables[numerosOperables.length - 1].slice();  //Reiniciamos
                    numerosOperables.pop();//Eliminamos el ultimo elemento de nuestro array 2d, nunca existio

                    //Borramos en pantalla el operador anterior, junto con sus espacios que le habiamos dejado
                    textoPantalla.textContent = textoPantalla.textContent.slice(0, -3);

                }

            }
            break;
        
        //En caso de ser un operador, dar espacios al momento de escribir
        case operadores.includes(event.target.textContent):
            textoPantalla.textContent += ` ${event.target.textContent} `;
            break;
    }
    
    //Ejecutamos cuando queremos operar y no poner un numero
    if ( isNaN(Number(event.target.textContent)) && (filaDeNumeros.length > 0 || percentaje)) {

        operado = false;    //Operado deja de ser falso, porque se prosiguio a usar un operador cualquiera

        //verificamos que boton de operacion apretamos, segun eso hacemos una accion u otra
        switch (event.target.textContent) {
            case '%': 
                sacandoPorcentaje = sacarPorcentaje(filaDeNumeros);
                numerosOperables.push(sacandoPorcentaje.slice());
                percentaje = true;
                filaDeNumeros.length = 0;
                break;

            case '÷':   
                if(percentaje) {
                    operarPorcentaje('÷');
                } else {
                    filaDeNumeros.unshift('÷');
                    numerosOperables.push(filaDeNumeros.slice())
                    filaDeNumeros.length = 0;
                }
                break;

            case 'x': 
                if(percentaje) {
                    operarPorcentaje('x');
                } else {
                    filaDeNumeros.unshift('x');
                    numerosOperables.push(filaDeNumeros.slice())
                    filaDeNumeros.length = 0;
                }
                break;

            case '-':
                if(percentaje) {
                    operarPorcentaje('-');
                } else {
                    filaDeNumeros.unshift('-');
                    numerosOperables.push(filaDeNumeros.slice())
                    filaDeNumeros.length = 0;
                }
                break;

            case '+':
                if(percentaje) {
                    operarPorcentaje('+');
                } else {
                    filaDeNumeros.unshift('+');
                    numerosOperables.push(filaDeNumeros.slice())
                    filaDeNumeros.length = 0;
                }
                break;

            case ',':

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
                operado = true;     //Decimos que el numero actual es el que recien se acaba de operar
            break;
        }
    }
}

// Funcion para operar un numero al que se le designo porcentaje, por ejemplo 0.09 + otro numero
function operarPorcentaje(operador) {
    numerosOperables[numerosOperables.length - 1].unshift(operador);
    percentaje = false;
    sacandoPorcentaje.length = 0;
    console.log(numerosOperables);
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
function sacarPorcentaje(num) {
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
// Aprender a como sacar porcentajes
// Implementar las comas para poder escribir numeros decimales
// Si pongo un numero varios operadores iguales, se hace la esa igual
// si pongo un numero y diferentes operadores, se toma como valido el primero 
// Quiero hacer que cuando salga el resultado de un numero, este no se pueda modificar con el teclado 
// Tengo que hacer las operaciones con porcentajes bien
// Cuando coloco la coma, sale como que estoy operando, y no como numero

// OPCIONAL:
// Implementar poder colocar los numeros con los botones del teclado
// Si es que se puede, buscarle lugar a usar parentesis, eso desenglosaria un poco de problemas mas grandes

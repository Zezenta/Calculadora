const botones = document.querySelectorAll('.container__boton'); //seleccionamos todos los botones
const textoPantalla = document.querySelector('.container__textoPantalla') //etiqueta p de texto en la pantalla

let numerosOperables = [];  //array 2d vacio, que va a contener todos los numeros a operar, junto con su identificador de operacion
let filaDeNumeros = []; //array individual que tiene los numeros a operar, que se almacena en el array 2d
let operadores = ['x', '+', '-', '%', '÷', 'AC', 'C'];

//funcion que se ejecuta cuando apretamos un boton
const identificarNumeros = (event) => {

    //verificamos que el contenido del event sea un numero, en caso de no serlo no se hace push a la fila de numeros
    if (!isNaN(parseInt(event.target.textContent))) {
        filaDeNumeros.push(event.target.textContent);
        textoPantalla.textContent += event.target.textContent;
    }

    //Evaluamos condiciones para los botones de borrar y como se agrega el texto
    switch (true) {
        //Borramos la info de todos los arrays, y lo que aparece en el texto
        case event.target.textContent === 'AC':
            filaDeNumeros.length = 0;
            numerosOperables.length = 0;
            textoPantalla.textContent = '';
            break;
        
        //Borramos uno por uno
        case event.target.textContent === 'C':
            //Condicion para borrar la fila que escribimos antes de designarle un operador
            if (filaDeNumeros.length > 0) {
                filaDeNumeros.pop();
            
            } else if(filaDeNumeros.length === 0 && numerosOperables.length > 0){   //Siguiente array, es el operador
                numerosOperables[numerosOperables.length - 1].shift();  //eliminamos el operador del ultimo array de nuestro array 2d

                for(let element of numerosOperables[numerosOperables.length - 1]){
                    filaDeNumeros.push(element);    //Todos los numeros del ultimo array, se van de nuevo a la fila de numeros (Restart)
                }

                numerosOperables.pop();//Eliminamos el ultimo elemento de nuestro array 2d, nunca existio

                //Borramos en pantalla el operador anterior, junto con sus espacios que le habiamos dejado
                textoPantalla.textContent = textoPantalla.textContent.slice(0, -2);
            }

            //Eliminamos el ultimo elemento de lo que tenemos en nuestra etiqueta p
            textoPantalla.textContent = textoPantalla.textContent.slice(0, -1); 
            break;
        
        //En caso de ser un operador, dar espacios al momento de escribir
        case operadores.includes(event.target.textContent):
            textoPantalla.textContent += ` ${event.target.textContent} `;
            break;
    }
    
    //Ejecutamos solo cuando tenemos al menos un numero por operar
    if (filaDeNumeros.length > 0) {
        //verificamos que boton de operacion apretamos, segun eso hacemos una accion u otra
        switch (event.target.textContent) {
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
                filaDeNumeros.unshift('='); //Para identificar que esa es la ultima fila a operar
                numerosOperables.push(filaDeNumeros.slice())
                filaDeNumeros.length = 0;
                
                //Se itera solo cuando exista las siguientes operaciones pendientes.    (logica de jerarquia de numeros)
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

                numerosOperables[0].shift();    //Eliminamos el operador '='

                for(let element of numerosOperables[0]){    //Iteramos para que el resultado, se guarde a fila de numeros (Restart)
                    filaDeNumeros.push(element);    
                }
                
                //Convertimos nuestro array a numero, y lo mostramos
                let resultado = Number(numerosOperables[0].join('')); 
                textoPantalla.textContent = resultado;
                numerosOperables.length = 0;    //Vaciamos el contendio del array 2d.
            break;
        }
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

// OPCIONAL:
// Implementar poder colocar los numeros con los botones del teclado
// Si es que se puede, buscarle lugar a usar parentesis, eso desenglosaria un poco de problemas mas grandes

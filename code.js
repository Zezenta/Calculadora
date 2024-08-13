const botones = document.querySelectorAll('.container__boton'); //seleccionamos todos los botones
const textoPantalla = document.querySelector('.container__textoPantalla') //etiqueta p de texto en la pantalla

let numerosOperables = [];  //array 2d vacio, que va a contener todos los numeros a operar, junto con su identificador de operacion
let filaDeNumeros = []; //array individual que tiene los numeros a operar, que se almacena en el array 2d
let operadores = ['x', '+', '-', '%', '÷'];
//funcion que se ejecuta cuando apretamos un boton
const identificarNumeros = (event) => {
    //agregamos el texto
    if (operadores.includes(event.target.textContent)) {
        textoPantalla.textContent += ` ${event.target.textContent} `;
    } else {
        textoPantalla.textContent += event.target.textContent;
    }

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
                filaDeNumeros.length = 0;
                numerosOperables.length = 0;
                textoPantalla.textContent = '';
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
                
                //Se itera solo cuando exista las siguientes operaciones pendientes.
                while (numerosOperables.length > 1) {
                    //verificamos primeramente si tenemos operaciones de mult y div, para ejecutarlas primero, segun jerarquia.
                    if (checkOp(numerosOperables, 'x') || checkOp(numerosOperables, '÷')) {
                        //iteramos las filas del array al reves, es decir, de la ultima a la primera
                        for (let i = numerosOperables.length - 1; i >= 0; i--) {
                            if (numerosOperables[i][0] === 'x') {
                                //guardamos la operacion que va a seguir en el array resultado
                                let aux = numerosOperables[i+1][0];     //guardamos la operacion que va a seguir en el array resultado
                                //Ejecutamos la operacion, y obtenemos el resultado en un array, igual que todo lo demas
                                let multiplicando = multiplicar(numerosOperables[i], numerosOperables[i+1]);
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
                        for (let i = numerosOperables.length - 1; i >= 0; i--) {
                            if (numerosOperables[i][0] === '+') {
                                let sumando = sumar(numerosOperables[i], numerosOperables[i+1])
                                console.log(sumando);

                            } else if (numerosOperables[i][0] === '-') {
                                let restando = restar(numerosOperables[i], numerosOperables[i+1])
                                console.log(restando);
                            }
                        }
                    }
                }

                console.log('si acabo');
                
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
    op1.shift()
    op2.shift()
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
    console.log(numerosOperables);
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












botones.forEach(boton => {
    boton.addEventListener('click', identificarNumeros) //funcion que se ejecuta cada vez que le damos click a un boton
})


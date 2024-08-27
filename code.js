const botones = document.querySelectorAll('.container__boton'); //seleccionamos todos los botones
const textoPantalla = document.querySelector('.container__textoPantalla') //etiqueta p de texto en la pantalla
var ultimoValorNum = false;
var hayPunto = false;
var operadores = ['x', '+', '-', '÷'];

//funcion que se ejecuta cuando apretamos un boton
const identificarNumeros = (event) => {
    let evento = event.target.textContent;  //numero o boton que presionamos, en formato str por default
    
    if(evento === 'AC') { //borrar todo
        textoPantalla.textContent = '';
        hayPunto = false;
        ultimoValorNum = false;
    }else if(evento === 'C'){
        hayPunto = (textoPantalla.textContent[textoPantalla.textContent.length-1] === '.') ? false : hayPunto;
        textoPantalla.textContent = textoPantalla.textContent.substring(0, textoPantalla.textContent.length-1);
    }else if((parseInt(evento) >= 0 || parseInt(evento )<= 9)){
        textoPantalla.textContent += evento;
        ultimoValorNum = true;
    }
    else if(ultimoValorNum && operadores.includes(evento) && textoPantalla.textContent[textoPantalla.textContent.length-1] != '.'){
        textoPantalla.textContent += ' ' + evento + ' ';
        ultimoValorNum = false;
        hayPunto = false;
    }else if(evento === '.' && !hayPunto && ultimoValorNum && textoPantalla.textContent[textoPantalla.textContent.length-1] != '%'){
        textoPantalla.textContent += evento;
        hayPunto = true;
    }else if(evento === '%' && textoPantalla.textContent[textoPantalla.textContent.length-1] != '.' && ultimoValorNum){
        textoPantalla.textContent += evento;
    }else if(evento === '='){
        var raw = textoPantalla.textContent.replace("x", "*");
        raw = raw.replace("÷", "/");
        raw = raw.replace("%", "/100");
        textoPantalla.textContent = Math.round(eval(raw) * 1000000000000000) / 1000000000000000;
    }
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
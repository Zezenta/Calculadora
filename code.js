const botones = document.querySelectorAll('.container__boton'); //seleccionamos todos los botones
const textoPantalla = document.querySelector('.container__textoPantalla') //etiqueta p de texto en la pantalla
var ultimoValorNum = false; //variable para saber si el último valor era un número
var hayPunto = false; //variable para saber si en el número actual ya hay un punto (para que no se repita)
var operadores = ['x', '+', '-', '÷'];

//funcion que se ejecuta cuando apretamos un boton
const identificarNumeros = (event) => {
    let evento = event.target.textContent;  //numero o boton que presionamos, en formato str por default
    
    if(evento === 'AC') { //borrar todo
        textoPantalla.textContent = ''; //borra todo pues jajakjajajkaska
        hayPunto = false; //se reinicia la variable de punto (se vuelve a permitir poner un punto)
        ultimoValorNum = false; //esta se pone en falso para no poder empezar todo con un signo
    }else if(evento === 'C'){ //borrar una
        hayPunto = (textoPantalla.textContent[textoPantalla.textContent.length-1] === '.') ? false : hayPunto; //si se borró un punto, la variable se reinicia
        if(textoPantalla.textContent[textoPantalla.textContent.length-2] === ' '){ //si antes del número o signo que se va a borrar hay un espacio
            textoPantalla.textContent = textoPantalla.textContent.substring(0, textoPantalla.textContent.length-2); //borra el espacio también
        }else{ //sino
            textoPantalla.textContent = textoPantalla.textContent.substring(0, textoPantalla.textContent.length-1); //borra nomas el signo o número único
        }
    }else if((parseInt(evento) >= 0 || parseInt(evento )<= 9)){ //si el evento es entre el 0 o el 9
        textoPantalla.textContent += evento; //se añade simplemente
        ultimoValorNum = true; //y se declara que ya hubo un número (para ya poder volver a poner signos)
    }
    else if(operadores.includes(evento) && ultimoValorNum && textoPantalla.textContent[textoPantalla.textContent.length-1] != '.'){ //si se pone un signo (y si el último valor era un número, y si el último valor anterior a este NO era un punto)
        textoPantalla.textContent += ' ' + evento + ' '; //pon el signo con espacios
        ultimoValorNum = false; //el último valor YA NO es un número
        hayPunto = false; //se reinicia la variable de los puntos
    }else if(evento === '.' && !hayPunto && ultimoValorNum && textoPantalla.textContent[textoPantalla.textContent.length-1] != '%'){ //si es un punto, no había un punto anteriormente, el último valor era un número, y el símbolo anterior NO era un %
        textoPantalla.textContent += evento; //pon el signo
        hayPunto = true; //la variable punto se declara en SÍ
    }else if(evento === '%' && textoPantalla.textContent[textoPantalla.textContent.length-1] != '.' && ultimoValorNum){ //si es un %, el último valor NO era un punto, y el último valor SÍ era un número
        textoPantalla.textContent += evento; //pon el %
    }else if(evento === '='){ //si es =
        var raw = textoPantalla.textContent.replace("x", "*"); //reemplaza todas las x con *
        raw = raw.replace("÷", "/"); //todos los ÷ con /
        raw = raw.replace("%", "/100"); //todos los % con /100 (tiene el mismo efecto)
        textoPantalla.textContent = Math.round(eval(raw) * 1000000000000000) / 1000000000000000; //evalúa la expresión pura y redondea con un factor de 1000000000000000 para evitar problemas de punto flotante
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
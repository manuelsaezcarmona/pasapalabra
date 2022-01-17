

export const initUI = () =>{
    const sucsessLetters = document.querySelectorAll('#rosco > .rosco-letter' && '#rosco > .success' );
    const mistakeLetters =  document.querySelectorAll('#rosco > .rosco-letter' && '#rosco > .mistake' );
    const currentLetters =  document.querySelectorAll('#rosco > .rosco-letter' && '#rosco > .current' );
    const cronometro = document.querySelector('#countdown');
    const hits = document.querySelector('#hits');
    const playerName = document.querySelector('#player-name');
    mistakeLetters.forEach( letter => letter.classList.replace('mistake', 'default'));
    sucsessLetters.forEach( letter => letter.classList.replace('success', 'default'));
    currentLetters.forEach( letter => letter.classList.replace('current', 'default'));
    cronometro.textContent ="";
    hits.textContent ="";
    playerName.textContent = "Pon tu Nombre";
    document.querySelector('#question-header').textContent = "";
    document.querySelector('#question-body').textContent = "";
    document.querySelector('.ranking').style.display = "none";
    document.querySelector('.fondo-transparente').style.display = 'none';
    document.querySelector('.modal-newPlayer').style.display = 'none';
    document.querySelector('#respuesta').disabled = true;
}

export const mostrarModal = (titulo, mensaje) =>{
    const tituloUi = document.querySelector('.modal-header > p');
    const mensajeUi = document.querySelector('.modal-mensaje > p');
    if (titulo ==="Nuevo Juego"){
        document.querySelector('input[name="playerName"]').style.display = 'block';
        document.querySelector('#aceptar-btn').style.display = "block";
        document.querySelector('#ok-btn').style.display = "none";
    }else {
        document.querySelector('input[name="playerName"]').style.display = 'none';
        document.querySelector('#aceptar-btn').style.display = "none";
        document.querySelector('#ok-btn').style.display = "block";
    }
    document.querySelector('.fondo-transparente').style.display = "block";
    document.querySelector('.modal-newPlayer').style.display = "block";
    tituloUi.textContent = titulo;
    mensajeUi.textContent = mensaje; 
}

export const ocultarModal = () =>{
    document.querySelector('.modal-newPlayer > .error').style.display = 'none';
    document.querySelector('input[name="playerName"]').value = '';
    document.querySelector('.modal-newPlayer').style.display = "none";
    document.querySelector('.ranking').style.display = "none";
    document.querySelector('.fondo-transparente').style.display = "none";
}

export const mostrarAlerta = (texto) => {
    let alerta = document.querySelector('.modal-newPlayer > .error');
    alerta.textContent = texto;
    alerta.style.display = 'block';
}


export const muestraJugador = (nombre) =>{
    document.querySelector('#player-name').textContent = nombre;
}

export const printQuestion = (questionHeader, question) =>{
    document.querySelector('#question-header').textContent = questionHeader;
    document.querySelector('#question-body').textContent = question;
}


export const printCorrectAnswers = (correctAnswers) =>{
    document.querySelector('#hits').textContent = correctAnswers;
}

export const printResponse = (status, correctAnswer) =>{
    const card = document.querySelector('.flip-card');
    const result = document.querySelector('.back > h3');
    const resultDetail = document.querySelector('.back > p');
    
    if (status === 1){
        card.style.background = "var(--green-gradient) ";
        result.textContent = 'perfecto!!!!';
        resultDetail.textContent = correctAnswer + ' es la respuesta correcta';
    }else{
        card.style.background = "var(--red-gradient) ";
        result.textContent = 'ooooohhh nooooooo!!!!!';
        resultDetail.textContent = 'la respuesta correcta es ' + correctAnswer;
    }
    
    card.style.transform = "rotateY(180deg)"; 
    
    setTimeout(() => {
        card.style.background = "var(--orange-gradient) ";
        card.style.transform = "rotateY(0deg)";    
    }, 2000);
   
}


export const setCurrentLetter = (index) => {
    const currentLetter = document.querySelector(`#rosco > *:nth-of-type(${index+1})`);
    currentLetter.classList.replace('default', 'current');
}
export const setMistakeLetter = (index) => {
    const mistakeLetter = document.querySelector(`#rosco > *:nth-of-type(${index+1})`);
    mistakeLetter.classList.replace('current', 'mistake');
}

export const setSuccessLetter = (index) => {
    const successLetter = document.querySelector(`#rosco > *:nth-of-type(${index+1})`);
    successLetter.classList.replace('current', 'success');
}

export const setDefaultLetter = (index) => {
    const defaultLetter = document.querySelector(`#rosco > *:nth-of-type(${index+1})`);
    defaultLetter.classList.replace('current', 'default');
}




export const mostrarRanking = () => {
    document.querySelector('.fondo-transparente').style.display = "block";
    document.querySelector('.ranking').style.display = "flex";
    // A ver si luego funciona con flexbox
}

export const createTable= (datos) =>{
    let fragmento = document.createDocumentFragment();
    const rankingContainer = document.querySelector('.ranking');
    const cabecera = ['Nombre', 'Acertadas', 'Erroneas'];
  
    // Limpiamos ranking anteriores
    while (rankingContainer.firstChild) {
        rankingContainer.removeChild(rankingContainer.firstChild);
    }
    // Construimos la tabla.
    let tabla = document.createElement('table');
// Construimos la cabecera.
    let cabeceraTabla = document.createElement('thead');
    let cabeceraFila = document.createElement('tr');
    // Creamos la columnas a partir de los datos.
    cabecera.forEach(columna => {
        let celdaCabecera = document.createElement('th');
        celdaCabecera.textContent = columna;
        cabeceraFila.append(celdaCabecera);
    });
    cabeceraTabla.append(cabeceraFila);
    tabla.append(cabeceraTabla);

// Construimos el cuerpo de la tabla
    let cuerpoTabla = document.createElement('tbody');
    datos.forEach((registro , indice) => {
        let cuerpoFila = document.createElement('tr');
        if (!(indice % 2 === 0)){
            cuerpoFila.classList.add('alt');
        }
        
        const datosJugador = Object.values(registro);
        datosJugador.splice(3,datosJugador.length);
        
        datosJugador.forEach(datos =>{
            let celda = document.createElement('td');
            celda.textContent = datos;
            cuerpoFila.append(celda);
        });
        cuerpoTabla.append(cuerpoFila);
    })
    tabla.append(cuerpoTabla);
    
    // Incorporamos la tabla al fragmento.
    fragmento.appendChild(tabla);
    
    // Creamos el boton para salir.
    const boton = document.createElement('div');
    boton.classList.add('boton');
    boton.setAttribute('id','table-btn');
    boton.textContent = "VOLVER";

    fragmento.appendChild(boton);

    rankingContainer.appendChild(fragmento);
    
    boton.addEventListener('click',() => {
        ocultarModal();
    });

}

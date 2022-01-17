import * as Data from '../js/data.js';
import * as UI from '../js/ui.js';

let cuentaAtras; 

export const setPlayerName = () => {
    const inputName = document.querySelector('input[name="playerName"]');
    let name;
    name = inputName.value;
    return name;
 }

export const makeRosco = (alphabet, questions) => {
    const rosco = [];
    for (let letra of alphabet){
        const arrayletter = questions.filter(question => question.letter === letra);
        const indexselected =  Math.floor(Math.random()*arrayletter.length);
        rosco.push(arrayletter[indexselected]);
    };
    return rosco;  
}

export const cronoMetro = (tiempoRestante) =>{
    cuentaAtras = setInterval(() => {
        tiempoRestante--;
        document.querySelector('#countdown').textContent = tiempoRestante;
        if (tiempoRestante === 0){
            document.querySelector('#countdown').textContent = tiempoRestante;
            clearInterval(cuentaAtras);
            alert('Se acabo el tiempo');
        }
    }, 1000);
}

export const pausaCronometro = () =>{
    clearInterval(cuentaAtras);
}

const isRoscoCompleted = (rosco) =>{
    let roscocompleted = rosco.every(question => question.status > 0);
    return roscocompleted;
}


export const formatResponse= (texto) =>{
    // Quitar acentos y caracteres raros solucion copiada de : 
    // https://es.stackoverflow.com/questions/62031/eliminar-signos-diacr%C3%ADticos-en-javascript-eliminar-tildes-acentos-ortogr%C3%A1ficos
    return texto
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
            .normalize();
}


export const endGame = (GameSession) =>{
    // finalizar el juego. 
    // Guardar la sesion (el player en el ranking)
    let texto = `Has Finalizado el juego con ${GameSession.correctAnswers} preguntas acertadas 
        y ${GameSession.wrongAnswers} preguntas incorrectas. 
        Puedes ver tus resultados en el Ranking`;
        UI.mostrarModal('enhorabuena', texto);
        const player = Data.playerFactory(GameSession.playerName);
        player._correctQuestions = GameSession.correctAnswers;
        player._wrongQuestions = GameSession.wrongAnswers;
        Data.ranking.push(player);
        console.log(Data.ranking);
        clearInterval(cuentaAtras);
        setTimeout(() => {
            UI.initUI();    
        }, 3000);
}


export const registerResponse = (GameSession) =>{
    const correctAnswer = GameSession.rosco[GameSession.indexQuestion].answer
    const respuesta = formatResponse(document.querySelector('#respuesta').value);
    let status = 0;
    if( !respuesta ) { 
        UI.mostrarModal('Sin respuesta', 'No has escrito ninguna respuesta');
        return;
    }
    
    if (respuesta === correctAnswer){
        status = 1;
        UI.setSuccessLetter(GameSession.indexQuestion);
        GameSession.correctAnswers++;
        UI.printCorrectAnswers(GameSession.correctAnswers);
    }else {
        status = 2;
        UI.setMistakeLetter(GameSession.indexQuestion);
        GameSession.wrongAnswers++;

    }

    GameSession.rosco[GameSession.indexQuestion].status = status;
    UI.printResponse(status, correctAnswer);
    document.querySelector('#respuesta').value ="";
    //console.log(GameSession);
    nextQuestion(GameSession);
    
}


export const askQuestion = (gameSession) => {
    document.querySelector('#respuesta').disabled = false;
    const {rosco, indexQuestion} = gameSession;
    UI.setCurrentLetter(indexQuestion);
    UI.printQuestion(rosco[indexQuestion].questionHeader,rosco[indexQuestion].question);
}



export const nextQuestion = (GameSession) =>{
    
    let roscocompletado = isRoscoCompleted(GameSession.rosco);
    if (roscocompletado){
        endGame(GameSession);
        return;
    }
    // Aumentamos el indice si llega al final del rosco reinicia el indice.
    if(GameSession.indexQuestion === (GameSession.rosco.length -1)){
        GameSession.indexQuestion = 0;
    }else {
        GameSession.indexQuestion++;
    }
    
    const {rosco, indexQuestion} = GameSession;

    if( GameSession.ended){
        // Final del juego.
        UI.mostrarModal('Sesion Finalizada', 'La sesion ha sido finalizada (ended)');
        return;
    }

    if (GameSession.abandoned){
        let texto = `Has abandonado el juego con ${GameSession.correctAnswers} preguntas acertadas 
        y ${GameSession.wrongAnswers} preguntas incorrectas. No te registras en el ranking`;
        
        GameSession.reiniciarSesion();
        UI.mostrarModal('juego abandonado', texto);
        clearInterval(cuentaAtras);
        setTimeout(() => {
            UI.initUI();    
        }, 3000);
        return;
    }
    
    // vamos a la siguiente pregunta
    
    if (rosco[indexQuestion].status === 0) {
        askQuestion(GameSession);
    } else {
        nextQuestion(GameSession);
    }
}

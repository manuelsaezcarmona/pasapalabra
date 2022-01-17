"use strict";
import * as Data from '../js/data.js';
import * as UI from '../js/ui.js';
import * as Game from '../js/pasapalabra-game.js';


const main = () =>{
    const nuevoJuego = document.querySelector('#new-game');
    const rankingBtn = document.querySelector('#ranking');
    const aceptarBtn = document.querySelector('#aceptar-btn');
    const okBtn = document.querySelector('#ok-btn');
    const enviaBtn = document.querySelector('input[value="envia"]');
    const abandonarBtn = document.querySelector('#abandonar');
    const pasapalabraBtn = document.querySelector('#pasapalabra');
    const respuestaInput = document.querySelector('#respuesta');
    //const tablabtn = document.querySelector('#table-btn');

    
     UI.initUI();
     const sesionGame = new Data.GameSession();
    
        
    //Listeners    
    nuevoJuego.addEventListener('click', () => {
        UI.initUI();
        UI.mostrarModal('Nuevo Juego', `El juego te dará una definicion y deberas adivinar la palabra.
        Si no la sabes pulsa pasapalabra y pasaras a la siguiente pregunta.
        Solo terminarás cuando respondas a todas las preguntas o pulsando lo dejo`);
        
    });
    
    rankingBtn.addEventListener('click', () => {
        let datosOrdenados = Data.ranking.slice();
        datosOrdenados.sort((playerA, playerB) => playerB.correctQuestionsget - playerA.correctQuestionsget );
        UI.createTable(datosOrdenados);
        UI.mostrarRanking();
    });

    /*
    tablabtn.addEventListener('click',() => {
        UI.ocultarModal();
    });*/



    aceptarBtn.addEventListener('click', () => {
        let playerName = "";
        playerName = Game.setPlayerName();
        if (playerName) {
            sesionGame.playerName = playerName;
            
            // Inicializa el juego. 
            sesionGame.rosco =  Game.makeRosco(Data.alphabet, Data.questions);
            UI.ocultarModal();
            UI.muestraJugador(playerName);
            UI.printCorrectAnswers(sesionGame.correctAnswers);
            Game.askQuestion(sesionGame);
            Game.cronoMetro(999);
        }else{
            UI.mostrarAlerta('Debes de introducir un nombre');
        }
    });

    okBtn.addEventListener('click', () =>{
        UI.ocultarModal();
    });

    okBtn.addEventListener('keydown', (event) =>{
        if(event.key === "Enter"){
            console.log('pulsado');
            UI.ocultarModal();
        }
    });

    enviaBtn.addEventListener('click',() => {
        // Si no se ha iniciado el juego. No existen preguntas.
        if (sesionGame.rosco){
           Game.registerResponse(sesionGame);
        }else{
            UI.mostrarModal('Error', 'No has iniciado el juego'); 
        }
    });

    respuestaInput.addEventListener('keyup', (event) =>{
        if(event.key === "Enter"){
            if (sesionGame.rosco){
                Game.registerResponse(sesionGame);
             }else{
                 UI.mostrarModal('Error', 'No has iniciado el juego'); 
             }
        }
    });

    pasapalabraBtn.addEventListener('click', () =>{
        if (sesionGame.rosco){
            // pasadirectamente a la siguiente pregunta.
            UI.setDefaultLetter(sesionGame.indexQuestion);
            Game.nextQuestion(sesionGame);
        }else{
            UI.mostrarModal('Error', 'No has iniciado el juego'); 
        }

    });

    abandonarBtn.addEventListener('click', () =>{
        if (sesionGame.rosco){
            sesionGame.abandoned = true;
            Game.nextQuestion(sesionGame);
        }else{
            UI.mostrarModal('Error', 'No has iniciado el juego'); 
        }
    });


}// Main


main();
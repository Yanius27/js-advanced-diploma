/**
 * Entry point of app: don't change this
 */
import GamePlay from './GamePlay';
import GameStateService from './GameStateService';
import GameController from './GameController';

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();

// don't write your code here

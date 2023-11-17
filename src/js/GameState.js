/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import GameStateService from './GameStateService';

const gameStateService = new GameStateService(localStorage);
export default class GameState {
  constructor() {
    this.__turn = ['player', 'computer'];
    this.count = 0;
    this._state = [];
  }

  static from(object) {
    if (!object.count) {
      object.count = 1;
    } else {
      object.count = 0;
    }
  }

  get turn() {
    return this.__turn[this.count];
  }

  set state(value) {
    this._state.push(value);
  }

  save(state) {
    gameStateService.save(state);
  }

  load() {
    return gameStateService.load();
  }
}

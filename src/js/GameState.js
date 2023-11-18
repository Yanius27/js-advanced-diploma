/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

export default class GameState {
  constructor(gameStateService) {
    this.__turn = ['player', 'computer'];
    this.count = 0;
    this._state = {};
    this.gameStateService = gameStateService;
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

  set state(arr) {
    this._state[arr[0]] = arr[1];
  }

  get state() {
    return this._state;
  }
}

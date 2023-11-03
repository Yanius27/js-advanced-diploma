/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
export default class GameState {
  constructor() {
    this.__turn = ['player', 'computer'];
    this.count = 0;
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
}

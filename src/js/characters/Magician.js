/* eslint-disable import/extensions */
import Character from '../Character.js';

export default class Magician extends Character {
  constructor(level) {
    super(level, 'player', 'magician');
    this.attack = 10;
    this.defence = 40;
  }
}

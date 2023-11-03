/* eslint-disable import/extensions */
import Character from '../Character.js';

export default class Daemon extends Character {
  constructor(level) {
    super(level, 'enemy', 'daemon');
    this.attack = 10;
    this.defence = 10;
  }
}

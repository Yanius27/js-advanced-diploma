/* eslint-disable import/extensions */
import Character from '../Character.js';

export default class Undead extends Character {
  constructor(level) {
    super(level, 'enemy', 'undead');
    this.attack = 40;
    this.defence = 10;
  }
}

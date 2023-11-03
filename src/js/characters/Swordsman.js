/* eslint-disable import/extensions */
import Character from '../Character.js';

export default class Swordsman extends Character {
  constructor(level) {
    super(level, 'player', 'swordsman');
    this.attack = 40;
    this.defence = 10;
  }
}

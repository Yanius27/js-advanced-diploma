/* eslint-disable import/extensions */
import Character from '../Character.js';

export default class Vampire extends Character {
  constructor(level) {
    super(level, 'enemy', 'vampire');
    this.attack = 25;
    this.defence = 25;
  }
}

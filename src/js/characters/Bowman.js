/* eslint-disable import/extensions */
import Character from '../Character.js';

export default class Bowman extends Character {
  constructor(level) {
    super(level, 'player', 'bowman');
    this.attack = 25;
    this.defence = 25;
  }
}

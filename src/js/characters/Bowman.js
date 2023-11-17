/* eslint-disable no-underscore-dangle */
/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
/* eslint-disable default-case */
/* eslint-disable import/extensions */
import Character from '../Character.js';

export default class Bowman extends Character {
  constructor(level) {
    super(level, 'player', 'bowman');
    switch (level) {
      case 1:
        this.attack = 25;
        this.defence = 25;
        break;
      case 2:
        this.attack = 45;
        this.defence = 45;
        break;
      case 3:
        this.attack = 81;
        this.defence = 81;
        break;
      case 4:
        this.attack = 145.8;
        this.defence = 145.8;
        break;
    }
  }
}

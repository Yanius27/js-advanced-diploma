/* eslint-disable lines-between-class-members */
/* eslint-disable default-case */
/* eslint-disable import/extensions */
import Character from '../Character.js';

export default class Swordsman extends Character {
  constructor(level) {
    super(level, 'player', 'swordsman');
    switch (level) {
      case 1:
        this.attack = 40;
        this.defence = 10;
        break;
      case 2:
        this.attack = 72;
        this.defence = 18;
        break;
      case 3:
        this.attack = 129.6;
        this.defence = 32.4;
        break;
      case 4:
        this.attack = 233.28;
        this.defence = 58.32;
        break;
    }
  }
}

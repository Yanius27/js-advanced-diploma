/* eslint-disable lines-between-class-members */
/* eslint-disable default-case */
/* eslint-disable import/extensions */
import Character from '../Character.js';

export default class Magician extends Character {
  constructor(level) {
    super(level, 'player', 'magician');
    switch (level) {
      case 1:
        this.attack = 10;
        this.defence = 40;
        break;
      case 2:
        this.attack = 18;
        this.defence = 72;
        break;
      case 3:
        this.attack = 32.4;
        this.defence = 129.6;
        break;
      case 4:
        this.attack = 58.32;
        this.defence = 233.28;
        break;
    }
  }
}

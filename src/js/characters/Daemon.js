/* eslint-disable lines-between-class-members */
/* eslint-disable default-case */
/* eslint-disable import/extensions */
import Character from '../Character.js';

export default class Daemon extends Character {
  constructor(level) {
    super(level, 'enemy', 'daemon');
    switch (level) {
      case 1:
        this.attack = 10;
        this.defence = 10;
        break;
      case 2:
        this.attack = 18;
        this.defence = 18;
        break;
      case 3:
        this.attack = 32.4;
        this.defence = 32.4;
        break;
      case 4:
        this.attack = 58.32;
        this.defence = 58.32;
        break;
    }
  }
}

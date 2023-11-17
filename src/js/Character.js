/* eslint-disable default-case */
/* eslint-disable lines-between-class-members */
/* eslint-disable no-underscore-dangle */
/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, side, type = 'generic') {
    if (new.target.name === 'Character') {
      throw new Error();
    }
    if (level > 4) {
      this._level = 4;
    } else if (level < 1) {
      this._level = 1;
    } else {
      this._level = level;
    }
    this.side = side;
    this.attack = 0;
    this.defence = 0;
    this.health = 100;
    this.type = type;
    // TODO: выбросите исключение, если кто-то использует "new Character()"
  }
  set level(level) {
    this._level = level;
    if (this._level > 4) {
      this.level = 4;
    }
    if (this.type === 'bowman' || this.type === 'vampire') {
      switch (level) {
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
    if (this.type === 'swordsman' || this.type === 'undead') {
      switch (level) {
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
    if (this.type === 'daemon') {
      switch (level) {
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
    if (this.type === 'magician') {
      switch (level) {
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
}

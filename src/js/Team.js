/* eslint-disable no-underscore-dangle */
/* eslint-disable spaced-comment */
/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  constructor(charList) {
    this.characters = [];
    for (let i = 0; i < charList.length; i += 1) {
      this.characters.push(charList[i]);
    }
  }

  //Метод для добавления персонажей в команду уже после создания экземпляра

  // addCharcter(newCharacter) {
  //   this.characters.forEach((item) => {
  //     if (item.level === newCharacter.level && item.type === newCharacter.type) {
  //       throw new Error('Данный персонаж уже есть в команде');
  //     }
  //   });
  //   this.characters.push(newCharacter);
  // }
}

/* eslint-disable max-len */
import Team from './Team';
/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  for (let i = 0; ; i += 1) {
    const randomIndexFromTo = Math.round(Math.random() * (allowedTypes.length - 1));
    const randomLevelFromTo = Math.round(Math.random() * (maxLevel - 1) + 1);
    const newCharacter = new allowedTypes[randomIndexFromTo](randomLevelFromTo);
    yield newCharacter;
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const characters = [];
  const generator = characterGenerator(allowedTypes, maxLevel);
  for (let i = 0; i < characterCount; i += 1) {
    characters.push(generator.next().value);
  }
  return new Team(characters);
}

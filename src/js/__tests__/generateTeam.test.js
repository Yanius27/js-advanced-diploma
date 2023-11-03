/* eslint-disable linebreak-style */
import { generateTeam } from '../generators';
import Bowman from '../characters/Bowman';
import Undead from '../characters/Undead';

const team = generateTeam([Bowman, Undead], 3, 4);

test('function should return array of characters with a level not higher than a given one', () => {
  const received = team.characters.find((el) => el.level > 3);
  expect(received).toBe(undefined);
});

test('function should return array with a given number of characters', () => {
  expect(team.characters.length).toBe(4);
});

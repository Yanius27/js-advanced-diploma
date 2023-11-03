/* eslint-disable linebreak-style */
import { characterGenerator } from '../generators';
import Bowman from '../characters/Bowman';
import Undead from '../characters/Undead';

test('generator should return infinite number of characters from array "allowedTypes"', () => {
  const generator = characterGenerator([Bowman, Undead], 3);
  let received;
  for (let i = 0; i <= 100; i += 1) {
    received = generator.next().value;
  }
  expect(received).not.toBe(undefined);
});

/* eslint-disable linebreak-style */
import Character from '../Character';

test('Error should thrown if created object of Class Character', () => {
  expect(() => new Character(2)).toThrow(new Error());
});

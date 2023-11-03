/* eslint-disable linebreak-style */
import Bowman from '../characters/Bowman';

test('Error should not thrown if created object of inherited class', () => {
  const received = new Bowman(1);
  expect(received).toEqual({
    level: 1,
    type: 'bowman',
    health: 50,
    attack: 25,
    defence: 25,
  });
});

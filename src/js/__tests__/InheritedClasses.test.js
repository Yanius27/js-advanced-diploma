/* eslint-disable linebreak-style */
import Bowman from '../characters/Bowman';

test('Error should not thrown if created object of inherited class', () => {
  const received = new Bowman(1);
  expect(received).toEqual({
    _level: 1,
    type: 'bowman',
    health: 100,
    attack: 25,
    defence: 25,
    side: 'player',
  });
});

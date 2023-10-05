import { calcTileType } from '../utils';

test('function should return correct string', () => {
  const received = calcTileType(4, 8);
  expect(received).toBe('top');
});

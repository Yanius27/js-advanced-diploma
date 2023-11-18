import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';
import GameController from '../GameController';
import Swordsman from '../characters/Swordsman';
import Bowman from '../characters/Bowman';
import Magician from '../characters/Magician';

const gamePlay = new GamePlay();
const stateService = new GameStateService([]);
const gameCtrl = new GameController(gamePlay, stateService);
const char1 = { character: new Swordsman(3), position: 16 };
const swordsmanAndUndeadMoveRadius = gameCtrl.cellsRadius(char1, 'move');
const swordsmanAndUndeadAttackRadius = gameCtrl.cellsRadius(char1, 'attack');

test('Swordsman and Undead moves 4 cells', () => {
  expect(swordsmanAndUndeadMoveRadius.includes(48)).toBe(true);
});

test('Swordsman and Undead cannot move further than 4 cells', () => {
  expect(swordsmanAndUndeadMoveRadius.includes(56)).toBe(false);
});

test('Swordsman and Undead cannot move outside the borders', () => {
  expect(swordsmanAndUndeadMoveRadius.includes(15)).toBe(false);
});

test('Swordsman and Undead cannot attack outside the borders', () => {
  expect(swordsmanAndUndeadMoveRadius.includes(13)).toBe(false);
});

test('Swordsman and Undead can attack 1 cell', () => {
  expect(swordsmanAndUndeadAttackRadius.includes(17)).toBe(true);
});

test('Magician cannot attack further than 1 cells', () => {
  expect(swordsmanAndUndeadAttackRadius.includes(18)).toBe(false);
});

const char2 = { character: new Bowman(3), position: 14 };
const bowmanAndVampireMoveAndAttackRadius = gameCtrl.cellsRadius(char2, 'move');

test('Bowman and Vampire moves and attack 2 cells', () => {
  expect(bowmanAndVampireMoveAndAttackRadius.includes(12)).toBe(true);
});

test('Bowman and Vampire cannot move and attack further than 2 cells', () => {
  expect(bowmanAndVampireMoveAndAttackRadius.includes(38)).toBe(false);
});

test('Bowman and Vampire cannot move and attack outside the borders', () => {
  expect(bowmanAndVampireMoveAndAttackRadius.includes(16)).toBe(false);
});

const char3 = { character: new Magician(3), position: 32 };
const magicianAndDaemonMoveRadius = gameCtrl.cellsRadius(char3, 'move');
const magicianAndDaemonAttackRadius = gameCtrl.cellsRadius(char3, 'attack');

test('MagicianAndDaemon moves 1 cells', () => {
  expect(magicianAndDaemonMoveRadius.includes(33)).toBe(true);
});

test('MagicianAndDaemon cannot move further than 1 cells', () => {
  expect(magicianAndDaemonMoveRadius.includes(48)).toBe(false);
});

test('MagicianAndDaemon cannot move outside the borders', () => {
  expect(magicianAndDaemonMoveRadius.includes(31)).toBe(false);
});

test('MagicianAndDaemon cannot attack outside the borders', () => {
  expect(magicianAndDaemonAttackRadius.includes(29)).toBe(false);
});

test('MagicianAndDaemon can attack 4 cell', () => {
  expect(magicianAndDaemonAttackRadius.includes(36)).toBe(true);
});

test('MagicianAndDaemon cannot attack further than 4 cells', () => {
  expect(magicianAndDaemonMoveRadius.includes(37)).toBe(false);
});

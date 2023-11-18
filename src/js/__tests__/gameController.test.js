import GamePlay from '../GamePlay';
import GameController from '../GameController';
import GameStateService from '../GameStateService';
import Bowman from '../characters/Bowman';

const gamePlay = new GamePlay();
const stateService = new GameStateService([]);

const gameCtrl = new GameController(gamePlay, stateService);
const bowman = new Bowman(1);

test('method "generateMessage should return correct message"', () => {
  const received = gameCtrl.generateMessage(bowman);
  expect(received).toBe(`\u{1F396}${1} \u2694${25} \u{1F6E1}${25} \u2764${100}`);
});

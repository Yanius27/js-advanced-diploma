import Themes from './themes';
import PositionedCharacter from './PositionedCharacter';

const themes = new Themes();

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.positionedCharacters = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }

  pushPositionedCharInArr(character, position) {
    if (this.positionedCharacters.find((e) => e.position === position)) {
      throw new Error('Данная клетка уже занята!');
    }
    this.positionedCharacters.push(new PositionedCharacter(character, position));
  }

  drowCharacters(positionedCharacters) {
    this.gamePlay.redrawPositions(positionedCharacters);
  }
}

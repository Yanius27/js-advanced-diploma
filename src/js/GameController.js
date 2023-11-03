/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
import Themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import { generateTeam } from './generators';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import GamePlay from './GamePlay';
import GameState from './GameState';

const themes = new Themes();
const gameState = new GameState();

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.positionedCharacters = [];
    this.playerPositions = [];
    this.enemyPositions = [];
    this.leftBorder = [];
    this.rightBorder = [];
    this.selectedChar = undefined;
    this.generatePositions(gamePlay.boardSize);
    this.borders(gamePlay.boardSize);
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    const numOfCharacters = Math.floor(Math.random() * (5 - 2) + 2);
    this.drowCharacters([Bowman, Magician, Swordsman], 1, numOfCharacters);
    this.drowCharacters([Daemon, Undead, Vampire], 1, numOfCharacters);
    this.listeners();
  }

  // Method for generate lateral borders of the field
  borders(boardSize) {
    for (let i = 0; i < boardSize ** 2; i += boardSize) {
      this.leftBorder.push(i);
      this.rightBorder.push(i + boardSize - 1);
    }
  }

  // Method for generate moveable cells
  cellsRadius(char, actionType) {
    const p = char.position;
    const bs = this.gamePlay.boardSize;
    const occupiedCells = [];
    this.positionedCharacters.forEach((el) => occupiedCells.push(el.position));
    const closestLeftBorder = this.leftBorder.sort((a, b) => Math.abs(p - a) - Math.abs(p - b))[0];
    const closestRightBorder = this.rightBorder.sort((a, b) => Math.abs(p - a) - Math.abs(p - b))[0];
    let radius = new Set();
    let max;
    if (actionType === 'move') {
      if (char.character.type === 'swordsman' || char.character.type === 'undead') {
        max = 4;
      } else if (char.character.type === 'bowman' || char.character.type === 'vampire') {
        max = 2;
      } else {
        max = 1;
      }
    }
    if (actionType === 'attack') {
      if (char.character.type === 'swordsman' || char.character.type === 'undead') {
        max = 1;
      } else if (char.character.type === 'bowman' || char.character.type === 'vampire') {
        max = 2;
      } else {
        max = 4;
      }
    }
    for (let i = 1; i <= max; i++) {
      radius.add(p + i * bs);
      radius.add(p - i * bs);
    }
    if (p === closestLeftBorder) {
      for (let i = 1; i <= max; i++) {
        radius.add(p + i);
        radius.add(p + i * bs + i);
        radius.add(p - i * bs + i);
      }
    } else if (p === closestRightBorder) {
      for (let i = 1; i <= max; i++) {
        radius.add(p - i);
        radius.add(p - i * bs - i);
        radius.add(p + i * bs - i);
      }
    }
    if (bs ** 2 - bs <= p) {
      if (p - closestLeftBorder > (bs ** 2 - 1) - p) {
        for (let i = 1; i <= max; i++) {
          radius.add(p - i);
          radius.add(p - i * bs - i);
          radius.add(p + i * bs - i);
        }
        for (let i = 1; i <= (bs ** 2 - 1) - p; i++) {
          radius.add(p + i);
          radius.add(p + i * bs + i);
          radius.add(p - i * bs + i);
        }
      } else {
        for (let i = 1; i <= p - closestLeftBorder; i++) {
          radius.add(p - i);
          radius.add(p - i * bs - i);
          radius.add(p + i * bs - i);
        }
        for (let i = 1; i <= max; i++) {
          radius.add(p + i);
          radius.add(p + i * bs + i);
          radius.add(p - i * bs + i);
        }
      }
    } else if (p < bs) {
      if (p - 0 > closestRightBorder - p) {
        for (let i = 1; i <= max; i++) {
          radius.add(p - i);
          radius.add(p - i * bs - i);
          radius.add(p + i * bs - i);
        }
        for (let i = 1; i <= closestRightBorder - p; i++) {
          radius.add(p + i);
          radius.add(p + i * bs + i);
          radius.add(p - i * bs + i);
        }
      } else {
        for (let i = 1; i <= p - 0; i++) {
          radius.add(p - i);
          radius.add(p - i * bs - i);
          radius.add(p + i * bs - i);
        }
        for (let i = 1; i <= max; i++) {
          radius.add(p + i);
          radius.add(p + i * bs + i);
          radius.add(p - i * bs + i);
        }
      }
    } else if (p !== closestLeftBorder && p !== closestRightBorder && p < bs ** 2 - bs && p > bs) {
      if (p > closestLeftBorder) {
        for (let i = 1; i <= p - closestLeftBorder; i++) {
          radius.add(p - i);
          radius.add(p - i * bs - i);
          radius.add(p + i * bs - i);
        }
        for (let i = 1; i <= max; i++) {
          radius.add(p + i);
          radius.add(p + i * bs + i);
          radius.add(p - i * bs + i);
        }
      } else if (p < closestLeftBorder) {
        for (let i = 1; i <= max; i++) {
          radius.add(p - i);
          radius.add(p - i * bs - i);
          radius.add(p + i * bs - i);
        }
        for (let i = 1; i <= closestRightBorder - p; i++) {
          radius.add(p + i);
          radius.add(p + i * bs + i);
          radius.add(p - i * bs + i);
        }
      }
    }
    radius = Array.from(radius).filter((el) => el >= 0 && el < bs ** 2);
    if (actionType === 'move') {
      return radius.filter((el) => !occupiedCells.includes(el));
    }
    return radius;
  }

  // Method for generate info message
  generateMessage(character) {
    const {
      level,
      attack,
      defence,
      health,
    } = character;
    return `\u{1F396}${level} \u2694${attack} \u{1F6E1}${defence} \u2764${health}`;
  }

  onCellClick(index) {
    if (gameState.turn === 'computer') {
      alert('Сейчас ход противника!');
      return null;
    }
    const clickedCell = this.positionedCharacters.find((el) => el.position === index);
    if (!this.selectedChar && clickedCell && ['daemon', 'undead', 'vampire'].includes(clickedCell.character.type)) {
      GamePlay.showError('Это персонаж противника');
    } else if (!this.selectedChar && clickedCell && ['bowman', 'swordsman', 'magician'].includes(clickedCell.character.type)) {
      this.selectedChar = clickedCell;
      this.gamePlay.selectCell(index);
    }
    if (this.selectedChar) {
      if (clickedCell && ['daemon', 'undead', 'vampire'].includes(clickedCell.character.type)) {
        console.log(clickedCell, this.selectedChar);
        this.positionedCharacters.forEach((el) => this.gamePlay.deselectCell(el.position));
        this.clickEffect(index, 'attack', clickedCell);
      } else if (clickedCell && ['bowman', 'swordsman', 'magician'].includes(clickedCell.character.type)) {
        this.positionedCharacters.forEach((el) => this.gamePlay.deselectCell(el.position));
        this.selectedChar = clickedCell;
        this.gamePlay.selectCell(index);
      } else {
        this.clickEffect(index, 'move');
      }
    }
  }

  onCellEnter(index) {
    const hoveredCell = this.positionedCharacters.find((el) => el.position === index);
    if (hoveredCell) {
      this.gamePlay.setCursor('pointer');
      const message = this.generateMessage(hoveredCell.character);
      this.gamePlay.showCellTooltip(message, index);
    } else {
      this.gamePlay.setCursor('auto');
    }
    if (this.selectedChar) {
      if (hoveredCell && ['daemon', 'undead', 'vampire'].includes(hoveredCell.character.type)) {
        this.hoverEffect(index, 'attack');
      }
      if (!hoveredCell) {
        this.hoverEffect(index, 'move');
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.cells.forEach((el) => {
      el.classList.remove('selected-green');
      el.classList.remove('selected-red');
    });
    this.gamePlay.hideCellTooltip(index);
  }

  // Helper method for handling mouse hover over a empty cell or character
  hoverEffect(index, typeOfAction) {
    const availableCells = this.cellsRadius(this.selectedChar, typeOfAction);
    if (availableCells.includes(index)) {
      if (typeOfAction === 'move') {
        this.gamePlay.setCursor('pointer');
        this.gamePlay.selectCell(index, 'green');
      } else {
        this.gamePlay.setCursor('crosshair');
        this.gamePlay.selectCell(index, 'red');
      }
    } else {
      this.gamePlay.setCursor('not-allowed');
    }
  }

  clickEffect(index, typeOfAction, enemy) {
    const availableCells = this.cellsRadius(this.selectedChar, typeOfAction);
    if (availableCells.includes(index)) {
      if (typeOfAction === 'move') {
        this.gamePlay.deselectCell(this.selectedChar.position);
        this.selectedChar.position = index;
        this.gamePlay.redrawPositions(this.positionedCharacters);
        this.selectedChar = undefined;
        GameState.from(gameState);
        if (gameState.turn === 'computer') {
          this.enemyTurn();
        }
      } else {
        const damage = Math.max(this.selectedChar.character.attack - enemy.character.defence, this.selectedChar.character.attack * 0.1);
        this.gamePlay.showDamage(index, damage).then(() => {
          enemy.character.health -= damage;
          if (enemy.character.health <= 0) {
            this.positionedCharacters = this.positionedCharacters.filter((el) => el.position !== enemy.position);
          }
          this.gamePlay.redrawPositions(this.positionedCharacters);
          this.selectedChar = undefined;
          if (!this.positionedCharacters.find((el) => el.character.side === 'enemy')) {
            this.playersWin();
          } else if (!this.positionedCharacters.find((el) => el.character.side === 'player')) {
            this.gameOver();
          } else {
            GameState.from(gameState);
            if (gameState.turn === 'computer') {
              this.enemyTurn();
            }
          }
        });
      }
    }
  }

  playersWin() {
    this.positionedCharacters.forEach((el) => {
      el.character.attack = Math.max(el.character.attack, (el.character.attack * (80 + el.character.health)) / 100);
      el.character.defence = Math.max(el.character.defence, (el.character.defence * (80 + el.character.health)) / 100);
      el.character.level++;
      if (el.character.level > 4) {
        el.character.level = 4;
      }
      el.character.health += 80;
      if (el.character.health > 100) {
        el.character.health = 100;
      }
    });
    const numOfCharacters = Math.floor(Math.random() * (5 - 2) + 2);
    this.drowCharacters([Daemon, Undead, Vampire], this.positionedCharacters[0].character.level, numOfCharacters);
  }

  gameOver() {
    console.log('Вы проиграли!');
  }

  //  Method for random enemy character selection
  randomEnemyCharSelection() {
    let count = 0;
    const enemies = [];
    this.positionedCharacters.forEach((el) => {
      if (['daemon', 'undead', 'vampire'].includes(el.character.type)) {
        enemies.push(el);
        count++;
      }
    });
    return enemies[Math.floor(Math.random() * count)];
  }

  enemyTargetSelection(p) {
    const playersTeam = [];
    this.positionedCharacters.forEach((el) => {
      if (['bowman', 'swordsman', 'magician'].includes(el.character.type)) {
        playersTeam.push(el);
      }
    });
    const weakestTarget = playersTeam.find((el) => el.character.health < 30);
    if (weakestTarget) {
      return weakestTarget;
    }
    return playersTeam.sort((a, b) => Math.abs(p - a.position) - Math.abs(p - b.position))[0];
  }

  enemyTurn() {
    this.selectedChar = this.randomEnemyCharSelection();
    const selectedTarget = this.enemyTargetSelection(this.selectedChar.position);
    const p = selectedTarget.position;
    const attackRadius = this.cellsRadius(this.selectedChar, 'attack');
    const moveRadius = this.cellsRadius(this.selectedChar, 'move');
    if (this.selectedChar.character.health > 30 && attackRadius.includes(p)) {
      this.clickEffect(p, 'attack', selectedTarget);
    } else if (this.selectedChar.character.health < 15 && !attackRadius.includes(p)) {
      const furthestCell = moveRadius.sort((a, b) => Math.abs(p - a) - Math.abs(p - b))[moveRadius.length - 1];
      this.clickEffect(furthestCell, 'move', selectedTarget);
    } else {
      const closestCellForTarget = moveRadius.sort((a, b) => Math.abs(p - a) - Math.abs(p - b))[0];
      this.clickEffect(closestCellForTarget, 'move', selectedTarget);
    }
  }

  generatePositions(boardSize) {
    for (let i = 6; i < boardSize ** 2; i += boardSize) {
      this.enemyPositions.push(i);
      this.enemyPositions.push((i) + 1);
    }

    for (let i = 0; i <= boardSize ** 2 - boardSize; i += boardSize) {
      this.playerPositions.push(i);
      this.playerPositions.push((i) + 1);
    }
  }

  generateRandomPosition(side) {
    let position;
    if (side === 'player') {
      position = this.playerPositions[Math.floor(Math.random() * this.playerPositions.length)];
    } else {
      position = this.enemyPositions[Math.floor(Math.random() * this.enemyPositions.length)];
    }
    if (this.positionedCharacters.find((e) => e.position === position)) {
      position = this.generateRandomPosition(side);
    }
    return position;
  }

  pushPositionedCharInArr(character, position) {
    this.positionedCharacters.push(new PositionedCharacter(character, position));
  }

  createTeam(allowedTypes, maxLevel, characterCount) {
    const team = generateTeam(allowedTypes, maxLevel, characterCount);
    if (team.characters.find((el) => el.type === 'bowman' || el.type === 'magician' || el.type === 'swordsman')) {
      team.characters.forEach((item) => {
        const position = this.generateRandomPosition('player');
        this.pushPositionedCharInArr(item, position);
      });
    } else {
      team.characters.forEach((item) => {
        const position = this.generateRandomPosition('enemy');
        this.pushPositionedCharInArr(item, position);
      });
    }
  }

  drowCharacters(allowedTypes, maxLevel, characterCount) {
    this.createTeam(allowedTypes, maxLevel, characterCount);
    if (this.positionedCharacters.length > 0) {
      this.gamePlay.redrawPositions(this.positionedCharacters);
    }
  }

  listeners() {
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }
}

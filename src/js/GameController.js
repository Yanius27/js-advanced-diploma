/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-mixed-operators */
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

export default class GameController {
  constructor(gamePlay, stateService) {
    this.themes = new Themes();
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
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
    console.log(this.stateService.load());
    if (this.stateService.load().gameScore) {
      this.score = this.stateService.load().gameScore;
      this.gameState.state = ['gameScore', this.score];
    } else {
      this.score = 0;
    }
    this.themes = this.changeTheme();
    this.gamePlay.drawUi(this.themes.get(1));
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
        if (p + i === closestRightBorder) {
          break;
        }
      }
    }
    if (p === closestRightBorder) {
      for (let i = 1; i <= max; i++) {
        radius.add(p - i);
        radius.add(p + i * bs - i);
        radius.add(p - i * bs - i);
        if (p - i === closestLeftBorder) {
          break;
        }
      }
    }
    if (p !== closestLeftBorder && p !== closestRightBorder) {
      for (let i = 1; i <= max; i++) {
        radius.add(p + i);
        radius.add(p + i * bs + i);
        radius.add(p - i * bs + i);
        if (p + i === closestRightBorder) {
          break;
        }
      }
      for (let i = 1; i <= max; i++) {
        radius.add(p - i);
        radius.add(p + i * bs - i);
        radius.add(p - i * bs - i);
        if (p - i === closestLeftBorder) {
          break;
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
      _level,
      attack,
      defence,
      health,
    } = character;
    return `\u{1F396}${_level} \u2694${attack} \u{1F6E1}${defence} \u2764${health}`;
  }

  onCellClick(index) {
    if (this.gameState.turn === 'computer') {
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

  onNewGameClick() {
    this.positionedCharacters = [];
    this.gamePlay.drawUi(this.themes.get(1));
    const numOfCharacters = Math.floor(Math.random() * (5 - 2) + 2);
    this.drowCharacters([Bowman, Magician, Swordsman], 1, numOfCharacters);
    this.drowCharacters([Daemon, Undead, Vampire], 1, numOfCharacters);
    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  onSaveGameClick() {
    this.gameState.state = ['charList', this.positionedCharacters];
    this.gameState.state = ['level', this.positionedCharacters[0].character._level];
    console.log(this.gameState.state);

    this.stateService.save(this.gameState.state);
  }

  onLoadGameClick() {
    const state = this.stateService.load();
    if (state.charList) {
      this.positionedCharacters = state.charList;
      this.gamePlay.drawUi(this.themes.get(state.level));
      this.gamePlay.redrawPositions(this.positionedCharacters);
    }
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
        GameState.from(this.gameState);
        if (this.gameState.turn === 'computer') {
          this.enemyTurn();
        }
      } else {
        const damage = Math.round(Math.max(this.selectedChar.character.attack - enemy.character.defence, this.selectedChar.character.attack * 0.1));
        this.gamePlay.showDamage(index, damage).then(() => {
          enemy.character.health -= damage;
          if (enemy.character.health <= 0) {
            this.positionedCharacters = this.positionedCharacters.filter((el) => el.position !== enemy.position);
          }
          this.gamePlay.redrawPositions(this.positionedCharacters);
          this.selectedChar = undefined;
          if (!this.positionedCharacters.find((el) => el.character.side === 'enemy') && this.positionedCharacters[0].character._level < 4) {
            const { _level } = this.positionedCharacters[0].character;
            this.playersWin(_level);
          } else if (!this.positionedCharacters.find((el) => el.character.side === 'enemy') && this.positionedCharacters[0].character._level === 4) {
            this.gameOver('Вы выиграли!');
          } else if (!this.positionedCharacters.find((el) => el.character.side === 'player')) {
            this.gameOver('Вы проиграли');
          } else {
            GameState.from(this.gameState);
            if (this.gameState.turn === 'computer') {
              this.enemyTurn();
            }
          }
        });
      }
    }
  }

  playersWin(level) {
    this.score += 1;
    this.gameState.state = ['gameScore', this.score];
    this.stateService.save(this.gameState.state);
    level += 1;
    if (this.positionedCharacters.length === 1) {
      this.drowCharacters([Bowman, Magician, Swordsman], 1, 2);
    } else if (this.positionedCharacters.length === 2) {
      this.drowCharacters([Bowman, Magician, Swordsman], 1, 1);
    }
    this.drowCharacters([Daemon, Undead, Vampire], 1, this.positionedCharacters.length);
    this.positionedCharacters.forEach((el) => {
      if (el.character.health < 100) {
        el.character._level = level;
        el.character.attack = Math.max(el.character.attack, Math.round((el.character.attack * (80 + el.character.health) / 100)));
        el.character.defence = Math.max(el.character.defence, Math.round((el.character.defence * (80 + el.character.health)) / 100));
        el.character.health += 80;
        if (el.character.health > 100) {
          el.character.health = 100;
        }
      } else {
        el.character.level = level;
      }
    });
    this.gamePlay.drawUi(this.themes.get(level));
    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  changeTheme() {
    const themesArr = Object.entries(this.themes);
    let levelIndex = 1;
    themesArr.forEach((el) => {
      el[0] = levelIndex;
      levelIndex++;
    });
    return new Map(themesArr);
  }

  gameOver(message) {
    if (message === 'Вы выиграли!') {
      this.score += 1;
      this.gameState.state = ['gameScore', this.score];
      this.stateService.save(this.gameState.state);
    }
    alert(message);
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
    return playersTeam.sort((a, b) => Math.abs(p - a.position) - Math.abs(p - b.position))[0];
  }

  enemyTurn() {
    this.changeTheme();
    this.selectedChar = this.randomEnemyCharSelection();
    const attackRadius = this.cellsRadius(this.selectedChar, 'attack');
    const moveRadius = this.cellsRadius(this.selectedChar, 'move');
    const playersTeam = [];
    this.positionedCharacters.forEach((el) => {
      if (['bowman', 'swordsman', 'magician'].includes(el.character.type)) {
        playersTeam.push(el);
      }
    });
    const accessibleTarget = playersTeam.find((el) => attackRadius.includes(el.position));
    if (accessibleTarget) {
      this.clickEffect(accessibleTarget.position, 'attack', accessibleTarget);
      return 0;
    }
    const weakestTarget = playersTeam.find((el) => el.character.health < 30);
    if (weakestTarget && attackRadius.includes(weakestTarget.position)) {
      this.clickEffect(weakestTarget.position, 'attack', weakestTarget);
      return 0;
    }
    if (weakestTarget && !attackRadius.includes(weakestTarget.position)) {
      const closestCellForTarget = moveRadius.sort((a, b) => Math.abs(weakestTarget.position - a) - Math.abs(weakestTarget.position - b))[0];
      this.clickEffect(closestCellForTarget, 'move', weakestTarget);
      return 0;
    }
    const randomTarget = this.enemyTargetSelection(this.selectedChar.position);
    const p = randomTarget.position;
    if (this.selectedChar.character.health > 30 && attackRadius.includes(p)) {
      this.clickEffect(p, 'attack', randomTarget);
    } else if (this.selectedChar.character.health < 15 && !attackRadius.includes(p)) {
      const furthestCell = moveRadius.sort((a, b) => Math.abs(p - a) - Math.abs(p - b))[moveRadius.length - 1];
      this.clickEffect(furthestCell, 'move', randomTarget);
    } else {
      const closestCellForTarget = moveRadius.sort((a, b) => Math.abs(p - a) - Math.abs(p - b))[0];
      this.clickEffect(closestCellForTarget, 'move', randomTarget);
      return 0;
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
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
  }
}

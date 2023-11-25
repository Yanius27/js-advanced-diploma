import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

jest.mock('../GamePlay');

beforeEach(() => jest.resetAllMocks());

test('methold load() should throw Error', () => {
  const stateService = new GameStateService(null);
  expect(() => stateService.load()).toThrow(new Error('Invalid state'));
});

test('mock method is called if load() throw Error', () => {
  const stateService = new GameStateService(null);
  const mockLoad = jest.fn(() => GamePlay.showError('Ошибка загрузки'));
  try {
    stateService.load();
  } catch (err) {
    mockLoad();
  }
  expect(mockLoad).toHaveBeenCalled();
});

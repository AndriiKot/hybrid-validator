import { Validator } from './Validator.js';

// ==================================================
// Тестовые данные
// ==================================================

const testData = [
  {
    description: 'Полный пользователь с несколькими языками',
    data: {
      id: '625dae5f8f66eb001c7ef330',
      username: 'Krillan',
      name: '',
      honor: 29706,
      clan: null,
      leaderboardPosition: 176,
      skills: ['javascript', 'sql'],
      ranks: {
        overall: {
          rank: 1,
          name: '1 dan',
          color: 'black',
          score: 38060,
        },
        languages: {
          ruby: { rank: -1, name: '1 kyu', color: 'purple', score: 28600 },
          sql: { rank: -3, name: '3 kyu', color: 'blue', score: 3015 },
          javascript: { rank: -2, name: '2 kyu', color: 'purple', score: 6801 },
          shell: { rank: -5, name: '5 kyu', color: 'yellow', score: 416 },
        },
      },
      codeChallenges: { totalAuthored: 2, totalCompleted: 4377 },
    },
  },
  {
    description: 'Пользователь без языков (пустой объект)',
    data: {
      id: '625d-test-empty',
      username: 'EmptyLangs',
      ranks: {
        overall: { rank: 5, name: '5 kyu', color: 'white', score: 1000 },
        languages: {},
      },
      codeChallenges: { totalAuthored: 0, totalCompleted: 0 },
      skills: [],
    },
  },
  {
    description: 'Пользователь с динамическим языком "go"',
    data: {
      id: '625d-test-go',
      username: 'Gopher',
      ranks: {
        overall: { rank: 3, name: '3 kyu', color: 'green', score: 1500 },
        languages: {
          go: { rank: 1, name: '1 kyu', color: 'teal', score: 5000 },
        },
      },
      codeChallenges: { totalAuthored: 1, totalCompleted: 10 },
      skills: ['golang'],
    },
  },
  {
    description: 'Неправильный тип поля (honor как строка)',
    data: {
      id: '625d-test-badtype',
      username: 'BadType',
      honor: '1000', // ❌ должно быть число
      ranks: {
        overall: { rank: 2, name: '2 kyu', color: 'red', score: 2000 },
        languages: {},
      },
      codeChallenges: { totalAuthored: 0, totalCompleted: 0 },
      skills: [],
    },
  },
  {
    description: 'Дополнительное поле в languages (strict=false)',
    data: {
      id: '625d-test-extra',
      username: 'ExtraLang',
      ranks: {
        overall: { rank: 2, name: '2 kyu', color: 'blue', score: 2500 },
        languages: {
          rust: { rank: 1, name: '1 kyu', color: 'orange', score: 6000 },
          weirdLang: { rank: 0, name: '0 kyu', color: 'pink', score: 10 },
        },
      },
      codeChallenges: { totalAuthored: 5, totalCompleted: 50 },
      skills: ['rust'],
    },
  },
];

// ==================================================
// Схема пользователя
// ==================================================

const userSchema = {
  type: 'object',
  required: ['id', 'username', 'ranks', 'codeChallenges'],
  properties: {
    id: { type: 'string' },
    username: { type: 'string' },
    name: { type: ['string', 'null'] },
    honor: { type: 'number' },
    clan: { type: ['string', 'null'] },
    leaderboardPosition: { type: 'number' },
    skills: { type: 'array', items: { type: 'string' } },
    ranks: {
      type: 'object',
      required: ['overall', 'languages'],
      properties: {
        overall: {
          type: 'object',
          required: ['rank', 'name', 'color', 'score'],
          properties: {
            rank: { type: 'number' },
            name: { type: 'string' },
            color: { type: 'string' },
            score: { type: 'number' },
          },
        },
        languages: {
          type: 'object',
          patternProperties: {
            '.*': {
              type: 'object',
              required: ['rank', 'name', 'color', 'score'],
              properties: {
                rank: { type: 'number' },
                name: { type: 'string' },
                color: { type: 'string' },
                score: { type: 'number' },
              },
            },
          },
          additionalProperties: false,
        },
      },
    },
    codeChallenges: {
      type: 'object',
      required: ['totalAuthored', 'totalCompleted'],
      properties: {
        totalAuthored: { type: 'number' },
        totalCompleted: { type: 'number' },
      },
    },
  },
};

// ==================================================
// Валидация
// ==================================================

const validator = new Validator();

testData.forEach(({ description, data }) => {
  console.log(`\n=== Test: ${description} ===`);
  const nativeResult = validator.validate(userSchema, data);
  console.log('NativeEngine result:', nativeResult);

  const compiledFn = validator.compile(userSchema);
  const compiledResult = compiledFn(data);
  console.log('Compiled validator result:', compiledResult);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { Validator } from '#lib';

// ==================================================
// TEST: compile() works with nested arrays
// ==================================================
test('compile() works with nested arrays', () => {
  const validator = new Validator();

  const schema = {
    type: 'array',
    items: {
      type: 'array',
      items: { type: 'number' },
    },
  };

  const validate = validator.compile(schema);

  const validData = [[1, 2], [3]];
  const invalidData = [[1, '2']];

  const resultValid = validate(validData);
  assert.equal(resultValid.isValid, true);

  const resultInvalid = validate(invalidData);
  assert.equal(resultInvalid.isValid, false);
});

// ==================================================
// BASIC USAGE
// ==================================================

test('Validator constructor with default options', () => {
  const validator = new Validator();
  assert.ok(validator instanceof Validator);
  assert.deepEqual(validator.options, {
    recursive: true,
    strict: true,
    customTypes: {},
    customValidators: [],
  });
});

test('validate() returns valid result for correct data', () => {
  const validator = new Validator();

  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'integer' },
    },
  };

  const data = { name: 'John', age: 30 };

  const result = validator.validate({ schema, data });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, []);
});

test('validate() returns errors for invalid data', () => {
  const validator = new Validator();

  const schema = {
    type: 'object',
    properties: {
      age: { type: 'number' },
    },
  };

  const data = { age: '30' };

  const result = validator.validate({ schema, data });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].path, 'age');
});

// ==================================================
// COMPILE & CACHE
// ==================================================

test('compile() returns a validation function', () => {
  const validator = new Validator();
  const schema = { type: 'string' };

  const validate = validator.compile(schema);

  assert.equal(typeof validate, 'function');
  assert.equal(validate('hello').isValid, true);
  assert.equal(validate(123).isValid, false);
});

test('compile() caches compiled function for same schema object', () => {
  const validator = new Validator();
  const schema = { type: 'number' };

  const fn1 = validator.compile(schema);
  const fn2 = validator.compile(schema);

  assert.strictEqual(fn1, fn2);
});

test('compile() does not share cache for different schema objects', () => {
  const validator = new Validator();

  const schemaA = { type: 'string' };
  const schemaB = { type: 'string' };

  const fn1 = validator.compile(schemaA);
  const fn2 = validator.compile(schemaB);

  assert.notStrictEqual(fn1, fn2);
});

test('clearCache() removes cache', () => {
  const validator = new Validator();
  const schema = { type: 'boolean' };

  const fn1 = validator.compile(schema);
  validator.clearCache();
  const fn2 = validator.compile(schema);

  assert.notStrictEqual(fn1, fn2);
});

// ==================================================
// OPTIONS
// ==================================================

test('strict mode works', () => {
  const validator = new Validator({ strict: true });

  const schema = {
    type: 'object',
    properties: { name: { type: 'string' } },
    additionalProperties: false,
  };

  const data = { name: 'John', age: 30 };

  const result = validator.validate({ schema, data });

  assert.equal(result.isValid, false);
  assert.equal(result.errors[0].path, 'age');
});

test('customTypes work', () => {
  const validator = new Validator({
    customTypes: {
      even: (v) => typeof v === 'number' && v % 2 === 0,
    },
  });

  const schema = { type: 'even' };

  assert.equal(validator.validate({ schema, data: 4 }).isValid, true);
  assert.equal(validator.validate({ schema, data: 3 }).isValid, false);
});

test('customValidators work', () => {
  const validator = new Validator({
    customValidators: [
      (data, path, errors) => {
        if (data.age < 18) {
          errors.push({ path: 'age', message: 'Too young' });
        }
      },
    ],
  });

  const schema = {
    type: 'object',
    properties: { age: { type: 'integer' } },
  };

  const result = validator.validate({ schema, data: { age: 10 } });

  assert.equal(result.isValid, false);
});

// ==================================================
// EDGE CASES
// ==================================================

test('null works', () => {
  const validator = new Validator();
  const schema = { type: 'null' };

  const result = validator.validate({ schema, data: null });

  assert.equal(result.isValid, true);
});

test('nested path', () => {
  const validator = new Validator();

  const schema = {
    type: 'object',
    properties: {
      user: {
        type: 'object',
        properties: {
          age: { type: 'number' },
        },
      },
    },
  };

  const data = { user: { age: '30' } };

  const result = validator.validate({ schema, data });

  assert.equal(result.errors[0].path, 'user.age');
});

test('array index path', () => {
  const validator = new Validator();

  const schema = {
    type: 'array',
    items: { type: 'number' },
  };

  const data = [1, 2, '3'];

  const result = validator.validate({ schema, data });

  assert.equal(result.errors[0].path, '[2]');
});

test('boolean schema true', () => {
  const validator = new Validator();

  const result = validator.validate({ schema: true, data: 123 });

  assert.equal(result.isValid, true);
});

test('boolean schema false', () => {
  const validator = new Validator();

  const result = validator.validate({ schema: false, data: 123 });

  assert.equal(result.isValid, false);
});

test('empty schema', () => {
  const validator = new Validator();

  const result = validator.validate({ schema: {}, data: 123 });

  assert.equal(result.isValid, true);
});

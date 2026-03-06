import test from 'node:test';
import assert from 'node:assert/strict';

import { NativeEngine } from '#src';

test('valid object with required fields', () => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'number' },
    },
    required: ['name', 'age'],
  };

  const data = {
    name: 'John',
    age: 30,
  };

  const engine = new NativeEngine();
  const result = engine.validate(schema, data);

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, []);
});

test('missing required field', () => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'number' },
    },
    required: ['name', 'age'],
  };

  const data = {
    name: 'John',
  };

  const engine = new NativeEngine();
  const result = engine.validate(schema, data);

  assert.equal(result.isValid, false);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].path, 'age');
});

test('type validation failure', () => {
  const schema = {
    type: 'object',
    properties: {
      age: { type: 'number' },
    },
  };

  const data = {
    age: '30',
  };

  const engine = new NativeEngine();
  const result = engine.validate(schema, data);

  assert.equal(result.isValid, false);
  assert.equal(result.errors[0].path, 'age');
});

test('array validation', () => {
  const schema = {
    type: 'array',
    items: {
      type: 'number',
    },
  };

  const data = [1, 2, 3];

  const engine = new NativeEngine();
  const result = engine.validate(schema, data);

  assert.equal(result.isValid, true);
});

test('enum validation', () => {
  const schema = {
    type: 'string',
    enum: ['red', 'green', 'blue'],
  };

  const data = 'yellow';

  const engine = new NativeEngine();
  const result = engine.validate(schema, data);

  assert.equal(result.isValid, false);
});

test('number minimum validation', () => {
  const schema = {
    type: 'number',
    minimum: 10,
  };

  const data = 5;

  const engine = new NativeEngine();
  const result = engine.validate(schema, data);

  assert.equal(result.isValid, false);
});

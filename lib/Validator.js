import { NativeEngine } from './NativeEngine.js';
import { CodeGenerator } from './CodeGenerator.js';

export class Validator {
  #compiledCache;

  constructor(options = {}) {
    this.options = {
      recursive: true,
      strict: true,
      customTypes: {},
      customValidators: [],
      ...options,
    };

    this.#compiledCache = new WeakMap();
  }

  // ==================================================
  // PUBLIC API
  // ==================================================

  validate({ schema, data }) {
    const engine = new NativeEngine(this.options);
    return engine.validate({ schema, data });
  }

  compile(schema) {
    if (this.#compiledCache.has(schema)) {
      return this.#compiledCache.get(schema);
    }

    const generator = new CodeGenerator(this.options);
    const compiledFn = generator.compile(schema);

    this.#compiledCache.set(schema, compiledFn);

    return compiledFn;
  }

  clearCache() {
    this.#compiledCache = new WeakMap();
  }
}

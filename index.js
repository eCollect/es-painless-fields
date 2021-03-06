'use strict';

const {unflatten} = require('flat');

module.exports = {
  /**
   * Generates a script object which sets fields on the _source document
   * @param {Object} fieldsMap Object with fields to set
   * @return {{lang: string, source: string, params: *}} Painless Script Object
   */
  set(fieldsMap = {}) {
    const source = Object.keys(fieldsMap)
      .map(key => `ctx._source.${key} = params.${key};`)
      .join(' ');

    return {
      lang: 'painless',
      source,
      params: unflatten(fieldsMap)
    };
  },
  /**
   * Generates a script object which unsets fields on the _source document
   * @param {String[]} fields Arrray of field names to unset
   * @return {{lang: string, source: string, params: *}} Painless Script Object
   */
  unset(fields = []) {
    const source = fields.map(key => `ctx._source.remove('${key}')`).join('; ');

    return {
      lang: 'painless',
      source
    };
  },
  /**
   * Generates a script object which replaces fields on the _source document
   * @param {Object[]} fieldsReplacements Array of objects describing what to replace
   * @return {{lang: string, source: string, params: *}} Painless Script Object
   */
  replace(fieldsReplacements = []) {
    const source = fieldsReplacements
      .map((replaceRule, i) => {
        const sourceField = `ctx._source.${replaceRule.field}`;
        const pattern = `params.patterns[${i}]`;
        const substring = `params.substrings[${i}]`;

        return `${sourceField} = ${sourceField}.replace(${pattern}, ${substring});`;
      })
      .join(' ');

    return {
      lang: 'painless',
      source,
      params: {
        patterns: fieldsReplacements.map(i => i.pattern),
        substrings: fieldsReplacements.map(i => i.substring)
      }
    };
  },
  /**
   * Generates a script object which increments fields on the _source document
   * @param {Object} fieldsMap Object with fields to increment
   * @return {{lang: string, source: string, params: *}} Painless Script Object
   */
  increment(fieldsMap = {}) {
    const source = Object.keys(fieldsMap)
      .map(key => `ctx._source.${key} += params._inc.${key};`)
      .join(' ');

    return {
      lang: 'painless',
      source,
      params: source ? {_inc: unflatten(fieldsMap)} : {}
    };
  },
  /**
   * Generates a script object which decrements fields on the _source document
   * @param {Object} fieldsMap Object with fields to decrement
   * @return {{lang: string, source: string, params: *}} Painless Script Object
   */
  decrement(fieldsMap = {}) {
    const source = Object.keys(fieldsMap)
      .map(key => `ctx._source.${key} -= params._dec.${key};`)
      .join(' ');

    return {
      lang: 'painless',
      source,
      params: source ? {_dec: unflatten(fieldsMap)} : {}
    };
  },
  /**
   * Generates a script object which multiplies fields on the _source document
   * @param {Object} fieldsMap Object with fields to multiply
   * @return {{lang: string, source: string, params: *}} Painless Script Object
   */
  multiply(fieldsMap = {}) {
    const source = Object.keys(fieldsMap)
      .map(key => `ctx._source.${key} *= params._mul.${key};`)
      .join(' ');

    return {
      lang: 'painless',
      source,
      params: source ? {_mul: unflatten(fieldsMap)} : {}
    };
  },
  /**
   * Generates a script object which divides fields on the _source document
   * @param {Object} fieldsMap Object with fields to divide
   * @return {{lang: string, source: string, params: *}} Painless Script Object
   */
  divide(fieldsMap = {}) {
    const source = Object.keys(fieldsMap)
      .map(key => `ctx._source.${key} /= params._div.${key};`)
      .join(' ');

    return {
      lang: 'painless',
      source,
      params: source ? {_div: unflatten(fieldsMap)} : {}
    };
  }
};

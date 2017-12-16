const m = require('.');

describe('#set', () => {
  it('should export a set function', () => {
    expect(m.set).toBeInstanceOf(Function);
  });

  it('should return a script to set 2 simple fields', () => {
    const fieldsMap = {
      a: 1,
      b: 2
    };
    const result = m.set(fieldsMap);

    expect(result).toEqual({
      lang: 'painless',
      source: 'ctx._source.a = params.a; ctx._source.b = params.b;',
      params: {
        a: 1,
        b: 2
      }
    });
  });
});

describe('#replace', () => {
  it('should export a replace function', () => {
    expect(m.replace).toBeInstanceOf(Function);
  });

  it('should return a script to replace 2 fields by pattern', () => {
    const fieldsReplacements = [
      {field: 'a', pattern: 'foo', substring: 'bar'},
      {field: 'b', pattern: 'hello', substring: 'world'},
    ];
    const result = m.replace(fieldsReplacements);

    expect(result).toEqual({
      lang: 'painless',
      source: 'ctx._source.a = ctx._source.a.replace(params.patterns[0], params.substrings[0]); ctx._source.b = ctx._source.b.replace(params.patterns[1], params.substrings[1]);',
      params: {
        patterns: ['foo', 'hello'],
        substrings: ['bar', 'world']
      }
    });
  });
});

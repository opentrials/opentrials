'use strict';

const should = require('should');
const formatObject = require('../../../views/filters/format-object');

describe('formatObject', () => {
  it('works with null', () => {
    should(formatObject(null)).eql('null');
  });

  it('works with undefined', () => {
    should(formatObject(undefined)).eql('undefined');
  });

  it('works with numbers', () => {
    should(formatObject(42)).eql('42');
  });

  it('works with strings', () => {
    should(formatObject('foo')).eql('foo');
  });

  it('works with booleans', () => {
    should(formatObject(true)).eql('true');
  });

  it('works with arrays', () => {
    should(formatObject(['foo', 'bar'])).eql('<ol><li>foo</li><li>bar</li></ol>');
  });

  it('works with empty arrays', () => {
    should(formatObject([])).eql('<ol></ol>');
  });

  it('works with empty objects', () => {
    should(formatObject({})).eql('<dl></dl>');
  });

  it('works with objects', () => {
    should(formatObject({ foo: 'bar' })).eql('<dl><dt>Foo</dt><dd>bar</dd></dl>');
  });

  it('works with complex objects', () => {
    const obj = {
      arr: [
        42,
        'foo',
      ],
      nested: {
        foo: 'bar',
      },
      null: null,
      undefined,
      str: 'foo',
      bool: true,
    };

    should(formatObject(obj)).eql(
      '<dl><dt>Arr</dt><dd><ol><li>42</li><li>foo</li></ol></dd>' +
      '<dt>Bool</dt><dd>true</dd>' +
      '<dt>Nested</dt><dd><dl><dt>Foo</dt><dd>bar</dd></dl></dd>' +
      '<dt>Null</dt><dd>null</dd>' +
      '<dt>Str</dt><dd>foo</dd>' +
      '<dt>Undefined</dt><dd>undefined</dd></dl>'
    );
  });
});

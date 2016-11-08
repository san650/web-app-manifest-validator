'use strict';

var assert = require('assert');
var validate = require('../index');

var EMPTY = [];

describe('validate', function() {
  it('validates correctly an empty object', function() {
    assert.deepEqual(validate({}), EMPTY);
  });

  describe('dir member', function() {
    it('returns an error on invalid string value', function() {
      var expected = [
        'Invalid "dir" value "foo". Expected one of "rtl", "ltr" or "auto".'
      ];
      var manifest = {
        dir: 'foo'
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('returns an error on invalid value type', function() {
      var expected = [
        'Invalid "dir" value type "number". Expected a string or undefined.'
      ];
      var manifest = {
        dir: 100
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('is valid when is rtl, ltr or auto values', function() {
      assert.deepEqual(validate({ dir: 'rtl' }), EMPTY);
      assert.deepEqual(validate({ dir: 'ltr' }), EMPTY);
      assert.deepEqual(validate({ dir: 'auto' }), EMPTY);
    });

    it('is valid when is a valid value in UPPER CASE', function() {
      assert.deepEqual(validate({ dir: 'RTL' }), EMPTY);
      assert.deepEqual(validate({ dir: 'LTR' }), EMPTY);
      assert.deepEqual(validate({ dir: 'AUTO' }), EMPTY);
    });

    it('is valid when value is undefined', function() {
      assert.deepEqual(validate({ dir: undefined }), EMPTY);
    });
  });

  describe('lang member', function() {
    it('returns an error on invalid value', function() {
      var expected = [
        'Invalid "lang" value "!@@$@#".'
      ];
      var manifest = {
        lang: '!@@$@#'
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('is valid when has foo-bar format', function() {
      var manifest = {
        lang: 'foo-bar'
      };

      assert.deepEqual(validate(manifest), EMPTY);
    });

    it('is valid when value is undefined', function() {
      assert.deepEqual(validate({ lang: undefined }), EMPTY);
    });
  });

  // describe('name member', function() {
  //   it('returns an error on invalid value', function() {
  //     
  //   });
  // });
});

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

  describe('name member', function() {
    it('returns an error on invalid value type', function() {
      var expected = [
        'Invalid "name" value type "number". Expected a string or undefined.'
      ];
      var manifest = {
        name: 123
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('is valid for any string', function() {
      var manifest = {
        name: 'foo bar'
      };

      assert.deepEqual(validate(manifest), EMPTY);
    });

    it('is valid when value is undefined', function() {
      assert.deepEqual(validate({ name: undefined }), EMPTY);
    });
  });

  describe('short_name member', function() {
    it('returns an error on invalid value type', function() {
      var expected = [
        'Invalid "short_name" value type "number". Expected a string or undefined.'
      ];
      var manifest = {
        short_name: 123
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('is valid for any string', function() {
      var manifest = {
        short_name: 'foo bar'
      };

      assert.deepEqual(validate(manifest), EMPTY);
    });

    it('is valid when value is undefined', function() {
      assert.deepEqual(validate({ short_name: undefined }), EMPTY);
    });
  });

  describe('description member', function() {
    it('returns an error on invalid value type', function() {
      var expected = [
        'Invalid "description" value type "number". Expected a string or undefined.'
      ];
      var manifest = {
        description: 123
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('is valid for any string', function() {
      var manifest = {
        description: 'foo bar'
      };

      assert.deepEqual(validate(manifest), EMPTY);
    });

    it('is valid when value is undefined', function() {
      assert.deepEqual(validate({ description: undefined }), EMPTY);
    });
  });

  describe('scope member', function() {
    it('returns an error on invalid value type', function() {
      var expected = [
        'Invalid "scope" value type "number". Expected a string or undefined.'
      ];
      var manifest = {
        scope: 123
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('is valid for any string', function() {
      var manifest = {
        scope: 'foo bar'
      };

      assert.deepEqual(validate(manifest), EMPTY);
    });

    it('is valid when value is undefined', function() {
      assert.deepEqual(validate({ scope: undefined }), EMPTY);
    });
  });

  describe('start_url member', function() {
    it('returns an error on invalid value type', function() {
      var expected = [
        'Invalid "start_url" value type "number". Expected a string or undefined.'
      ];
      var manifest = {
        start_url: 123
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('is valid for any string', function() {
      var manifest = {
        start_url: '/foo/bar'
      };

      assert.deepEqual(validate(manifest), EMPTY);
    });

    it('is valid when value is undefined', function() {
      assert.deepEqual(validate({ start_url: undefined }), EMPTY);
    });

    it('returns an error if start_url is not within scope of scopeURL', function() {
      var expected = [
        'Invalid "start_url" value. "start_url" is not within scope of scope URL.'
      ];
      var manifest = {
        start_url: '/foo/bar',
        scope: '/baz/qux'
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('is valid when start_url is in the sope of scope URL', function() {
      var manifest = {
        start_url: '/foo/bar',
        scope: '/foo'
      };

      assert.deepEqual(validate(manifest), EMPTY);
    });
  });
});

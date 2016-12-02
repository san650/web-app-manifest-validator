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
        'Invalid "dir" value "100". Expected one of "rtl", "ltr" or "auto".'
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

  describe('icons member', function() {
    it('returns an error on invalid value type', function() {
      var expected = [
        'Invalid "icons" value type "number". Expected an array or undefined.'
      ];
      var manifest = {
        icons: 123
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('is valid when value is undefined', function() {
      assert.deepEqual(validate({ icons: undefined }), EMPTY);
    });

    it('is valid when is an empty array', function() {
      var manifest = {
        icons: [ ]
      };

      assert.deepEqual(validate(manifest), EMPTY);
    });

    it('is valid when element has source and sizes' , function() {
      var manifest = {
        icons: [
          {
            src: "icon/lowres.webp",
            sizes: "16x16 32x32 48x48",
            type: "image/webp"
          },{
            src: "icon/lowres.png",
            sizes: "64x64"
          }, {
            src: "icon/hd_hi",
            sizes: "128x128"
          }
        ]
      };

      assert.deepEqual(validate(manifest), EMPTY);
    });

    it('validates src exists for every icon', function() {
      var manifest = {
        icons: [
          {
            src: "icon/lowres.webp",
            sizes: "16x16 32x32 48x48",
            type: "image/webp"
          },{
            sizes: "64x64"
          }, {
            src: 12,
            sizes: "128x128"
          }
        ]
      };

      assert.deepEqual(validate(manifest), [
        'Invalid "icons" value. Icons need to have a valid "src" attribute.'
      ]);
    });

    it('validates sizes are valid for every icon', function() {
      var manifest = {
        icons: [
          {
            src: "icon/lowres.webp",
            sizes: "x16"
          },{
            src: "icon/lowres.webp",
            sizes: "64x64 "
          }, {
            src: "icon/lowres.webp",
            sizes: "hola"
          },
          {
            src: "icon/lowres.webp",
            sizes: 128
          },{
            src: "icon/lowres.webp",
            sizes: "64x64,64x64"
          }, {
            src: "icon/lowres.webp",
            sizes: "64x6464x64"
          }, {
            src: "icon/lowres.webp",
            sizes: "64x64   64x64"
          }
        ]
      };

      assert.deepEqual(validate(manifest), [
        `Invalid icon's "sizes" value "x16". The expected format is "123x345".`,
        `Invalid icon's "sizes" value "hola". The expected format is "123x345".`,
        `Invalid icon's "sizes" value "128". The expected format is "123x345".`,
        `Invalid icon's "sizes" value "64x64,64x64". The expected format is "123x345".`,
        `Invalid icon's "sizes" value "64x6464x64". The expected format is "123x345".`
      ]);
    });

    it('validates type if of valid type for every icon', function() {
      var manifest = {
        icons: [
          {
            src: "icon/lowres.webp",
            type: "foo/bar"
          },{
            src: "icon/lowres.webp",
            type: 100
          }
        ]
      };

      assert.deepEqual(validate(manifest), [
        'Invalid "type" value type "number". Expected a string or undefined.'
      ]);
    });

    it('validates icon has unknown properties', function() {
      var expected = [
        `Unknown icon attribute "foo".`
      ];

      var manifest = {
        icons: [
          {
            src: "icon/lowres.webp",
            foo: 123
          }
        ]
      };

      assert.deepEqual(validate(manifest), expected);
    });
  });

  describe('display member', function() {
    it('returns an error on invalid string value', function() {
      var expected = [
        'Invalid "display" value "foo". Expected one of "fullscreen", "standalone", "minimal-ui" or "browser".'
      ];
      var manifest = {
        display: 'foo'
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('returns an error on invalid value type', function() {
      var expected = [
        'Invalid "display" value "100". Expected one of "fullscreen", "standalone", "minimal-ui" or "browser".'
      ];
      var manifest = {
        display: 100
      };

      assert.deepEqual(validate(manifest), expected);
    });
  });

  describe('orientation member', function() {
    it('returns an error on invalid string value', function() {
      var expected = [
        'Invalid "orientation" value "foo". Expected one of "any", "natural", "landscape", "landscape-primary", "landscape-secondary", "portrait", "portrait-primary" or "portrait-secondary".'
      ];
      var manifest = {
        orientation: 'foo'
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('returns an error on invalid value type', function() {
      var expected = [
        'Invalid "orientation" value "100". Expected one of "any", "natural", "landscape", "landscape-primary", "landscape-secondary", "portrait", "portrait-primary" or "portrait-secondary".'
      ];
      var manifest = {
        orientation: 100
      };

      assert.deepEqual(validate(manifest), expected);
    });
  });

  describe('color member', function() {
    it('returns an error on invalid value type', function() {
      var expected = [
        'Invalid "color" value type "number". Expected a string or undefined.'
      ];
      var manifest = {
        color: 123
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('is valid for any string', function() {
      var manifest = {
        color: 'foo bar'
      };

      assert.deepEqual(validate(manifest), EMPTY);
    });

    it('is valid when value is undefined', function() {
      assert.deepEqual(validate({ color: undefined }), EMPTY);
    });
  });

  describe('background_color member', function() {
    it('returns an error on invalid value type', function() {
      var expected = [
        'Invalid "background_color" value type "number". Expected a string or undefined.'
      ];
      var manifest = {
        background_color: 123
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('is valid for any string', function() {
      var manifest = {
        background_color: 'foo bar'
      };

      assert.deepEqual(validate(manifest), EMPTY);
    });

    it('is valid when value is undefined', function() {
      assert.deepEqual(validate({ background_color: undefined }), EMPTY);
    });
  });

  describe('theme_color member', function() {
    it('returns an error on invalid value type', function() {
      var expected = [
        'Invalid "theme_color" value type "number". Expected a string or undefined.'
      ];
      var manifest = {
        theme_color: 123
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('is valid for any string', function() {
      var manifest = {
        theme_color: 'foo bar'
      };

      assert.deepEqual(validate(manifest), EMPTY);
    });

    it('is valid when value is undefined', function() {
      assert.deepEqual(validate({ theme_color: undefined }), EMPTY);
    });
  });

  describe('prefer_related_applications member', function() {
    it('returns an error on invalid value type', function() {
      var expected = [
        'Invalid "prefer_related_applications" value type "number". Expected a boolean or undefined.'
      ];
      var manifest = {
        prefer_related_applications: 123
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('is valid for any boolean', function() {
      var manifest = {
        prefer_related_applications: true,
        preferred_applications: [
          {
            platform: "itunes",
            url: "https://itunes.apple.com/app/example-app1/id123456789"
          }
        ]
      };

      assert.deepEqual(validate(manifest), EMPTY);

      manifest = {
        prefer_related_applications: false
      };

      assert.deepEqual(validate(manifest), EMPTY);
    });

    it('returns an error if no related_application is defined', function() {
      var expected = [
        '"prefer_related_applications" is set to true but "preferred_applications" is empty or undefined.'
      ];
      var manifest = {
        prefer_related_applications: true
      };

      assert.deepEqual(validate(manifest), expected);
    });
  });

  describe('related_applications member', function() {
    it('returns an error on invalid value type', function() {
      var expected = [
        'Invalid "related_applications" value type "number". Expected an array or undefined.'
      ];
      var manifest = {
        related_applications: 123
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('is valid when is an empty array', function() {
      var manifest = {
        related_applications: [ ]
      };

      assert.deepEqual(validate(manifest), EMPTY);
    });

    it('validates application object has valid platform', function() {
      var expected = [
        `Invalid preferred application "platform" value type "number". Expected a string or undefined.`
      ];

      var manifest = {
        related_applications: [
          {
            platform: 123
          }
        ]
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('validates application object has valid url', function() {
      var expected = [
        `Invalid preferred application "url" value type "number". Expected a string or undefined.`
      ];

      var manifest = {
        related_applications: [
          {
            url: 123
          }
        ]
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('validates application object has valid platform', function() {
      var expected = [
        `Invalid preferred application "id" value type "number". Expected a string or undefined.`
      ];

      var manifest = {
        related_applications: [
          {
            id: 123
          }
        ]
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('validates application object has unknown properties', function() {
      var expected = [
        `Unknown preferred application attribute "foo".`
      ];

      var manifest = {
        related_applications: [
          {
            foo: 123
          }
        ]
      };

      assert.deepEqual(validate(manifest), expected);
    });

    it('validates application object', function() {
      var manifest = {
        related_applications: [
          {
            platform: "play",
            url: "https://play.google.com/store/apps/details?id=com.example.app1",
            id: "com.example.app1"
          }, {
            platform: "itunes",
            url: "https://itunes.apple.com/app/example-app1/id123456789"
          }
        ]
      };

      assert.deepEqual(validate(manifest), EMPTY);
    });
  });
});

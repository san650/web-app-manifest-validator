'use strict';

module.exports = validate;

var isArray = require('is-array');

var ENUM_DIR = [
  'rtl',
  'ltr',
  'auto'
];

var ENUM_DISPLAY = [
  'fullscreen',
  'standalone',
  'minimal-ui',
  'browser'
];

var ENUM_ORIENTATION = [
  'any',
  'natural',
  'landscape',
  'landscape-primary',
  'landscape-secondary',
  'portrait',
  'portrait-primary',
  'portrait-secondary'
];

// See "Manifest and its members" in https://w3c.github.io/manifest/

function validate(manifest) {
  var errors = [];

  errors = validateEnum(manifest, 'dir', ENUM_DIR, errors);
  errors = validateLang(manifest, errors);

  ['name', 'short_name', 'description', 'scope', 'color'].forEach(function(member) {
    errors = validateString(manifest, member, errors);
  });

  errors = validateStartUrl(manifest, errors);
  errors = validateIcons(manifest, errors);
  errors = validateEnum(manifest, 'display', ENUM_DISPLAY, errors);
  errors = validateEnum(manifest, 'orientation', ENUM_ORIENTATION, errors);

  return errors;
}

function validateEnum(manifest, memberName, values, errors) {
  var value = manifest[memberName];

  if (!isNullOrUndefined(value)) {
    if (!includes(values, value)) {
      return add(errors, `Invalid "${memberName}" value "${value}". Expected one of ${enumValues(values)}.`);
    }
  }

  return errors;
}

function validateLang(manifest, errors) {
  if (!isNullOrUndefined(manifest.lang) && !/^\w*(-\w*)*$/.test(manifest.lang)) {
    return add(errors, 'Invalid "lang" value "' + manifest.lang + '".');
  }

  return errors;
}

function validateString(manifest, member, errors) {
  if (manifest[member] && typeof(manifest[member]) !== 'string') {
    return add(errors, 'Invalid "' + member + '" value type "' + typeof(manifest[member]) + '". Expected a string or undefined.');
  }

  return errors;
}

function validateStartUrl(manifest, errors) {
  var newErrors = validateString(manifest, 'start_url', []);
  var startUrl = manifest.start_url;
  var scope = manifest.scope;

  if (!newErrors.length && typeof(scope) === 'string' && typeof(startUrl) === 'string' && !startUrl.startsWith(scope)) {
    newErrors = add(newErrors, 'Invalid "start_url" value. "start_url" is not within scope of scope URL.');
  }

  return errors.concat(newErrors);
}

function validateIcons(manifest, errors) {
  var newErrors = [];
  var skip = false;

  if (manifest.icons) {
    if (!isArray(manifest.icons)) {
      errors = add(errors, 'Invalid "icons" value type "' + typeof(manifest.icons) + '". Expected an array or undefined.');
    } else {
      manifest.icons.forEach(function(icon) {
        if (!skip && (!icon.src || typeof icon.src !== 'string')) {
          skip = true;
          newErrors = add(newErrors, 'Invalid "icons" value. Icons need to have a valid "src" attribute.');
        }

        if (!isNullOrUndefined(icon.sizes)) {
          if (typeof(icon.sizes) !== 'string' || !/^\s*\d+x\d+(\s+\d+x\d+)*\s*$/.test(icon.sizes)) {
            newErrors = add(newErrors, `Invalid icon's "sizes" value "${icon.sizes}". The expected format is "123x345".`);
          }
        }

        newErrors = validateString(icon, 'type', newErrors);
      });
    }
  }

  return errors.concat(newErrors);
}

function add(arr, message) {
  return arr.concat([message]);
}

function includes(arr, value) {
  if (typeof(value) === 'string') {
    return arr.indexOf(value.toLowerCase()) > -1;
  }
}

function isNullOrUndefined(value) {
  // Use == to validate against null and undefined
  return value == null;
}

function enumValues(values) {
  var enumValues = values.map(function(value) {
    return `"${value}"`;
  });

  var last = enumValues.pop();

  return `${enumValues.join(', ')} or ${last}`;
}

'use strict';

module.exports = validate;

var isArray = require('is-array');

// See "Manifest and its members" in https://w3c.github.io/manifest/

function validate(manifest) {
  var errors = [];

  errors = validateDir(manifest, []);
  errors = validateLang(manifest, errors);

  ['name', 'short_name', 'description', 'scope'].forEach(function(member) {
    errors = validateString(manifest, member, errors);
  });

  errors = validateStartUrl(manifest, errors);
  errors = validateIcons(manifest, errors);

  return errors;
}

function validateDir(manifest, errors) {
  if (manifest.dir !== undefined) {
    if (typeof(manifest.dir) !== 'string') {
      return add(errors, 'Invalid "dir" value type "' + typeof(manifest.dir) + '". Expected a string or undefined.');
    }

    if (!includes(['ltr', 'rtl', 'auto'], manifest.dir)) {
      return add(errors, 'Invalid "dir" value "' + manifest.dir + '". Expected one of "rtl", "ltr" or "auto".');
    }
  }

  return errors;
}

function validateLang(manifest, errors) {
  if (manifest.lang !== undefined && !/^\w*(-\w*)*$/.test(manifest.lang)) {
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

        if (icon.sizes != null) {
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

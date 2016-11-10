'use strict';

module.exports = validate;

// See "Manifest and its members" in https://w3c.github.io/manifest/

function validate(manifest) {
  var errors = [];

  errors = validateDir(manifest, []);
  errors = validateLang(manifest, errors);

  ['name', 'short_name', 'description', 'scope'].forEach(function(member) {
    errors = validateString(manifest, member, errors);
  });

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

function add(arr, message) {
  return arr.concat([message]);
}

function includes(arr, value) {
  if (typeof(value) === 'string') {
    return arr.indexOf(value.toLowerCase()) > -1;
  }
}

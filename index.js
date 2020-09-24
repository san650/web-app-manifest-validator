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

var MEMBERS = [
  'background_color',
  'color',
  'description',
  'dir',
  'display',
  'icons',
  'lang',
  'name',
  'orientation',
  'prefer_related_applications',
  'related_applications',
  'scope',
  'screenshots',
  'short_name',
  'start_url',
  'theme_color'
];

// See "Manifest and its members" in https://w3c.github.io/manifest/

function validate(manifest) {
  var errors = [];

  errors = validateEnum(manifest, 'dir', ENUM_DIR, errors);
  errors = validateLang(manifest, errors);

  [
    'name',
    'short_name',
    'description',
    'scope',
    'color',
    'background_color',
    'theme_color'
  ].forEach(function(member) {
    errors = validateString(manifest, member, errors);
  });

  errors = validateStartUrl(manifest, errors);
  errors = validateImages(manifest, 'icons', 'icon', errors);
  errors = validateImages(manifest, 'screenshots', 'screenshot', errors);
  errors = validateEnum(manifest, 'display', ENUM_DISPLAY, errors);
  errors = validateEnum(manifest, 'orientation', ENUM_ORIENTATION, errors);
  errors = validatePreferRelatedApplications(manifest, errors);
  errors = validatePreferredApplications(manifest, errors);

  errors = validateKnownProperties('manifest', manifest, MEMBERS, errors);

  return errors;
}

function validatePreferredApplications(manifest, errors) {
  var applications = manifest['related_applications'];

  if (!isNullOrUndefined(applications)) {
    if (!isArray(applications)) {
      errors = add(errors, 'Invalid "related_applications" value type "' + typeof(applications) + '". Expected an array or undefined.');
    } else {
      applications.forEach(function(application) {
        errors = validateString(application, 'url', errors, {
          memberPrefix: 'preferred application'
        });
        errors = validateString(application, 'platform', errors, {
          memberPrefix: 'preferred application'
        });
        errors = validateString(application, 'id', errors, {
          memberPrefix: 'preferred application'
        });

        errors = validateKnownProperties('preferred application', application, ['url', 'platform', 'id'], errors);
      });
    }
  }

  return errors;
}

function validateKnownProperties(objectName, object, validProperties, errors) {
  Object.keys(object).forEach(function(property) {
    if (!includes(validProperties, property)) {
      errors = add(errors, 'Unknown ' + objectName + ' attribute "' + property + '".');
    }
  });

  return errors;
}

function validatePreferRelatedApplications(manifest, errors) {
  var member = 'prefer_related_applications';

  errors = validateBoolean(manifest, member, errors);

  if (manifest[member] === true && !(isArray(manifest['related_applications']) && manifest['related_applications'].length)) {
    errors = add(errors, '"prefer_related_applications" is set to true but "related_applications" is empty or undefined.');
  }

  return errors;
}

function validateBoolean(manifest, memberName, errors) {
  var value = manifest[memberName];

  if (!isNullOrUndefined(value) && typeof(value) !== 'boolean') {
    return add(errors, 'Invalid "' + memberName + '" value type "' + typeof(value) + '". Expected a boolean or undefined.');
  }

  return errors;
}

function validateEnum(manifest, memberName, values, errors) {
  var value = manifest[memberName];

  if (!isNullOrUndefined(value)) {
    if (!includes(values, value)) {
      return add(errors, 'Invalid "' + memberName + '" value "' + value + '". Expected one of ' + enumValues(values) + '.');
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

function validateString(manifest, member, errors, options) {
  options = options || {};

  var prefix = options.memberPrefix ? ' ' + options.memberPrefix + ' ' : ' ';

  if (manifest[member] && typeof(manifest[member]) !== 'string') {
    return add(errors, 'Invalid' + prefix + '"' + member + '" value type "' + typeof(manifest[member]) + '". Expected a string or undefined.');
  }

  return errors;
}

function validateStartUrl(manifest, errors) {
  var newErrors = validateString(manifest, 'start_url', []);
  var startUrl = manifest.start_url;
  var scope = manifest.scope;

  if (!newErrors.length && typeof(scope) === 'string' && typeof(startUrl) === 'string' && startUrl.indexOf(scope) !== 0) {
    newErrors = add(newErrors, 'Invalid "start_url" value. "start_url" is not within scope of scope URL.');
  }

  return errors.concat(newErrors);
}

function validateImages(manifest, memberName, itemName, errors) {
  var newErrors = [];
  var skip = false;
  var items = manifest[memberName];

  if (items) {
    if (!isArray(items)) {
      errors = add(errors, 'Invalid "' + memberName + '" value type "' + typeof(items) + '". Expected an array or undefined.');
    } else {
      items.forEach(function(item) {
        if (!skip && (!item.src || typeof item.src !== 'string')) {
          skip = true;
          newErrors = add(newErrors, 'Invalid "' + memberName + '" value, ' + memberName + ' need to have a valid "src" attribute.');
        }

        if (!isNullOrUndefined(item.sizes)) {
          if (typeof(item.sizes) !== 'string' || !/^\s*\d+x\d+(\s+\d+x\d+)*\s*$/.test(item.sizes)) {
            newErrors = add(newErrors, 'Invalid ' + itemName + '\'s "sizes" value "' + item.sizes + '". The expected format is "123x345".');
          }
        }

        newErrors = validateString(item, 'type', newErrors, { memberPrefix: itemName });

        errors = validateKnownProperties(itemName, item, ['src', 'sizes', 'type', 'purpose'], errors);
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
    return '"' + value + '"';
  });

  var last = enumValues.pop();

  return enumValues.join(', ') + ' or ' + last;
}

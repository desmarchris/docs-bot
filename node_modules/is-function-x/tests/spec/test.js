'use strict';

var isFunction;
if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');
  if (typeof JSON === 'undefined') {
    JSON = {};
  }
  require('json3').runInContext(null, JSON);
  require('es6-shim');
  var es7 = require('es7-shim');
  Object.keys(es7).forEach(function (key) {
    var obj = es7[key];
    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  isFunction = require('../../index.js');
} else {
  isFunction = returnExports;
}

var hasFat;
try {
  // eslint-disable-next-line no-eval
  eval('(x, y) => {return this;};');
  hasFat = true;
} catch (ignore) {}
var itHasFat = hasFat ? it : xit;

var hasGen;
try {
  // eslint-disable-next-line no-eval
  eval('function* idMaker(x, y){};');
  hasGen = true;
} catch (ignore) {}
var itHasGen = hasGen ? it : xit;

var hasAsync;
try {
  // eslint-disable-next-line no-eval
  eval('async function idAsync(x, y){};');
  hasAsync = true;
} catch (ignore) {}
var itHasAsync = hasAsync ? it : xit;

var hasClass;
try {
  // eslint-disable-next-line no-eval
  eval('"use strict"; class My {};');
  hasClass = true;
} catch (ignore) {}
var itHasClass = hasClass ? it : xit;

describe('Basic tests', function () {
  it('should return `false` for everything', function () {
    var values = [
      true,
      'abc',
      1,
      null,
      undefined,
      new Date(),
      [],
      /r/
    ];
    var expected = values.map(function () {
      return false;
    });
    var actual = values.map(isFunction);
    expect(actual).toEqual(expected);
  });

  it('should return `true` for everything', function () {
    var values = [
      Object,
      String,
      Boolean,
      Array,
      Function,
      function () {},
      function test(a) {}, // eslint-disable-line no-unused-vars
      new Function(), // eslint-disable-line no-new-func
      function test1(a, b) {}, // eslint-disable-line no-unused-vars
      function test2(a/* , foo*/) {}, // eslint-disable-line no-unused-vars
      function test3(a/* , foo*/, b) { }, // eslint-disable-line no-unused-vars
      function test4(a/* , foo*/, b) { }, // eslint-disable-line no-unused-vars
      function/* foo*/test5(a/* , foo*/, b) {}, // eslint-disable-line no-unused-vars
      function/* foo*/test6/* bar*/(a/* , foo*/, b) {}, // eslint-disable-line no-unused-vars
      function/* foo*/test7/* bar*/(/* baz*/) {},
      /* fum*/function/* foo*/ // blah
      test8(/* baz*/a // eslint-disable-line no-unused-vars
      ) {}
    ];
    var expected = values.map(function () {
      return true;
    });
    var actual = values.map(isFunction);
    expect(actual).toEqual(expected);
  });

  itHasFat('should return `true` for arrow functions', function () {
    // eslint-disable-next-line no-new-func
    var fat = new Function('return (x, y) => {return this;};')();
    expect(isFunction(fat)).toBe(true);
  });

  itHasGen('should return `true` for generator functions', function () {
    // eslint-disable-next-line no-new-func
    var gen = new Function('return function* idMaker(x, y){};')();
    expect(isFunction(gen)).toBe(true);
  });

  itHasAsync('should return `true` for async functions', function () {
    // eslint-disable-next-line no-new-func
    var asy = new Function('return async function idAsync(x, y){};')();
    expect(isFunction(asy)).toBe(true);
  });

  itHasClass('should return `false` for classes', function () {
    // eslint-disable-next-line no-new-func
    var classes = new Function('"use strict"; return class My {};')();
    expect(isFunction(classes)).toBe(false);
  });
});

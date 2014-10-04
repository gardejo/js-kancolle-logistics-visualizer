/**
 * @fileOverview Polyfill Library for Windows Scripting Host.
 * @version 0.2.0
 * @author Mozilla Contributors
 * @license Any copyright is dedicated to
 *     <a href="http://creativecommons.org/publicdomain/zero/1.0/">
 *     the Public Domain
 *     </a>.
 * @supported We demonstrate the library in environments below:
 *     <ul>
 *         <li>Windows XP Professional (32bit, Japanese edition) + SP3</li>
 *         <li>Windows Vista Home Premium (32bit, Japanese edition) + SP1</li>
 *         <li>Windows 7 Ultimate (64bit, Japanese edition) + SP1</li>
 *         <li>Windows 8.1 Professional (32bit, Japanese edition)</li>
 *         <li>Windows 8.1 Professional (64bit, Japanese edition)</li>
 *     </ul>
 * @see https://developer.mozilla.org/docs/MDN/About#Copyrights_and_licenses
 */

'use strict';

// ================================================================
// Object
// ================================================================

// ----------------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
// Global_Objects/Object/create#Polyfill
// ----------------------------------------------------------------

if (!Object.create) {
  Object.create = function (o) {
    if (arguments.length > 1) {
      throw new Error(
        'Object.create implementation only accepts the first parameter.'
      );
    }
    function F() {}
    F.prototype = o;
    return new F();
  };
}

// ----------------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
// Global_Objects/Object/keys#Polyfill
// ----------------------------------------------------------------

if (!Object.keys) {
  Object.keys = (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (
        typeof obj !== 'object' && typeof obj !== 'function' || obj === null
      ) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [];

      for (var prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (var i=0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  })();
}


// ================================================================
// Function
// ================================================================

// ----------------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
// Global_Objects/Function/bind#Compatibility
// ----------------------------------------------------------------

if (!Function.prototype.bind) {
  Function.prototype.bind = function (thisObject) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError(
        "Function.prototype.bind - what is trying to be bound is not callable"
      );
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        toBind = this, 
        NOP = function () {},
        Bound = function () {
          return toBind.apply(
            this instanceof NOP && thisObject ? this : thisObject,
            aArgs.concat(Array.prototype.slice.call(arguments))
          );
        };

    NOP.prototype = this.prototype;
    Bound.prototype = new NOP();

    return Bound;
  };
}


// ================================================================
// Array
// ================================================================

// ----------------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
// Global_Objects/Array/fill#Compatibility
// ----------------------------------------------------------------

if (![].fill) {
  Array.prototype.fill = function(value) {

    var radix = 10;

    // Steps 1-2.
    var O = Object(this);

    // Steps 3-5.
    var len = parseInt(O.length, radix);

    // Steps 6-7.
    var start = arguments[1];
    var relativeStart = parseInt(start, radix) || 0;

    // Step 8.
    var k = relativeStart < 0 ?
            Math.max(len + relativeStart, 0) :
            Math.min(relativeStart, len);

    // Steps 9-10.
    var end = arguments[2];
    var relativeEnd = end === undefined ?
                      len :
                      (parseInt(end, radix) || 0);

    // Step 11.
    var final = relativeEnd < 0 ?
                Math.max(len + relativeEnd, 0) :
                Math.min(relativeEnd, len);

    // Step 12.
    for (; k < final; k++) {
        O[k] = value;
    }

    // Step 13.
    return O;
  };
}

// ----------------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
// Global_Objects/Array/filter#Compatibility
// ----------------------------------------------------------------

if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisArg */)
  {

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}

// ----------------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
// Global_Objects/Array/forEach#Polyfill
// ----------------------------------------------------------------

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if ( !Array.prototype.forEach ) {
 Array.prototype.forEach = function( callback, thisArg ) {

   var T, k;

   if ( this === null ) {
     throw new TypeError( " this is null or not defined" );
   }

   // 1. Let O be the result of calling ToObject passing the |this| value as
   //   the argument.
   var O = Object(this);

   // 2. Let lenValue be the result of calling the Get internal method of O
   //   with the argument "length".
   // 3. Let len be ToUint32(lenValue).
   var len = O.length >>> 0; // Hack to convert O.length to a UInt32

   // 4. If IsCallable(callback) is false, throw a TypeError exception.
   // See: http://es5.github.com/#x9.11
   if ( {}.toString.call(callback) != "[object Function]" ) {
     throw new TypeError( callback + " is not a function" );
   }

   // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
   if ( thisArg ) {
     T = thisArg;
   }

   // 6. Let k be 0
   k = 0;

   // 7. Repeat, while k < len
   while( k < len ) {

     var kValue;

     // a. Let Pk be ToString(k).
     //   This is implicit for LHS operands of the in operator
     // b. Let kPresent be the result of calling the HasProperty internal
     //   method of O with argument Pk.
     //   This step can be combined with c
     // c. If kPresent is true, then

     if ( k in O ) {

       // i. Let kValue be the result of calling the Get internal method of O
       //   with argument Pk.
       kValue = O[ k ];

       // ii. Call the Call internal method of callback with T as the this
       //   value and argument list containing kValue, k, and O.
       callback.call( T, kValue, k, O );
     }
     // d. Increase k by 1.
     k++;
   }
   // 8. return undefined
 };
}

// ----------------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
// Global_Objects/Array/indexOf#Polyfill
// ----------------------------------------------------------------

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {

    if (this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    if (len === 0) {
      return -1;
    }

    var n = 0;

    if (arguments.length > 0) {
      n = Number(arguments[1]);

      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
         n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }

    if (n >= len) {
      return -1;
    }

    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);

    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}

// ----------------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
// Global_Objects/Array/isArray#Compatibility
// ----------------------------------------------------------------

if(!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

// ----------------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
// Global_Objects/Array/map#Polyfill
// ----------------------------------------------------------------

if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisArg */)
  {

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") {
      throw new TypeError();
    }

    var res = new Array(len);
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      // NOTE: Absolute correctness would demand Object.defineProperty
      //       be used.  But this method is fairly new, and failure is
      //       possible only if Object.prototype or Array.prototype
      //       has a property |i| (very unlikely), so use a less-correct
      //       but more portable alternative.
      if (i in t) {
        res[i] = fun.call(thisArg, t[i], i, t);
      }
    }

    return res;
  };
}

// ----------------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
// Global_Objects/Array/reduce#Polyfill
// ----------------------------------------------------------------

if (!Array.prototype.reduce) {
  Array.prototype.reduce = function reduce(accumulator){
    if (this===null || this===undefined) {
      throw new TypeError("Object is null or undefined");
    }

    var i = 0, l = this.length >> 0, curr;

    if(typeof accumulator !== "function") {
      // ES5 : "If IsCallable(callbackfn) is false,
      // throw a TypeError exception."
      throw new TypeError("First argument is not callable");
    }

    if(arguments.length < 2) {
      if (l === 0) {
        throw new TypeError("Array length is 0 and no second argument");
      }
      curr = this[0];
      i = 1; // start accumulating at the second element
    }
    else {
      curr = arguments[1];
    }

    while (i < l) {
      if(i in this) {
        curr = accumulator.call(undefined, curr, this[i], i, this);
      }
      ++i;
    }

    return curr;
  };
}

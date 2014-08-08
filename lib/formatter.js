/**
 * @fileOverview A partical object for a string formatter.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

// ================================================================
// String Formatter
// ================================================================

/**
 * A string formatter.
 * @public
 * @const
 * @constructor
 */
kclv.Formatter = function() {
    return;
};

/**
 * Convert the specified value into JSON by delegeted {@code JSON#stringify}.
 * @public
 * @param {Object} value The value to convert to a JSON string.
 * @param {(Function|Array)=} opt_replacer See {@code JSON#stringify}.
 * @param {(string)=} opt_space Causes the resulting string to be
 *     pretty-printed.
 * @nosideeffects
 * @see JSON#stringify
 */
kclv.Formatter.prototype.stringify = function(value, opt_replacer, opt_space) {
    return JSON.stringify(value, opt_replacer, opt_space);
};

/**
 * Quote the specified target (a string or array of string) and get it.
 * @public
 * @param {!(string|Array.<string>)} target A raw string or array of a raw
 *     string.
 * @param {Array.<number>=} opt_indices Indices of target elements of array.
 *     If {@code target} parameter is not {@code Array}, it will be ignored.
 *     If it is undefined, a concrete function operates all elements of array.
 * @returns {(string|Array.<string>)} A quoted string or array of a quoted
 *     string.
 * @nosideeffects
 * @see #format_
 * @see #unquote
 */
kclv.Formatter.prototype.quote = function(target, opt_indices) {
    return this.format_(
        function(string) { return '"' + string + '"'; },
        target,
        opt_indices
    );
};

/**
 * Unquote the specified target (a string or array of a string) and get it.
 * @public
 * @param {!(string|Array.<string>)} target A quoted string or array of a
 *     quoted string.
 * @param {Array.<number>=} opt_indices Indices of target elements of array.
 *     If {@code target} parameter is not {@code Array}, it will be ignored.
 *     If it is undefined, a concrete function operates all elements of array.
 * @returns {(string|Array.<string>)} A raw (unquoted) string or array of a raw
 *     (unquoted) string.
 * @nosideeffects
 * @see #format_
 * @see #quote
 */
kclv.Formatter.prototype.unquote = function(target, opt_indices) {
    return this.format_(
        function(string) { return string.replace(/"/g, ''); },
        target,
        opt_indices
    );
};

/**
 * Parenthesize the specified target (a string or array of a string) and get
 *     it.
 * @public
 * @param {!(string|Array.<string>)} target A raw string or array of a raw
 *     string.
 * @param {Array.<number>=} opt_indices Indices of target elements of array.
 *     If {@code target} parameter is not {@code Array}, it will be ignored.
 *     If it is undefined, a concrete function operates all elements of array.
 * @returns {(string|Array.<string>)} A parenthesized string or array of a
 *     parenthesized string.
 * @nosideeffects
 * @see #format_
 */
kclv.Formatter.prototype.parenthesize = function(target, opt_indices) {
    return this.format_(
        function(string) { return '(' + string + ')'; },
        target,
        opt_indices
    );
};

/**
 * Integerize the specified target (a string or array of a string) and get it.
 * @public
 * @param {!(string|Array.<string>)} target An integer-like string or array of
 *     an integer-like string.
 * @param {Array.<number>=} opt_indices Indices of target elements of array.
 *     If {@code target} parameter is not {@code Array}, it will be ignored.
 *     If it is undefined, a concrete function operates all elements of array.
 * @returns {(number|Array.<number>)} An integer or array of a integer.
 * @nosideeffects
 * @see #format_
 */
kclv.Formatter.prototype.integerize = function(target, opt_indices) {
    return this.format_(
        // Radix is 10 (default).
        function(string) { return parseInt(string, 10); },
        target,
        opt_indices
    );
};

/**
 * Commify the specified target (a string or array of a string) and get it.
 *     Note: A delimiter is only comma.
 *     Note: Positions of delimiters are every three characters.
 * @public
 * @param {!(number|Array.<number>)} target A number or array of a number.
 * @param {Array.<number>=} opt_indices Indices of target elements of array.
 *     If {@code target} parameter is not {@code Array}, it will be ignored.
 *     If it is undefined, a concrete function operates all elements of array.
 * @returns {(string|Array.<string>)} A commified number-like string or array
 *     of a commified number-like string.
 * @nosideeffects
 * @see #format_
 * @see Tom Christiansen, Nathan Torkington, "Perl Coolbook 2nd Ed. Vol.1",
 *     Ch.2 (Recipe 2.16).
 */
kclv.Formatter.prototype.commify = function(target, opt_indices) {
    return this.format_(
        function(number) {
            return number.toString().                       // '2411'
                split('').reverse().join('').               // '1142'
                replace(/(\d{3})(?=\d)(?!\d*\.)/g, '$1,').  // '114,2'
                split('').reverse().join('');               // '2,411'
        },
        target,
        opt_indices
    );
};

/**
 * (Template) Format the specified target (a string or array of a string) and
 *     get it.
 * @private
 * @param {Function} formatter Concrete formatter method to call.
 * @param {(string|Array.<string>)} target A string or array of a string.
 * @param {Array.<number>=} opt_indices Indices of target elements of array.
 *     If {@code target} parameter is not {@code Array}, it will be ignored.
 *     If it is undefined, a concrete function operates all elements of array.
 * @nosideeffects
 */
kclv.Formatter.prototype.format_ = function(formatter, target, opt_indices) {
    if (! Array.isArray(target) ) {
        return target === null ? target : formatter.call(this, target);
    }

    if (! opt_indices) {
        // Format all elements.
        return target.map( function(element) {
            return element === null ? element : formatter.call(this, element);
        }, this );
    }

    // Format specified (by indices) elements.
    return target.map( function(element, index) {
        return opt_indices.indexOf(index) < 0 || // Processing element or not?
               element === null ?
            element : formatter.call(this, element);
    }, this );
};

/**
 * Convert an object (such as {@code Error}) into a human-readable string for
 *     a dialogue window (or a console). For example, an object was stringified
 *     as JSON. For a GUI performance and a convenience, it may snips a too
 *     long string.
 * @public
 * @param {!(Error|Object)} exception Throwed object, usually an instance of
 *     {@code Error}.
 * @returns {string} A string representing a throwed object.
 * @nosideeffects
 */
kclv.Formatter.prototype.dialogue = function(exception) {
    var message = 'Something wrong.',
        json,
        length,
        maximumLength = 1000; // TODO

    if ( exception instanceof Error ) {
        return exception.name + ': ' + exception.message;
    }

    if (! exception) {
        return message;
    }

    message += ' Object notation is:\n\n';
    json = this.stringify(exception, null, '    '); // TODO
    if (! json) {
        return message + 'undefined';
    }

    length = json.length;
    if (length <= maximumLength) {
        return message + json;
    }

    return message + json.substr(0, maximumLength) + ' ...\n\n' +
           '(Snipped ' + (length - maximumLength) +  ' characters.)';
};

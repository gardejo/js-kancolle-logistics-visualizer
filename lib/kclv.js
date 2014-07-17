/**
 * @fileOverview A funny object library for KanColle Logistics Visualizer.
 *     This module added {@code kclv} symbol to the global namespace.
 *     Caveat: This file is encoded as UTF-8N (with BOM).
 *     TODO: Compile it.
 *     TODO: Platform independent (not JScript but JavaScript).
 * @version 0.0.0
 * @author kclv@ermitejo.com (MORIYA Masaki, alias "Gardejo")
 * @license The MIT license (See LICENSE file)
 * @supported We demonstrate the library in environments below:
 *     <ul>
 *         <li>Windows XP Professional (32bit, Japanese edition) + SP3</li>
 *         <li>Windows Vista Home Premium (32bit, Japanese edition) + SP1</li>
 *         <li>Windows 7 Ultimate (64bit, Japanese edition) + SP1</li>
 *         <li>Windows 8.1 Professional (32bit, Japanese edition)</li>
 *         <li>Windows 8.1 Professional (64bit, Japanese edition)</li>
 *     </ul>
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 *     Note: Only polyfills (./kclv.polyfill.js) touch built-in objects.
 * @see http://jslint.com/
 * @see http://jshint.com/
 * @see kclv.Inscription
 * @see ../test/kclv.test.js
 * @see http://developers.slashdot.org/comments.pl?sid=33602&cid=3636102
 * @see https://github.com/EnterpriseQualityCoding/FizzBuzzEnterpriseEdition
 */


// ================================================================
// JSLint/JSHint Directives
// ================================================================

/*jslint
    nomen    : true,
    plusplus : true,
    regexp   : true,
    todo     : true,
    vars     : true,
    white    : true
*/

/*global
    ActiveXObject : false,
    JSON          : false,
    jsviews       : false
*/


// ================================================================
// Script mode syntax (Whole-library)
// ================================================================

/* jshint ignore:start */
'use strict';
/* jshint ignore:end */


// ================================================================
// Global Namespace
// ================================================================

/**
 * A top-level namespace for KanColle Logistics Visualizer.
 * @public
 */
var kclv; // Or, "org.gardejo.kancolle.logistics.visualizer" ?
if (!kclv) {
    kclv = {};
}


// ================================================================
// Inscription
// ================================================================

/**
 * An inscription of the library. It's assumed to be the {@code generator}
 *     attribute of the meta element in a chart client HTML file.
 * @public
 * @constructor
 * @struct
 */
kclv.Inscription = function() {
    /**
     * A formal name of the library.
     * @public {string}
     * @const
     */
    this.name = 'KanColle Logistics Visualizer';

    /**
     * Version number of the library.
     * @public {string}
     * @const
     * @see http://semver.org/
     */
    this.version = '0.0.0';

    /**
     * A development stage of the library.
     *     Note: The library defines stages of development below:
     *     <dl>
     *         <dt>Alpha</dt>
     *             <dd>First phase to begin testing. APIs may changed.</dd>
     *         <dt>Beta, a.k.a. Trial, (Technical) Preview or Early Access</dt>
     *             <dd>Released for trial use.</dd>
     *         <dt>RC: Release candidate</dt>
     *             <dd>Released by a candidate to GA.</dd>
     *         <dt>GA: General availability, a.k.a. Stable</dt>
     *             <dd>Released on the assumption that public use.</dd>
     *     </dl>
     * @public {string}
     * @const
     */
    this.stage = 'Alpha';

    return;
};


// ================================================================
// Generic Factory
// ================================================================

/**
 * A generic object factory.
 *     TODO: Correspond to a compiler.
 * @public
 * @constructor
 */
kclv.Factory = ( function() {
    return {
        /**
         * Get an object from the specified name and arguments.
         *     Caveat: It is a bad know-how of metaprogramming.
         * @public
         * @param {!Object} namespace A namespace for a clue to search object.
         * @param {!(string|Array.<string>)} name Part of object name.
         * @param {Array=} opt_argments Arguments array for constructor.
         * @returns {Object} An instantiated object.
         */
        getInstance : function(namespace, name, opt_arguments) {
            var nodes = name ?
                    ( Array.isArray(name) ? name : name.split('.') ) : [],
                constructor = nodes.reduce( function(object, node) {
                    return object[node];
                }, namespace );

            if (! constructor) {
                throw new TypeError('Not found: ' + nodes.join('.'));
            }

            // Oh my compass! What's an ugly black magi of metaprogramming!
            return new ( Function.prototype.bind.apply(
                constructor,
                Array.prototype.concat.apply(
                    [constructor],
                    Array.isArray(opt_arguments) ? [opt_arguments] : []
                )
            ) )();
        }
    };
}() );


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
        return formatter.call(this, target);
    }

    if (! opt_indices) {
        // Format all elements.
        return target.map( function(element) {
            return formatter.call(this, element);
        }, this );
    }

    // Format specified (by indices) elements.
    return target.map( function(element, index) {
        if (! opt_indices.length || opt_indices[0] !== index) {
            return element; // Raw copy
        }
        opt_indices.shift();
        return formatter.call(this, element);
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


// ================================================================
// Exceptions
// ================================================================

// ----------------------------------------------------------------
// Namespace for Exceptions
// ----------------------------------------------------------------

/**
 * A namespace for exceptions.
 *     TODO: Substitute more built-in exceptions into proper exceptions.
 * @public
 */
kclv.Exception = {};

// ----------------------------------------------------------------
// Exception for Abstract Methods
// ----------------------------------------------------------------

/**
 * An exception for abstract methods.
 *     Note: {@code Error} doesn't manipulate {@code this}. So we don't write
 *     {@code Error.call(this, 'message')}.
 * @public
 * @constructor
 * @extends {Error}
 */
kclv.Exception.AbstractMethod = function() {
    /**
     * Human-readable description of the error.
     * @public {string}
     * @override
     * @const
     */
    this.message =
        'The method must be overridden or implemented by a subtype.';

    /**
     * The name of the function instead of the anonymous function.
     * @public {string}
     * @override
     * @const
     */
    this.name = 'kclv.Exception.AbstractMethod';

    return;
};
kclv.Exception.AbstractMethod.prototype = Object.create(Error.prototype);
kclv.Exception.AbstractMethod.prototype.constructor = Error;

// ----------------------------------------------------------------
// Base Exception for Invalid Kinds
// ----------------------------------------------------------------

/**
 * A base exception for invalid kinds.
 *     Note: {@code Error} doesn't manipulate {@code this}. So we don't write
 *     {@code Error.call(this, 'message')}.
 * @public
 * @constructor
 * @extends {Error}
 */
kclv.Exception.InvalidKind = function(validKinds, kind) {
    /**
     * Valid kinds.
     * @private {Array.<string>}
     * @const
     */
    this.validKinds_ = validKinds;

    /**
     * Human-readable description of the error.
     * @public {string}
     * @override
     * @const
     */
    this.message = this.buildMessage_(kind);

    /**
     * The name of the function instead of the anonymous function.
     * @public {string}
     * @override
     * @const
     */
    this.name = 'kclv.Exception.InvalidKind';

    return;
};
kclv.Exception.InvalidKind.prototype = Object.create(Error.prototype);
kclv.Exception.InvalidKind.prototype.constructor = Error;

/**
 * Build a error message according to specified kind and valid kinds.
 * @private
 * @param {string} invalidKind An invalid kind.
 * @returns {string} A error message.
 * @nosideeffects
 */
kclv.Exception.InvalidKind.prototype.buildMessage_ = function(invalidKind) {
    var formatter = new kclv.Formatter(),
        validKinds = formatter.quote(this.validKinds_),
        lastValidKind = validKinds.shift();

    return 'The specified kind ' + formatter.quote(invalidKind) + ' is not ' +
           validKinds.join(', ') + ' nor ' + lastValidKind + '.';
};

// ----------------------------------------------------------------
// Exception for an Invalid Material Kind
// ----------------------------------------------------------------

/**
 * An exception for an invalid kind of material.
 * @public
 * @constructor
 * @extends {kclv.Exception.InvalidKind}
 * @param {!string} kind A string representing an invalid kind of material.
 */
kclv.Exception.InvalidMaterial = function(kind) {
    kclv.Exception.InvalidKind.call(
        this, ['Resources', 'Consumables'], kind
    );

    /**
     * The name of the function instead of the anonymous function.
     * @public {string}
     * @override
     * @const
     */
    this.name = 'kclv.Exception.InvalidMaterial';

    return;
};
kclv.Exception.InvalidMaterial.prototype =
    Object.create(kclv.Exception.InvalidKind.prototype);
kclv.Exception.InvalidMaterial.prototype.constructor =
    kclv.Exception.InvalidKind;

// ----------------------------------------------------------------
// Exception for an Invalid Skill
// ----------------------------------------------------------------

/**
 * An exception for an invalid indicator of ship's skill.
 * @public
 * @constructor
 * @extends {kclv.Exception.InvalidKind}
 * @param {!string} kind A string representing an invalid indicator of ship's
 *     skill.
 */
kclv.Exception.InvalidSkill = function(kind) {
    kclv.Exception.InvalidKind.call(
        this, ['Levels', 'Experiences'], kind
    );

    /**
     * The name of the function instead of the anonymous function.
     * @public {string}
     * @override
     * @const
     */
    this.name = 'kclv.Exception.InvalidSkill';

    return;
};
kclv.Exception.InvalidSkill.prototype =
    Object.create(kclv.Exception.InvalidKind.prototype);
kclv.Exception.InvalidSkill.prototype.constructor = kclv.Exception.InvalidKind;

// ----------------------------------------------------------------
// Exception for Invalid Frequency
// ----------------------------------------------------------------

/**
 * An exception for invalid frequency.
 * @public
 * @constructor
 * @extends {kclv.Exception.InvalidKind}
 * @param {!string} kind A string representing invalid frequency.
 */
kclv.Exception.InvalidFrequency = function(kind) {
    kclv.Exception.InvalidKind.call(
        this, ['Yearly', 'Monthly', 'Weekly', 'Daily'], kind
    );

    /**
     * The name of the function instead of the anonymous function.
     * @public {string}
     * @override
     * @const
     */
    this.name = 'kclv.Exception.InvalidFrequency';

    return;
};
kclv.Exception.InvalidFrequency.prototype =
    Object.create(kclv.Exception.InvalidKind.prototype);
kclv.Exception.InvalidFrequency.prototype.constructor =
    kclv.Exception.InvalidKind;

// ----------------------------------------------------------------
// Exception for an Invalid Strategy
// ----------------------------------------------------------------

/**
 * An exception for an invalid strategy.
 *     Note: {@code Error} doesn't manipulate {@code this}. So we don't write
 *     {@code TypeError.call(this, 'message')}.
 * @public
 * @constructor
 * @extends {TypeError}
 * @param {!string} message Human-readable description of the error.
 */
kclv.Exception.InvalidStrategy = function(message) {
    /**
     * The name of the function instead of the anonymous function.
     * @public {string}
     * @override
     * @const
     */
    this.name = 'kclv.Exception.InvalidStrategy';

    /**
     * Human-readable description of the error.
     * @public {string}
     * @override
     * @const
     */
    this.message = message;

    return;
};
kclv.Exception.InvalidStrategy.prototype = Object.create(TypeError.prototype);
kclv.Exception.InvalidStrategy.prototype.constructor = TypeError;

// ----------------------------------------------------------------
// Exception for Files
// ----------------------------------------------------------------

/**
 * An exception for files.
 *     Note: {@code Error} doesn't manipulate {@code this}. So we don't write
 *     {@code Error.call(this, 'message')}.
 * @public
 * @constructor
 * @extends {Error}
 * @param {!string} path A string of the opening file.
 */
kclv.Exception.File = function(path) {
    /**
     * The name of the function instead of the anonymous function.
     * @public {string}
     * @override
     * @const
     */
    this.name = 'kclv.Exception.File';

    /**
     * Human-readable description of the error.
     * @public {string}
     * @override
     * @const
     */
    this.message =
        'File (' +
        new ActiveXObject('Scripting.FileSystemObject').
            GetAbsolutePathName(path) +
        ') could not opened.';

    return;
};
kclv.Exception.File.prototype = Object.create(Error.prototype);
kclv.Exception.File.prototype.constructor = Error;


// ================================================================
// Array Helper
// ================================================================

/**
 * Array helper.
 *     Caveat: Don't extend a built-in object, such as {@code Array}.
 *     An extention is allowed only in polyfill.
 * @public
 * @const
 * @constructor
 * @see ./kclv.polyfill.js
 */
kclv.Array = ( function() {
    return {
        /**
         * Get a subset of specified array by specified indices.
         *     It is similar to a slice access to array in Perl
         *     (ex. {@code @extracted = @array[@indices]}).
         * @public
         * @param {!Array} array Array to be sliced.
         * @param {!Array.<number>} indices Indices to slice array.
         * @throws {RangeError} If invalid array index was specified.
         * @nosideeffects
         * @example
         *     kclv.Array.values([1,2,3,4], [1,3]); // becomes [2,4]
         *     kclv.Array.values([5,6,7,8], [2,0]); // becomes [7,5]
         */
        values : function(array, indices) {
            return indices.map( function(index) {
                if (this.length <= index) {
                    throw new RangeError('Invalid array length: ' + index);
                }
                return this[index];
            }, array );
        },

        /**
         * Get the maximum value in specified elements (by indices) of the
         *     specified two-dimensional array.
         * @public
         * @param {Array.<Array>} array An array which targeted an examination.
         * @param {!(Array.<number>|string)} indices Targeted indices or string
         *     representing it.
         * @returns {number} The maximum value.
         * @nosideeffects
         * @see #minimum
         */
        maximum : function(array, indices) {
            return array.reduce( function(maximum, row) {
                var columns = kclv.Array.values(row, indices);
                columns.push(maximum);

                /*
                // TODO: Return maximum (previous value) if 'NaN'.
                var candidate = Math.max.apply(null, columns);
                return typeof candidate === 'number' ? candidate : maximum;
                */

                return Math.max.apply(null, columns);
            }, -Infinity );
        },

        /**
         * Get the minimum value in specified elements (by indices) of the
         *     specified two-dimensional array.
         * @public
         * @param {Array.<Array>} array An array which targeted an examination.
         * @param {!(Array.<number>|string)} indices Targeted indices or string
         *     representing it.
         * @returns {number} The minimum value.
         * @nosideeffects
         * @see #maximum
         */
        minimum : function(array, indices) {
            return array.reduce( function(minimum, row) {
                var columns = kclv.Array.values(row, indices);
                columns.push(minimum);

                /*
                // TODO: Return minimum (previous value) if 'NaN'.
                var candidate = Math.min.apply(null, columns);
                return typeof candidate === 'number' ? candidate : minimum;
                */

                return Math.min.apply(null, columns);
            }, +Infinity );
        }
    };
}() );


// ================================================================
// Pseudo-Interface
// ================================================================

/**
 * Pseudo-Interface.
 * @public
 * @interface
 * @param {Array.<string>} methodNames An array of mandatory method names.
 */
kclv.PseudoInterface = function(methodNames) {
    /**
     * Array of mandatory method names.
     * @protected {Array.<string>}
     * @const
     */
    this.methodNames = methodNames;

    return;
};

/**
 * Ensure all mandatory methods to be implemented by the specified object,
 *     otherwise throw an exception.
 *     Note: Properties (fields) are exempt from the checking.
 * @public
 * @const
 * @param {Object} object Object for duck-typing checking.
 * @throws {TypeError} If any method not to be implemented by the specified
 *     object.
 * @nosideeffects
 * @see #implemented
 */
kclv.PseudoInterface.prototype.ensure = function(object) {
    var unimplementedMethodNames = this.methodNames.filter( function(
        methodName
    ) {
        // Whether an object does not have the specified method.
        return ! this[methodName] || typeof this[methodName] !== 'function';
    }, object );

    if ( unimplementedMethodNames.length > 0 ) {
        throw new TypeError(
            'The specified object does not implement any method(s): ' +
            unimplementedMethodNames.join(', ') +
            '.'
        );
    }

    return;
};

/**
 * Check wheter all mandatory methods of the interface were implemented by the
 *     specified object.
 * @public
 * @const
 * @param {Object} Duck-like object.
 * @returns {boolean} Whether all mandatory methods of the interface were
 *     implemented by the specified object.
 * @nosideeffects
 * @see #ensure
 */
kclv.PseudoInterface.prototype.implemented = function(object) {
    try {
        this.ensure(object);
    } catch (e) {
        return false;
    }

    return true;
};


// ================================================================
// Configuration
// ================================================================

/**
 * A configuration.
 *     It is an instance of the Singleton pattern (GoF) and the Flyweight
 *     pattern (GoF).
 * @public
 * @const
 * @constructor
 */
kclv.Configuration = ( function() {
    /**
     * The configuration structure as a Flyweight object.
     * @private {Object.<string, *>}
     */
    var configuration = null;

    /**
     * A delimiter string for a key of the configuration structure.
     * @private {string}
     * @const
     */
    var DELIMITER = '.';

    return {
        /**
         * Load a file of the specified path or a raw object into the
         *     configuration structure.
         * @public
         * @param {!(string|Object.<string, *>)} source Path of a configuration
         *     file, or a raw object.
         */
        load : function(source) {
            configuration = typeof source === 'string' ?
                JSON.parse( new kclv.Stream().readFile(source) ) : source;

            return;
        },

        /**
         * Get a value (or a subset object) from the configuration structure by
         *     the specified key.
         * @public
         * @param {(string|Array.<string>)=} opt_key A string or array of a
         *     string of a configuration key.
         *     <dl>
         *         <dt>Fully qualified configuration key</dt>
         *             <dd>It means a leaf of the configuratoin tree, then
         *                 returns a simple value.</dd>
         *         <dt>Partly qualified configuration key</dt>
         *             <dd>It means a node of the configuratoin tree, then
         *                 returns a subset object of configuration.</dd>
         *         <dt>Not specified</dt>
         *             <dd>It means a root of the configuratoin tree, then
         *                 returns whole configuration object.</dd>
         *     </dl>
         *     Note: It's not allowed an index of array, but an object key.
         * @param {boolean=} opt_loose Whether the method ignores
         *     {@code ReferenceError} exception.
         * @throws {Error} If configuration not to be loaded yet.
         *     Note: The method must not to be called in a constructor of a
         *     base object. Because when the library loaded, the operation
         *     also runs (accidentally).
         * @throws {ReferenceError} If ...
         * @nosideeffects
         */
        get : function(opt_key, opt_loose) {
            if ( ! configuration ) {
                throw new Error('Configuration does not loaded.');
            }

            var keys = opt_key ?
                (Array.isArray(opt_key) ? opt_key : opt_key.split(DELIMITER)) :
                [];

            // Walk down a configuration tree by keys.
            return keys.reduce( function(value, key) {
                if ( value === undefined || value[key] === undefined ) {
                    if (opt_loose) {
                        return;
                    }
                    throw new ReferenceError(
                        'Configuration has no "' +
                        keys.join(DELIMITER) +
                        '" property.'
                    );
                }
                return value[key];
            }, configuration );
        },

        /**
         * Clear the configuration structure.
         * @public
         */
        clear : function() {
            configuration = null;

            return;
        }
    };
}() );


// ================================================================
// I/O Stream
// ================================================================

/**
 * A file reader/writer.
 * @public
 * @constructor
 */
kclv.Stream = function() {
    /**
     * A default character set.
     * @private {string}
     * @const
     */
    this.defaultCharacterSet_ = 'UTF-8';

    return;
};

/**
 * Read the specified file as the optionally specified character set, and get
 *     its contents as a string.
 *     TODO: Cannot open a log file when KCRDB runs. : Avoided agonizingly.
 *     TODO: Anti anti-virus software.
 *     Note: Scripting.FileSystemObject only treats Shift JIS and UTF-16.
 * @public
 * @param {!string} path A path string to a reading file.
 * @param {string=} opt_characterSet A character set. Default to the property.
 * @returns {string} Contents of the reading file.
 * @throws {kclv.Exception.File} If a file could not opend.
 * @nosideeffects
 * @see http://d.hatena.ne.jp/language_and_engineering/20090216/p1
 */
kclv.Stream.prototype.readFile = function(path, opt_characterSet) {
    try {
        var stream, contents;

        // TODO: parameter of ADODB.Stream#Open or
        // property of ADODB.Stream#Mode
        if (opt_characterSet) {
            path = path.replace( /%.+%/g, function(match) {
                return new ActiveXObject('WScript.Shell').
                    ExpandEnvironmentStrings(match).
                    replace(/\\/g, '/');
            } );
            // Workaround.
            return new ActiveXObject('Scripting.FileSystemObject').
                   OpenTextFile(path, 1).
                   ReadAll();
        }

        stream = new ActiveXObject('ADODB.Stream');
        // stream.Mode = 0; // default ADODB.ConnectModeEnum.adModeUnknown
            // LoadFromFile: "File could not be opened." when KCRDB runs
        // stream.Mode = 1; // ADODB.ConnectModeEnum.adModeRead
            // LoadFromFile: "Operation is not allowed in this context." always
        // stream.Type = 2; // default ADODB.StreamTypeEnum.adTypeText
        stream.Charset = opt_characterSet || this.defaultCharacterSet_;

        stream.Open(); // Source, Mode, OpenOptions, UserName, Password
        stream.LoadFromFile(path);
        contents = stream.ReadText(); // default ADODB.StreamReadEnum.adReadAll

        stream.Close();

        return contents;
    } catch (e) {
        throw new kclv.Exception.File(path);
    }
};

/**
 * Write the specified string as contents to the specified file as the
 *     optionally specified character set.
 * @public
 * @param {!string} path A path string to a writing file.
 * @param {!string} contents Contents of writigin file.
 * @param {string=} opt_characterSet A character set. Default to the property.
 * @throws {kclv.Exception.File} If a file could not opend.
 * @nosideeffects
 */
kclv.Stream.prototype.writeFile = function(path, contents, opt_characterSet) {
    try {
        var stream = new ActiveXObject('ADODB.Stream');
        // stream.Mode = 0; // default ADODB.ConnectModeEnum.adModeUnknown
        // stream.Mode = 2; // ADODB.ConnectModeEnum.adModeWrite
            // WriteText: "Operation is not allowed in this context."
        // stream.Type = 2; // default ADODB.StreamTypeEnum.adTypeText
        stream.Charset = opt_characterSet || this.defaultCharacterSet_;

        stream.Open(); // Source, Mode, OpenOptions, UserName, Password
        stream.WriteText(contents);
        stream.SaveToFile(path, 2);
            // ADODB.SaveOptionsEnum.adSaveCreateOverWrite

        stream.Close();

        return;
    } catch (e) {
        throw new kclv.Exception.File(path);
    }
};


// ================================================================
// Date Utility
// ================================================================

/**
 * A wrapper for date and time.
 * @public
 * @constructor
 * @param {(Date|number|string)=} opt_date A wrapped {@code Date} object, an
 *     epoch time, or a constructor-parsable string (default to "now").
 */
kclv.Date = function(opt_date) {
    /**
     * A wrapped Date object.
     * @private {Date}
     * @const
     */
    this.date_ = new Date(opt_date);

    return;
};

/**
 * Get a string representing the date and time.
 * @public
 * @returns {string} A string representing the its own {@code Date} object.
 * @nosideeffects
 */
kclv.Date.prototype.toString = function() {
    return this.date_.toString();
};

/**
 * Get a string representing the period of its own date by the specified
 *     frequency.
 * @public
 * @param {string} frequency A string representing the frequency.
 * @returns {string} A string representing the period of its own date.
 * @throws {kclv.Exception.InvalidFrequency} If the specified frequency is
 *     invalid.
 * @nosideeffects
 */
kclv.Date.prototype.toPeriod = function(frequency) {
    switch (frequency) {
        case 'Yearly':
            return this.date_.getFullYear().toString();
        case 'Monthly':
            return this.date_.getFullYear() + '/' +
                   this.zeroPad_( this.date_.getMonth() + 1 );
        case 'Weekly':
            return this.toWeekString();
        case 'Daily':
            return this.date_.getFullYear() + '/' +
                   this.zeroPad_( this.date_.getMonth() + 1 ) + '/' +
                   this.zeroPad_( this.date_.getDate()  );
        default:
            throw new kclv.Exception.InvalidFrequency(frequency);
    }
};

/**
 * Get a string representing the full year and week number.
 *     Default format is {@code YYYY-Www}, complied ISO 8601.
 * @public
 * @param {string=} opt_token A delimiter of full year and week number
 *     (Default to {@code -W}).
 *     Note: You can use an empty string {@code ''}.
 * @returns {string} A year and number string.
 *     (ex. {@code 2013-52}, {@code 2014-01}, etc.).
 * @nosideeffects
 * @see #toWeek
 */
kclv.Date.prototype.toWeekString = function(opt_token) {
    if (opt_token === undefined) {
        opt_token = '-W'; // ISO 8601
    }

    var week = this.toWeek();

    return [ week[0], this.zeroPad_(week[1]) ].join(opt_token);
};

/**
 * Get full year and week number as array.
 *     According to ISO 8601, a week starts on Monday, and the first week of a
 *     year contains the first Thursday of the year.
 * @public
 * @returns {Array.<number>} Full year (ex. {@code 2014}) and week number
 *     (ex. {@code 1}, {@code 53}).
 *     Note: Type of these elements are {@code number}. Week number isn't to be
 *     zero-padded.
 * @nosideeffects
 * @see #toWeekString
 */
kclv.Date.prototype.toWeek = function() {
    var year = this.date_.getFullYear(),
        dayOfNewYearsDay = this.getDayOfNewYearsDay_(),
        // Elapsed weeks since the New Year's Day of the year.
        week =
            Math.floor( ( this.getDayOfYear_() + dayOfNewYearsDay - 1 ) / 7 );

    if ( dayOfNewYearsDay <= 4 ) {
        // The New Year's Day of the year is in the first week of the year.
        ++ week;
    }

    if ( week === 0 ) {
        // The last week of the last year.
        return [
            -- year,
            new kclv.Date( new Date(year, 0, 1) ).getWeekPerYear_()
        ];
    }

    if (
        week === 53 &&
        new kclv.Date( new Date(year, 0, 1) ).getWeekPerYear_() === 52
    ) {
        // The first week of the next year.
        return [ ++ year, 1 ];
    }

    return [year, week];
};

/**
 * Get the amount of weeks in its own year.
 *     If the day of the last day of the year is Thursday, the last week of the
 *     year "erodes" some days of the next year, then the year has 53 weeks.
 *     Otherwise, the year has 52 weeks.
 *     The logic requires that if the day of a New Year's Day is Thursday in a
 *     common year, or is Wednesday or Thursday in a leap year.
 * @private
 * @returns {number} The amount of week in its own year.
 *     It is {@code 53} or {@code 52}.
 * @nosideeffects
 */
kclv.Date.prototype.getWeekPerYear_ = function() {
    var dayOfNewYearsDay = this.getDayOfNewYearsDay_();

    return dayOfNewYearsDay === 4 ||                          // Both years.
           ( dayOfNewYearsDay === 3 && this.isLeapYear_() ) ? // A leap year.
        53 : 52;
};

/**
 * Get elapsed days since the New Year's Day of the year.
 *     Note: Any time of a day (00:00:00 - 23:59:59) are comprised in the day.
 *     TODO: Take leap second (UTC 23:59:60 = JST 08:59:60) into consideration.
 * @private
 * @returns {number} Elapsed days since the New Year's Day of the year
 *     (ex. {@code 0}, {@code 42}, {@code 365}, {@code 366}, etc.).
 * @nosideeffects
 */
kclv.Date.prototype.getDayOfYear_ = function() {
    return Math.floor(
        ( this.date_ - this.getNewYearsDay_() ) / 86400000 // 60*60*24*1000
    );
};

/**
 * Get day of the New Year's Day of the year.
 * @private
 * @returns {number} Day of the New Year's Day of the the year (ex. {@code 0}
 *     (Sunday), {@code 1} (Monday), {@code 6} (Saturday), etc.).
 * @nosideeffects
 */
kclv.Date.prototype.getDayOfNewYearsDay_ = function() {
    return this.getNewYearsDay_().getDay();
};

/**
 * Generate and get a {@code Date} object of the New Year's Day of the year.
 * @private
 * @returns {Date} Date of the New Year's Day of the year.
 * @nosideeffects
 */
kclv.Date.prototype.getNewYearsDay_ = function() {
    return new Date(this.date_.getFullYear(), 0, 1);
};

/**
 * Check whether its own year is a leap year.
 * @private
 * @returns {boolean} Whether its own year is a leap year.
 * @nosideeffects
 */
kclv.Date.prototype.isLeapYear_ = function() {
    var year = this.date_.getFullYear();

    return ( year % 4 === 0 ) &&
           ( ( year % 100 !== 0 ) || year % 400 === 0 );
};

/**
 * Pad the specified number by the zero (0) character.
 * @private
 * @param {number} A number.
 * @returns {string} A zero-padded number.
 * @nosideeffects
 */
kclv.Date.prototype.zeroPad_ = function(number) {
    return [ '0', number ].join('').slice(-2);
};


// ================================================================
// Game Rule
// ================================================================

// ----------------------------------------------------------------
// Namespace for Game Rules
// ----------------------------------------------------------------

/**
 * A namespace of game rules.
 * @public
 */
kclv.Game = {};

// ----------------------------------------------------------------
// Game Rule about Materials
// ----------------------------------------------------------------

/**
 * A game rule about materials.
 * @public
 * @const
 * @constructor
 */
kclv.Game.Materials = ( function() {
    /**
     * (Reserved) The maximum value of supplies of materials.
     * @private {Object.<string, number>}
     * @const
     */
    /*
    var LIMIT = {
        Resources   : 300000,
        Consumables :   3000
    };
    */

    /**
     * Default limit quantity for resources in imaginary HQ level 0.
     * @private {number}
     * @const
     */
    var FLOOR = 750;

    /**
     * Raise in limit quantity for resources induced by HQ level up.
     * @private {number}
     * @const
     */
    var RAISE_CEILING_PER_LEVEL = 250;

    return {
        /**
         * Get a string representing a material kind which combined material
         *     names.
         * @public
         * @param {string} material A concrete material name.
         * @returns {string} A combined material name.
         * @throws {Error} If the specified concrete material name is invalid.
         * @nosideeffects
         */
        getKindOf : function(material) {
            switch (material) {
                case 'Fuel':
                case 'Ammunition':
                case 'Steel':
                case 'Bauxite':
                    return 'Resources';
                case 'Repair':
                case 'Construction':
                case 'Development':
                    return 'Consumables';
                default:
                    throw new Error(
                        'The specified concrete material name (' + material +
                        ') is invalid.'
                    );
            }
        },

        /**
         * Calculate a ceiling of spontaneous recovery of resources.
         *     Formula is: HQ level * 250 + 750 (base (floor) value).
         * @public
         * @param {!string} kind A string representing a material kind.
         * @returns {number} Ceiling of spontaneous recovery of resources.
         * @nosideeffects
         */
        getCeilingOf : function(kind, level) {
            return kind === 'Resources' && level ?
                level * RAISE_CEILING_PER_LEVEL + FLOOR : 0;
        }
    };
}() );

// ----------------------------------------------------------------
// Game Rule about Ships
// ----------------------------------------------------------------

/**
 * A game rule about ships (Combined Fleet Girls).
 * @public
 * @const
 * @constructor
 */
kclv.Game.Ships = ( function() {
    return {
        /**
         * Array of abbreviations for ship classification.
         * @public {Array.<string>}
         * @const
         */
        ABBREVIATION_FOR : {
            '潜水母艦'      : 'AS',  // Submarine Tender
            '工作艦'        : 'AR',  // Repair Ship
            '装甲空母'      : 'CVB', // (Armored) Aircraft Carrier
            '揚陸艦'        : 'LHA', // Amphibious Assultship
            '水上機母艦'    : 'AV',  // Seaplane Carrier
            '潜水空母'      : 'SSV', // Aircraft Carrying Submarine
            '潜水艦'        : 'SS',  // Submarine
            '正規空母'      : 'CV',  // (Regular) Aircraft Carrier
            '航空戦艦'      : 'BBV', // Aviation Battleship
            '戦艦'          : 'BB',  // Battleship
         // '巡洋戦艦'      : 'BC',  // Battlecruiser
            '軽空母'        : 'CVL', // Light Aircraft Carrier
            '航空巡洋艦'    : 'CAV', // Aircraft Cruiser
            '重巡洋艦'      : 'CA',  // Heavy Cruiser
            '重雷装巡洋艦'  : 'CLT', // Torpedo Cruiser
            '軽巡洋艦'      : 'CL',  // Light Cruiser
            '駆逐艦'        : 'DD'   // Destroyer
        },

        /**
         * (Reserved) The maximum number of player's port size.
         * @public {number}
         * @const
         */
        /*
        PORT_SIZE : 190,
        */

        /*
         * Ticks of accumulated experience points required for level up of a
         *     ship (Combined Fleet Girl).
         * @public {Array.<number>}
         * @const
         * @see http://wikiwiki.jp/kancolle/?%B7%D0%B8%B3%C3%CD#yecfa05a
         */
        EXPERIENCES : [
                  0,     100,     300,     600,    1000, //   1 -   5
               1500,    2100,    2800,    3600,    4500, //   6 -  10
               5500,    6600,    7800,    9100,   10500, //  11 -  15
              12000,   13600,   15300,   17100,   19000, //  16 -  20
              21000,   23100,   25300,   27600,   30000, //  21 -  25
              32500,   35100,   37800,   40600,   43500, //  26 -  30
              46500,   49600,   52800,   56100,   59500, //  31 -  35
              63000,   66600,   70300,   74100,   78000, //  36 -  40
              82000,   86100,   90300,   94600,   99000, //  41 -  45
             103500,  108100,  112800,  117600,  122500, //  46 -  50
             127500,  132700,  138100,  143700,  149500, //  51 -  55
             155500,  161700,  168100,  174700,  181500, //  56 -  60
             188500,  195800,  203400,  211300,  219500, //  61 -  65
             228000,  236800,  245900,  255300,  265000, //  66 -  70
             275000,  285400,  296200,  307400,  319000, //  71 -  75
             331000,  343400,  356200,  369400,  383000, //  76 -  80
             397000,  411500,  426500,  442000,  458000, //  81 -  85
             474500,  491500,  509000,  527000,  545500, //  86 -  90
             564500,  584500,  606500,  631500,  661500, //  91 -  95
             701500,  761500,  851500, 1000000, 1000000, //  96 - 100
            1010000, 1011000, 1013000, 1016000, 1020000, // 101 - 105
            1025000, 1031000, 1038000, 1046000, 1055000, // 106 - 110
            1065000, 1077000, 1091000, 1107000, 1125000, // 111 - 115
            1145000, 1168000, 1194000, 1223000, 1255000, // 116 - 120
            1290000, 1329000, 1372000, 1419000, 1470000, // 121 - 125
            1525000, 1584000, 1647000, 1714000, 1785000, // 126 - 130
            1860000, 1940000, 2025000, 2115000, 2210000, // 131 - 135
            2310000, 2415000, 2525000, 2640000, 2760000, // 136 - 140
            2887000, 3021000, 3162000, 3310000, 3465000, // 141 - 145
            3628000, 3799000, 3978000, 4165000, 4360000  // 146 - 150
        ]
    };
}() );


// ================================================================
// Agent
// ================================================================

// ----------------------------------------------------------------
// Namespace for Agents
// ----------------------------------------------------------------

/**
 * A namespace for agents.
 * @public
 */
kclv.Agent = {};

// ----------------------------------------------------------------
// Base Agent
// ----------------------------------------------------------------

/**
 * A base agent.
 *     An agent (a.k.a. the game client, a dedicated browser (an user agent),
 *     or a dedicated proxy) has its own format of log files. Their concrete
 *     operations are delegeted
 *     to a tokenizer object.
 *     Note: If you want to add a tokenizer for an other agent object into the
 *     library, please send a specification (an actual log file, path of a log
 *     file, etc.).
 * @public
 * @param {string} name A name of the agent.
 * @param {string} characterSet A character set of agent's log.
 * @constructor
 */
kclv.Agent.Base = function(name, characterSet) {
    /**
     * A name of the agent.
     *     It's to be used as a part of key in a configuration object tree.
     * @protected {string}
     * @const
     */
    this.name = name;

    /**
     * A character set of agent's log.
     * @protected {string}
     * @const
     */
    this.CHARACTER_SET = characterSet;

    /**
     * A delegated file reader object to read a log file.
     * @protected {kclv.Stream}
     * @const
     */
    this.stream = new kclv.Stream();

    return;
};

/**
 * Build a relation object and get it.
 * @public
 * @param {string} relationName A name of relation.
 * @returns {kclv.Relation.Base} A relation object.
 */
kclv.Agent.Base.prototype.buildRelation = function(relationName) {
    var relation = kclv.Factory.getInstance(kclv.Relation, relationName).
                   insert( this.getLog_(relationName) );

    // TODO: Strategy
    if (relationName === 'Materials') {
        relation.select( this.getSelector() );
    }

    return relation;
};

/**
 * Build two-dimensional array representing a log file.
 * @private
 * @param {!string} relationName A name of relation.
 *     (ex. {@code Materials}, {@code Ships})
 * @param {string=} opt_concreteRelationName A name of concrete relation.
 *     (ex. {@code Fuel}, {@code Repair})
 * @returns {Array.<Array>} Two-dimensional array representing contents of a
 *     log file.
 * @nosideeffects
 */
kclv.Agent.Base.prototype.getLog_ = function(
    relationName, opt_concreteRelationName
) {
    opt_concreteRelationName = opt_concreteRelationName || relationName;
    var tokenizer =
        kclv.Factory.getInstance(kclv.Tokenizer, [this.name, relationName]);

    return tokenizer.toRelationalArray(
        this.stream.readFile(
            this.getPathOf_(opt_concreteRelationName), this.CHARACTER_SET
        )
    );
};

/**
 * Build a tuple seleector object and get it.
 * @protected
 * @returns {kclv.Selector.Base} A tuple selector object.
 * @nosideeffects
 */
kclv.Agent.Base.prototype.getSelector = function() {
    var configuration = kclv.Configuration.get('relation');

    return typeof configuration.duration === 'number' ?
        new kclv.Selector.Retrospection(
            configuration.duration
        ) :
        new kclv.Selector.Period(
            configuration.inception,
            configuration.expiration
        );
};

/**
 * (Abstract) Build an attribute projector object and get it.
 * @protected
 * @throws {kclv.Exception.AbstractMethod} Always.
 */
kclv.Agent.Base.prototype.getProjector = function() {
    throw new kclv.Exception.AbstractMethod();
};

/**
 * Get a path string of the specified relation name.
 * @private
 * @param {!string} relationName A name of relation.
 * @returns {string} A path string of the specified log file.
 * @nosideeffects
 */
kclv.Agent.Base.prototype.getPathOf_ = function(relationName) {
    return kclv.Configuration.get(['agent', this.name, 'path', relationName]);
};

// ----------------------------------------------------------------
// Agent "KCRDB"
// ----------------------------------------------------------------

/**
 * An agent for "KCRDB".
 * @public
 * @constructor
 * @extends {kclv.Agent.Base}
 * @see http://hetaregrammer.blog.fc2.com/
 */
kclv.Agent.KCRDB = function() {
    kclv.Agent.Base.call(this, 'KCRDB', 'Shift_JIS');

    return;
};
kclv.Agent.KCRDB.prototype = Object.create(kclv.Agent.Base.prototype);
kclv.Agent.KCRDB.prototype.constructor = kclv.Agent.Base.prototype;

/**
 * Build a relation object and get it.
 * @public
 * @override
 * @param {string} relationName A name of relation.
 * @returns {kclv.Relation.Base} A relation object.
 */
kclv.Agent.KCRDB.prototype.buildRelation = function(relationName) {
    var relation =
            kclv.Agent.Base.prototype.buildRelation.call(this, relationName);

    // TODO: Strategy
    if (relationName === 'Materials') {
        relation.project( this.getProjector() );
    }

    return relation;
};

/**
 * Build an attribute projector object by the configurated kind and get it.
 *     Note: The default kind is 'Low'.
 * @protected
 * @override
 * @returns {kclv.Projector.Base} An attribute projector object.
 * @nosideeffects
 */
kclv.Agent.KCRDB.prototype.getProjector = function() {
    var kind = kclv.Configuration.get('relation.values', true) || 'Low';

    return kclv.Factory.getInstance(kclv.Projector.Materials, kind);
};

// ----------------------------------------------------------------
// Agent "Logbook"
// ----------------------------------------------------------------

/**
 * An agent for "Logbook".
 *     It is a simple subtype of {@code kclv.Agent.Base} at the moment.
 * @public
 * @constructor
 * @extends {kclv.Agent.Base}
 * @see http://kancolle.sanaechan.net/
 */
kclv.Agent.Logbook = function() {
    kclv.Agent.Base.call(this, 'Logbook', 'Shift_JIS');

    return;
};
kclv.Agent.Logbook.prototype = Object.create(kclv.Agent.Base.prototype);
kclv.Agent.Logbook.prototype.constructor = kclv.Agent.Base;


// ----------------------------------------------------------------
// Agent "Sandanshiki Kanpan" (Three Flight Decks)
// ----------------------------------------------------------------

/**
 * An agent for "Sandanshiki Kanpan" (Three Flight Decks).
 * @public
 * @constructor
 * @extends {kclv.Agent.Base}
 * @see http://3dan.preflight.cc/
 */
kclv.Agent.SandanshikiKanpan = function() {
    kclv.Agent.Base.call(this, 'SandanshikiKanpan', 'Shift_JIS');

    return;
};
kclv.Agent.SandanshikiKanpan.prototype =
    Object.create(kclv.Agent.Base.prototype);
kclv.Agent.SandanshikiKanpan.prototype.constructor = kclv.Agent.Base;

/**
 * Build a relation object and get it.
 * @public
 * @override
 * @param {string} relationName A name of relation.
 * @returns {kclv.Relation.Base} A relation object.
 */
kclv.Agent.SandanshikiKanpan.prototype.buildRelation = function(relationName) {
    var contents = {};

    if (relationName !== 'Materials') {
        throw new Error(
            'Specified relation name (' + relationName +
            ') is not "Materials".'
        );
    }

    [
        'Fuel', 'Ammunition', 'Steel', 'Bauxite',
        'Repair', 'Construction', 'Development'
    ].forEach( function(concreteRelationName, index) {
        // [[date0, value0], [date1, value0], ...]
        this.getLog_(relationName, concreteRelationName).forEach( function(
            tuple
        ) {
            // { date0 : [value0, value1, ...], date1: ... }
            var date = tuple[0].toJSON();
            contents[date] = contents[date] || [];
            contents[date][index] = tuple[1];
        }, this );
    }, this );

    return kclv.Factory.getInstance(kclv.Relation, relationName).
        insert(
            // [ [date0, value0, value1, ...], [date1, value0, ...], ... ]
            Object.keys(contents).sort().map( function(date) {
                return [new Date(date)].concat(contents[date]);
            }, this )
        ).
        select( this.getSelector() );
};


// ================================================================
// Tokenizers
// ================================================================

// ----------------------------------------------------------------
// Namespace for Tokenizers
// ----------------------------------------------------------------

/**
 * A namespace for tokenizers.
 * @public
 */
kclv.Tokenizer = {};

// ----------------------------------------------------------------
// Base Tokenizer Object
// ----------------------------------------------------------------

/**
 * A base tokenizer.
 *     TODO: Remove concrete objects, and define these logic in configuration
 *     file instead.
 *     ex. {@code {adopt":[0,1,3,4,5],unquote:[1,2],integerize:[0,3,4]}}
 * @public
 * @constructor
 * @param {boolean} hasHeader Whether a log file has a header as the first row.
 */
kclv.Tokenizer.Base = function(hasHeader) {
    /**
     * Whether a log file has a header as the first row.
     * @private {boolean}
     * @const
     */
    this.hasHeader_ = hasHeader;

    /**
     * A string or a RegExp pattern as a split token of log files.
     *     For example, {@code 42, "Foo, Bar and Baz"} row will be converted
     *     into two ({@code [42, '"Foo", "Bar and Baz"']}) columns.
     * @protected {Object.<string, (RegExp|string)>}
     */
    this.SPLIT_TOKEN_OF_ = {
        rows    : /\s*\r?\n/, // CR+LF (Windows) and LF (Unixen)
        // CAVEAT: JScript sucks! 'a,,b,c'.split(/,/).length !== 4, === 3
     // columns : /\s*,\s*/   // TODO: Escape
        columns : ','         // TODO: Escape
    };

    /**
     * A delegated formatter object to normalize values.
     * @protected {kclv.Formatter}
     * @const
     */
    this.formatter = new kclv.Formatter();

    return;
};

/**
 * (Template) Convert the specified string into two-dimensional array of a
 *     relation. Methods of concrete operations ({@code toRows} and
 *     {@code toColumns}) may overridden by a descendent object.
 * @public
 * @const
 * @param {!string} string Contents of a log file.
 * @returns {Array.<Array>} Two-dimensional array representing contents of a
 *     log file.
 * @nosideeffects
 */
kclv.Tokenizer.Base.prototype.toRelationalArray = function(string) {
    return this.toRows(string).map(this.toColumns, this);
};

/**
 * Convert the specified string into arrays representing each line (row) by its
 *     own patterns or characters of a delimiter token (Usually, End-of-Line).
 *     Note: It also removes the first row as header if its own
 *     {@code hasHeader_} property is true.
 *     Note: It also filters out empty (blank) rows, bcause POSIX defines a
 *     "Line" and a "Last Close of a File" at IEEE Std 1003.1-2004, section
 *     3.204 and 3.205.
 *     Note: May normalize some rows by a descendent object.
 * @protected
 * @param {!string} string Contents of a log file.
 * @returns {Array.<string>} One-dimensional array representing each lines of
 *     the specified string.
 * @nosideeffects
 * @see http://pubs.opengroup.org/onlinepubs/000095399/basedefs/xbd_chap03.html
 */
kclv.Tokenizer.Base.prototype.toRows = function(string) {
    var rows = string.split( this.SPLIT_TOKEN_OF_.rows ).
               filter( function(row) { return row !== ''; } );

    if (this.hasHeader_) {
        rows.shift(); // Remove a header.
    }

    return rows;
};

/**
 * (Callback) Convert the specified string into arrays representing each
 *     columns by its own patterns or characters of a delimiter token.
 *     Note: May normalize some columns by a descendent object.
 * @protected
 * @this {kclv.Tokenizer.Base}
 * @param {!string} row A string of row (line).
 * @returns {Array.<Array>} Array representing each columns of the specified
 *     row.
 * @nosideeffects
 */
kclv.Tokenizer.Base.prototype.toColumns = function(row) {
    return row.split( this.SPLIT_TOKEN_OF_.columns );
};

// ----------------------------------------------------------------
// Namespace for Tokeninzers of KCRDB
// ----------------------------------------------------------------

/**
 * A namespace for tokenizers of KCRDB.
 * @public
 */
kclv.Tokenizer.KCRDB = {};

// ----------------------------------------------------------------
// Base Tokeninzer for KCRDB
// ----------------------------------------------------------------

/**
 * A base tokenizer for KCRDB.
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.Base}
 */
kclv.Tokenizer.KCRDB.Base = function() {
    kclv.Tokenizer.Base.call(this, false);

    return;
};
kclv.Tokenizer.KCRDB.Base.prototype =
    Object.create(kclv.Tokenizer.Base.prototype);
kclv.Tokenizer.KCRDB.Base.prototype.constructor = kclv.Tokenizer.Base;

// ----------------------------------------------------------------
// Tokeninzer for a KCRDB's Materials Log
// ----------------------------------------------------------------

/**
 * A tokenizer for a KCRDB's materials log.
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.KCRDB.Base}
 */
kclv.Tokenizer.KCRDB.Materials = function() {
    kclv.Tokenizer.KCRDB.Base.call(this);

    return;
};
kclv.Tokenizer.KCRDB.Materials.prototype =
    Object.create(kclv.Tokenizer.KCRDB.Base.prototype);
kclv.Tokenizer.KCRDB.Materials.prototype.constructor =
    kclv.Tokenizer.KCRDB.Base;

/**
 * (Callback) Convert the specified string into arrays representing each
 *     columns by its own patterns or characters of a delimiter token.
 *     Also normalize (remove hash-signs, instantiate a Date object and
 *     integerize) some columns.
 * @protected
 * @override
 * @this {kclv.Tokenizer.KCRDB.Materials}
 * @param {!string} row A string of row (line).
 * @returns {Array.<Array>} Array representing each columns of the specified
 *     row.
 * @nosideeffects
 */
kclv.Tokenizer.KCRDB.Materials.prototype.toColumns = function(row) {
    var columns =
            kclv.Tokenizer.KCRDB.Base.prototype.toColumns.call(this, row),
        // Convert "#2013/04/23 01:23:45#" into "2013/04/23 01:23:45".
        dateTime = new Date( columns.shift().replace(/#/g, '' ) );

    // Fuel, Ammunition, Steel, Bauxite, Repair, Construction and Development.
    columns = this.formatter.integerize(columns);
    columns.unshift(dateTime);

    return columns;
};

// ----------------------------------------------------------------
// Tokeninzer for a KCRDB's Ships Log
// ----------------------------------------------------------------

/**
 * A tokenizer for a KCRDB's ships log.
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.KCRDB}
 */
kclv.Tokenizer.KCRDB.Ships = function() {
    kclv.Tokenizer.KCRDB.Base.call(this);

    return;
};
kclv.Tokenizer.KCRDB.Ships.prototype =
    Object.create(kclv.Tokenizer.KCRDB.Base.prototype);
kclv.Tokenizer.KCRDB.Ships.prototype.constructor = kclv.Tokenizer.KCRDB.Base;

/**
 * (Callback) Convert the specified string into arrays representing each
 *     columns by its own patterns or characters of a delimiter token.
 *     Also normalize (extract, unquote and integerize) some columns.
 * @protected
 * @override
 * @this {kclv.Tokenizer.KCRDB.Ships}
 * @param {!string} row A string of row (line).
 * @returns {Array.<Array>} Array representing each columns of the specified
 *     row.
 * @nosideeffects
 */
kclv.Tokenizer.KCRDB.Ships.prototype.toColumns = function(row) {
    var columns =
            kclv.Tokenizer.KCRDB.Base.prototype.toColumns.call(this, row);

    columns = kclv.Array.values(columns, [
        0,  // 0: ID (Order of arrival, includes omissions).
        1,  // 1: Name.
            // Master ID. (For example, DD Fubuki is always 201.)
        3,  // 2: Ship class.
        4,  // 3: Level.
        5   // 4: Experience points.
            // ... (snip)
    ]);
    columns = this.formatter.unquote(columns, [
        1,  // Name.
        2   // Ship class.
    ]);
    columns[2] = kclv.Game.Ships.ABBREVIATION_FOR[ columns[2] ];
    columns = this.formatter.integerize(columns, [
        0,  // ID (Order of arrival, includes omissions).
        3,  // Level.
        4   // Experience points.
    ]);

    return columns;
};

// ----------------------------------------------------------------
// Namespace for Tokeninzers of Logbook
// ----------------------------------------------------------------

/**
 * A namespace for tokenizers of Logbook.
 * @public
 */
kclv.Tokenizer.Logbook = {};

// ----------------------------------------------------------------
// Base Tokeninzer for Logbook
// ----------------------------------------------------------------

/**
 * Base tokenizer for Logbook.
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.Base}
 */
kclv.Tokenizer.Logbook.Base = function() {
    kclv.Tokenizer.Base.call(this, true);

    return;
};
kclv.Tokenizer.Logbook.Base.prototype =
    Object.create(kclv.Tokenizer.Base.prototype);
kclv.Tokenizer.Logbook.Base.prototype.constructor = kclv.Tokenizer.Base;

// ----------------------------------------------------------------
// Tokeninzer for a Logbook's Materials Log
// ----------------------------------------------------------------

/**
 * A tokenizer for a Logbook's materials log.
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.Logbook}
 */
kclv.Tokenizer.Logbook.Materials = function() {
    kclv.Tokenizer.Logbook.Base.call(this);

    return;
};
kclv.Tokenizer.Logbook.Materials.prototype =
    Object.create(kclv.Tokenizer.Logbook.Base.prototype);
kclv.Tokenizer.Logbook.Materials.prototype.constructor =
    kclv.Tokenizer.Logbook.Base;

/**
 * (Callback) Convert the specified string into arrays representing each
 *     columns by its own patterns or characters of a delimiter token.
 *     Also normalize (remove hash-signs, instantiate a Date object and
 *     integerize) some columns.
 * @protected
 * @override
 * @this {kclv.Tokenizer.Logbook.Materials}
 * @param {!string} row A string of row (line).
 * @returns {Array.<Array>} Array representing each columns of the specified
 *     row.
 * @nosideeffects
 */
kclv.Tokenizer.Logbook.Materials.prototype.toColumns = function(row) {
    var columns =
            kclv.Tokenizer.Logbook.Base.prototype.toColumns.call(this, row),
        // Convert "2013-04-23 01:23:45" into "2013/04/23 01:23:45".
        dateTime = new Date( columns.shift().replace(/-/g, '/' ) );

    // Fuel, Ammunition, Steel, Bauxite, Repair, Construction and Development.
    columns = this.formatter.integerize(columns);
    columns.unshift(dateTime);

    return columns;
};

// ----------------------------------------------------------------
// Tokeninzer for a Logbook's Ships Log
// ----------------------------------------------------------------

/**
 * A tokenizer for a Logbook's ships log.
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.Logbook.Base}
 * @throws {TypeError} If the constructor was invoked.
 */
kclv.Tokenizer.Logbook.Ships = function() {
    kclv.Tokenizer.Logbook.Base.call(this);

    return;
};
kclv.Tokenizer.Logbook.Ships.prototype =
    Object.create(kclv.Tokenizer.Logbook.Base.prototype);
kclv.Tokenizer.Logbook.Ships.prototype.constructor =
    kclv.Tokenizer.Logbook.Base;

/**
 * (Callback) Convert the specified string into arrays representing each
 *     columns by its own patterns or characters of a delimiter token.
 *     Also normalize (remove hash-signs, instantiate a Date object and
 *     integerize) some columns.
 * @protected
 * @override
 * @this {kclv.Tokenizer.Logbook.Materials}
 * @param {!string} row A string of row (line).
 * @returns {Array.<Array>} Array representing each columns of the specified
 *     row.
 * @nosideeffects
 */
kclv.Tokenizer.Logbook.Ships.prototype.toColumns = function(row) {
    var columns =
            kclv.Tokenizer.Logbook.Base.prototype.toColumns.call(this, row);

    columns = kclv.Array.values(columns, [
            // Order of arrival, excludes omissions. (1-190)
        1,  // 0: ID (Order of arrival, includes omissions).
            // Fleet number. (empty, 1, 2, 3 and 4)
        3,  // 1: Name.
        4,  // 2: Ship class.
            // Condition value. (0-100)
            // Time to departure. (hh:mm)
        7,  // 3: Level.
            // Experience points to next level.
        9   // 4: Experience points.
            // ... (snip)
    ]);
    columns[2] = kclv.Game.Ships.ABBREVIATION_FOR[ columns[2] ];
    columns = this.formatter.integerize(columns, [
        0,  // ID (Order of arrival, includes omissions).
            // Name.
            // Ship class.
        3,  // Level.
        4   // Experience points.
    ]);

    return columns;
};

// ----------------------------------------------------------------
// Namespace for Tokeninzers of Sandanshiki Kanpan (Three Flight Decks)
// ----------------------------------------------------------------

/**
 * A namespace for tokenizers of Sandanshiki Kanpan (Three Flight Decks).
 * @public
 */
kclv.Tokenizer.SandanshikiKanpan = {};

// ----------------------------------------------------------------
// Base Tokeninzer for Sandanshiki Kanpan (Three Flight Decks)
// ----------------------------------------------------------------

/**
 * Base tokenizer for Sandanshiki Kanpan (Three Flight Decks).
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.Base}
 */
kclv.Tokenizer.SandanshikiKanpan.Base = function() {
    kclv.Tokenizer.Base.call(this, false);

    return;
};
kclv.Tokenizer.SandanshikiKanpan.Base.prototype =
    Object.create(kclv.Tokenizer.Base.prototype);
kclv.Tokenizer.SandanshikiKanpan.Base.prototype.constructor =
    kclv.Tokenizer.Base;

// ----------------------------------------------------------------
// Tokeninzer for a Sandanshiki Kanpan (Three Flight Decks)'s Materials Log
// ----------------------------------------------------------------

/**
 * A tokenizer for a Sandanshiki Kanpan (Three Flight Decks)'s materials log.
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.SandanshikiKanpan}
 */
kclv.Tokenizer.SandanshikiKanpan.Materials = function() {
    kclv.Tokenizer.SandanshikiKanpan.Base.call(this);

    this.SPLIT_TOKEN_OF_.columns = /\t/;

    return;
};
kclv.Tokenizer.SandanshikiKanpan.Materials.prototype =
    Object.create(kclv.Tokenizer.SandanshikiKanpan.Base.prototype);
kclv.Tokenizer.SandanshikiKanpan.Materials.prototype.constructor =
    kclv.Tokenizer.SandanshikiKanpan.Base;

/**
 * (Callback) Convert the specified string into arrays representing each
 *     columns by its own patterns or characters of a delimiter token.
 *     Also normalize (remove hash-signs, instantiate a Date object and
 *     integerize) some columns.
 * @protected
 * @override
 * @this {kclv.Tokenizer.SandanshikiKanpan.Materials}
 * @param {!string} row A string of row (line).
 * @returns {Array.<Array>} Array representing each columns of the specified
 *     row.
 * @nosideeffects
 */
kclv.Tokenizer.SandanshikiKanpan.Materials.prototype.toColumns = function(
    row
) {
    var columns =
            kclv.Tokenizer.SandanshikiKanpan.Base.prototype.toColumns.call(
                this, row
            ),
        // Convert "2013-04-23-01-23-45-6789" into "2013/04/23 01:23:45".
        dateTime = new Date( columns.shift().replace(
            /^(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{4})$/,
            '$1/$2/$3 $4:$5:$6'
        ) );

    // Fuel, Ammunition, Steel, Bauxite, Repair, Construction and Development.
    columns = this.formatter.integerize(columns);
    columns.unshift(dateTime);

    return columns;
};


// ================================================================
// Tuple Selectors
// ================================================================

// ----------------------------------------------------------------
// Interface of Selectors
// ----------------------------------------------------------------

/**
 * An interface of selection strategies.
 * @public
 * @interface
 * @extends {kclv.PseudoInterface}
 */
kclv.SelectorLike = function() {
    kclv.PseudoInterface.call(this, ['select']);

    return;
};
kclv.SelectorLike.prototype = Object.create(kclv.PseudoInterface.prototype);
kclv.SelectorLike.prototype.constructor = kclv.PseudoInterface;

// ----------------------------------------------------------------
// Namespace for Selectors
// ----------------------------------------------------------------

/**
 * A namespace for selectors.
 * @public
 */
kclv.Selector = {};

// ----------------------------------------------------------------
// Selector by Retrospection
// ----------------------------------------------------------------

/**
 * A selector by retrospection.
 * @public
 * @constructor
 * @param {number} duration A number representing the duration (past N days).
 * @implements {kclv.SelectorLike}
 */
kclv.Selector.Retrospection = function(duration) {
    /**
     * The inception of a selection.
     * @private {Date}
     * @const
     */
    this.inception_ = this.buildInception_(duration);

    return;
};

/**
 * (Callback) Check whether the specified tuple is on or after the inception.
 *     It is a callback function as a selectile.
 *     Note: It considers the 0th attribute as comparing attribute at the
 *     moment.
 * @public
 * @this {kclv.Selector.Retrospection}
 * @param {!Array.<(string|number)>} tuple A tuple (an one-dimensional array)
 *     of the iterating two-dimensional relation array.
 * @returns {boolean} Whether 0th element of a tuple is on or after the
 *     inception.
 * @nosideeffects
 */
kclv.Selector.Retrospection.prototype.select = function(tuple) {
    return this.inception_ <= tuple[0];
};

/**
 * Calculate and get inception date and time from specified duration days.
 * @private
 * @param {!number} duration Duration days.
 * @returns {Date} Inception date and time.
 * @nosideeffects
 */
kclv.Selector.Retrospection.prototype.buildInception_ = function(duration) {
    var inception = new Date();
    inception.setDate( inception.getDate() - duration );

    return inception;
};

// ----------------------------------------------------------------
// Selector by Period
// ----------------------------------------------------------------

/**
 * A selector by period (from {@code inception} till {@code expiration}).
 * @public
 * @constructor
 * @param {string|Date} inception A string representing an inception as an
 *     argument for {@code Date} constructor, or a {@code Date} object.
 * @param {string|Date} expiration A string representing an expiration as an
 *     argument for {@code Date} constructor, or a {@code Date} object.
 * @implements {kclv.SelectorLike}
 */
kclv.Selector.Period = function(inception, expiration) {
    /**
     * An inception or the UNIX epoch.
     * @private {Date}
     * @const
     */
    this.inception_ = new Date( inception || 0 );

    /**
     * An expiration or the current time.
     * @private {Date}
     * @const
     */
    this.expiration_ = new Date( expiration || new Date() );

    return;
};

/**
 * (Callback) Check whether the specified tuple is on or after the inception
 *     and is on or before the expiration.
 *     It is a callback function as a selectile.
 *     Note: It considers the 0th attribute as comparing attribute at the
 *     moment.
 * @public
 * @override
 * @this {kclv.Selector.Period}
 * @param {!Array.<(string|number)>} tuple A tuple (an one-dimensional array)
 *     of the iterating two-dimensional relation array.
 * @returns {boolean} Whether 0th element of a tuple is on or after the
 *     inception and is on or before the expiration.
 * @nosideeffects
 */
kclv.Selector.Period.prototype.select = function(tuple) {
    /*
    // TODO: More efficiency (Must profiling).
    return this.inception_ ?
        this.expiration_ ?
            this.inception_ <= tuple[0] && tuple[0] <= this.expiration_ :
            this.inception_ <= tuple[0]                                 :
        this.expiration_ ?
                                           tuple[0] <= this.expiration_ :
            true                                                        ;
    */

    return this.inception_ <= tuple[0] && tuple[0] <= this.expiration_;
};


// ================================================================
// Attribute Projectors
// ================================================================

// ----------------------------------------------------------------
// Interface of Projectors
// ----------------------------------------------------------------

/**
 * An interface of projection strategies.
 * @public
 * @interface
 * @extends {kclv.PseudoInterface}
 */
kclv.ProjectorLike = function() {
    kclv.PseudoInterface.call(this, ['project']);

    return;
};
kclv.ProjectorLike.prototype = Object.create(kclv.PseudoInterface.prototype);
kclv.ProjectorLike.prototype.constructor = kclv.PseudoInterface;

// ----------------------------------------------------------------
// Namespace for Attribute Projectors
// ----------------------------------------------------------------

/**
 * A namespace for attribute projectors.
 * @public
 */
kclv.Projector = {};

// ----------------------------------------------------------------
// Namespace for Material Attribute Projectors
// ----------------------------------------------------------------

/**
 * A namespace for materials attribute projectors.
 * @public
 */
kclv.Projector.Materials = {};

// ----------------------------------------------------------------
// Materials Attribute Projector by High-Values
// ----------------------------------------------------------------

/**
 * A material attribute projector extracting high-value attributes.
 *     Caveat: It works right only for agent KCRDB.
 * @public
 * @constructor
 * @implements {kclv.ProjectorLike}
 */
kclv.Projector.Materials.High = function() {
    return;
};

/**
 * (Callback) Get an array from extracted high-value elements of the specified
 *     tuple.
 *     It is a callback function as a projectile.
 * @public
 * @override
 * @this {kclv.Projector.Materials.High}
 * @param {!Array.<(string|number)>} tuple A tuple (an one-dimensional array)
 *     of the iterating two-dimensional relation array.
 * @returns {Array} An array from extracted elements of the specified tuple.
 * @nosideeffects
 */
kclv.Projector.Materials.High.prototype.project = function(tuple) {
    return kclv.Array.values( tuple, [
         0, // Date & Time.
         2, // Fuel.
         4, // Ammunition.
         6, // Steel.
         8, // Bauxite.
        10, // Repair.
        12, // Construction.
        14  // Development.
    ] );
};

// ----------------------------------------------------------------
// Materials Attribute Projector by Average-Values
// ----------------------------------------------------------------

/**
 * A material attribute projector extracting and culculating average-value
 *     attributes.
 *     Caveat: It works right only for agent KCRDB.
 * @public
 * @constructor
 * @implements {kclv.ProjectorLike}
 */
kclv.Projector.Materials.Average = function() {
    return;
};

/**
 * (Callback) Get an array from calculated average-value elements of the
 *     specified tuple.
 *     It is a callback function as a projectile.
 * @public
 * @override
 * @this {kclv.Projector.Materials.Average}
 * @param {!Array.<(string|number)>} tuple A tuple (an one-dimensional array)
 *     of the iterating two-dimensional relation array.
 * @returns {Array} An array from extracted elements of the specified tuple.
 * @nosideeffects
 */
kclv.Projector.Materials.Average.prototype.project = function(tuple) {
    return [
        tuple[ 0],                                   // Date & Time.
        Math.round( ( tuple[ 1] + tuple[ 2] ) / 2 ), // Fuel.
        Math.round( ( tuple[ 3] + tuple[ 4] ) / 2 ), // Ammunition.
        Math.round( ( tuple[ 5] + tuple[ 6] ) / 2 ), // Steel.
        Math.round( ( tuple[ 7] + tuple[ 8] ) / 2 ), // Bauxite.
        Math.round( ( tuple[ 9] + tuple[10] ) / 2 ), // Repair.
        Math.round( ( tuple[11] + tuple[12] ) / 2 ), // Construction.
        Math.round( ( tuple[13] + tuple[14] ) / 2 )  // Development.
    ];
};

// ----------------------------------------------------------------
// Materials Attribute Projector by Low-Values
// ----------------------------------------------------------------

/**
 * A material attribute projector extracting low-value attributes.
 *     Caveat: It works right only for agent KCRDB.
 * @public
 * @constructor
 * @implements {kclv.ProjectorLike}
 */
kclv.Projector.Materials.Low = function() {
    return;
};

/**
 * (Callback) Get an array from extracted low-value elements of the specified
 *     tuple.
 *     It is a callback function as a projectile.
 * @public
 * @override
 * @this {kclv.Projector.Materials.Low}
 * @param {!Array.<(string|number)>} tuple A tuple (an one-dimensional array)
 *     of the iterating two-dimensional relation array.
 * @returns {Array} An array from extracted elements of the specified tuple.
 * @nosideeffects
 */
kclv.Projector.Materials.Low.prototype.project = function(tuple) {
    return kclv.Array.values( tuple, [
         0, // Date & Time.
         1, // Fuel.
         3, // Ammunition.
         5, // Steel.
         7, // Bauxite.
         9, // Repair.
        11, // Construction.
        13  // Development.
    ] );
};


// ================================================================
// Relations
// ================================================================

// ----------------------------------------------------------------
// Namespace for Relations
// ----------------------------------------------------------------

/**
 * A namespace for relations.
 * @public
 */
kclv.Relation = {};

// ----------------------------------------------------------------
// Base (Abstract) Relation
// ----------------------------------------------------------------

/**
 * A base (abstract) relation, which provides relation algebra.
 *     Some algebra are provided by strategy objects (selector and projector).
 * @public
 * @constructor
 */
kclv.Relation.Base = function() {
    /**
     * A two-dimensional array of a relation model.
     * @protected {Array.<Array>}
     */
    this.relation = [];

    /**
     * Interfaces for strategy objects of relation algebra.
     * @private {Object<string, kclv.PseudoInterface>}
     * @const
     */
    this.interface_ = {
        selector  : new kclv.SelectorLike(),
        projector : new kclv.ProjectorLike()
    };

    return;
};

/**
 * Insert an other relation into its own relation.
 * @public
 * @const
 * @param {!(Array.<Array>|kclv.Relation.Base)} relation An other relation.
 * @returns {kclv.Relation.Base} This object for method chaining.
 * @throws {TypeError} If the specified relation is invalid.
 */
kclv.Relation.Base.prototype.insert = function(relation) {
    if ( Array.isArray(relation) ) {
        this.relation = this.relation.concat(relation);
    } else if ( relation instanceof this.constructor ) {
        this.relation = this.relation.concat( relation.clone().relation );
    } else {
        throw new TypeError(
            'Relation is neither Array nor a kclv.Relation.Base object.'
        );
    }

    return this;
};

/**
 * Select (relation algebra) a relation by the specified selector.
 *     Note: It may destruct a {@code relation} property.
 * @public
 * @const
 * @param {(Array.<number>|kclv.Relation.Base)=} opt_selector A relation
 *     selector. If it isn't defined, the method does no operation, and throws
 *     no exception.
 * @returns {kclv.Relation.Base} This object for method chaining.
 * @throws {TypeError} If the specified selector is invalid type.
 */
kclv.Relation.Base.prototype.select = function(opt_selector) {
    if (! opt_selector) {
        return this; // NOP
    }

    if ( Array.isArray(opt_selector) ) {
        this.relation = kclv.Array.values(this.relation, opt_selector);
    } else if ( this.interface_.selector.implemented(opt_selector) ) {
        this.relation =
            this.relation.filter(opt_selector.select, opt_selector);
    } else {
        throw new kclv.Exception.InvalidStrategy(
            'A tuple selector is neither Array nor ' +
            'an object which implements a selector interface.'
        );
    }

    return this;
};

/**
 * Project (relation algebra) a relation by the specified projector.
 *     Note: It may destruct a {@code relation} property.
 * @public
 * @const
 * @param {(Array.<number>|kclv.Relation.Base)=} opt_projector A relation
 *     projector. If it isn't defined, the method does no operation, and throws
 *     no exception.
 * @returns {kclv.Relation.Base} This object for method chaining.
 * @throws {TypeError} If the specified projector is invalid type.
 */
kclv.Relation.Base.prototype.project = function(opt_projector) {
    if (! opt_projector) {
        return this; // NOP
    }

    if ( Array.isArray(opt_projector) ) {
        this.relation = this.relation.map( function(tuple) {
            return kclv.Array.values(tuple, this);
        }, opt_projector );
    } else if ( this.interface_.projector.implemented(opt_projector) ) {
        this.relation = this.relation.map(opt_projector.project);
    } else {
        throw new kclv.Exception.InvalidStrategy(
            'An attribute projector is neither Array nor ' +
            'an object which implements a projector interface.'
        );
    }

    return this;
};

/**
 * Get the maximum value in fields of the relation.
 * @public
 * @const
 * @param {!(Array.<number>|string)} indices An array of indices of attributes
 *     or a string representing the indices.
 * @returns {number} The maximum value in fields of the relation.
 * @nosideeffects
 * @see #minimum
 */
kclv.Relation.Base.prototype.maximum = function(indices) {
    if (! Array.isArray(indices) ) {
        indices = this.getIndicesOf(indices);
    }

    return kclv.Array.maximum(this.relation, indices);
};

/**
 * Get the minimum value in fields of the relation.
 * @public
 * @const
 * @param {!(Array.<number>|string)} indices An array of indices of attributes
 *     or a string representing the indices.
 * @returns {number} The minimum value in fields of the relation.
 * @nosideeffects
 * @see #maximum
 */
kclv.Relation.Base.prototype.minimum = function(indices) {
    if (! Array.isArray(indices) ) {
        indices = this.getIndicesOf(indices);
    }

    return kclv.Array.minimum(this.relation, indices);
};

/**
 * Count an amount of tuples.
 * @public
 * @const
 * @returns {number} An amount of tuples.
 * @nosideeffects
 */
kclv.Relation.Base.prototype.count = function() {
    return this.relation.length;
};

/**
 * Sort the tuples of the relation in place and return the relation.
 * @public
 * @const
 * @param {Function} sorter A function that defines the sort order.
 * @returns {Array.<Array>} A sorted relation.
 * @see Array#sort()
 */
kclv.Relation.Base.prototype.sort = function(sorter) {
    return this.relation.sort(sorter);
};

/**
 * Create a new relation with the results of calling a provided mapper function
 *     on every tuple in the relation.
 * @public
 * @const
 * @param {Function} mapper A function that produces a tuple of the new
 *     relation.
 * @param {Object=} opt_thisObject Value to use as {@code this} when executing
 *     {@code mapper} function.
 * @return {Array.<Array>} A mapped new relation.
 * @nosideeffects
 * @see Array#map()
 */
kclv.Relation.Base.prototype.map = function(mapper, opt_thisObject) {
    return this.relation.map(mapper, opt_thisObject);
};

/**
 * Execute the specified function once per tuple in the relation.
 * @public
 * @const
 * @param {Function} visitor A function that execute for each tuple in the
 *     relation.
 * @param {Object=} opt_thisObject Value to use as {@code this} when executing
 *     {@code mapper} function.
 * @nosideeffects
 * @see Array#forEach()
 */
kclv.Relation.Base.prototype.forEach = function(visitor, opt_thisObject) {
    this.relation.forEach(visitor, opt_thisObject);

    return;
};

/**
 * Apply the specified reducer function against an accumulator and each value
 *     of the relation (from left-to-right) has to reduce it to a single value.
 * @public
 * @const
 * @param {Function} reducer A function to execute on each value in the
 *     relation.
 * @param {Object=} opt_initialValue An object to use as the first argument
 *     to the first call of the {@code reducer} function.
 * @return {Object} A reduced single value.
 * @nosideeffects
 * @see Array#reduce()
 */
kclv.Relation.Base.prototype.reduce = function(reducer, opt_initialValue) {
    return this.relation.reduce(reducer, opt_initialValue);
};

/**
 * (Abstract) Get a dictionary of attribute/index mapping.
 * @public
 * @throws {kclv.Exception.AbstractMethod} Always.
 */
kclv.Relation.Base.prototype.getAttributes = function() {
    throw new kclv.Exception.AbstractMethod();
};

/**
 * (Abstract) Get an array of indices of attributes.
 * @public
 * @throws {kclv.Exception.AbstractMethod} Always.
 * @see #getIndexOf
 */
kclv.Relation.Base.prototype.getIndicesOf = function() {
    throw new kclv.Exception.AbstractMethod();
};

/**
 * Get an integer of index of attribute.
 * @public
 * @param {!string} attribute A string representing index of attribute.
 * @returns {number} An integer of index of attribute.
 * @nosideeffects
 * @see #getIndicesOf
 */
kclv.Relation.Base.prototype.getIndexOf = function(attribute) {
    return this.getIndicesOf(attribute).shift();
};

/**
 * Clone itself.
 * @public
 * @const
 * @return {kclv.Relation.Base} A cloned relation object.
 * @nosideeffects
 */
kclv.Relation.Base.prototype.clone = function() {
    var cloned = Object.create(this);
    cloned.relation = this.relation.slice(); // Deeply cloned.

    return cloned;
};

// ----------------------------------------------------------------
// Relation of Materials
// ----------------------------------------------------------------

/**
 * A relation about materials (Resources and consumables).
 * @public
 * @constructor
 * @extends {kclv.Relation.Base}
 */
kclv.Relation.Materials = function() {
    kclv.Relation.Base.call(this);

    return;
};
kclv.Relation.Materials.prototype =
    Object.create(kclv.Relation.Base.prototype);
kclv.Relation.Materials.prototype.constructor = kclv.Relation.Base;

/**
 * Get a dictionary of attribute/index mapping.
 * @public
 * @override
 * @returns {Object.<string, number>} A dictionary of attribute/index mapping.
 * @nosideeffects
 */
kclv.Relation.Materials.prototype.getAttributes = function() {
    return {
        DateTime     : 0,
        Fuel         : 1,
        Ammunition   : 2,
        Steel        : 3,
        Bauxite      : 4,
        Repair       : 5,
        Construction : 6,
        Development  : 7
    };
};

/**
 * Get an array of indices of attributes.
 * @public
 * @override
 * @param {!string} material A string representing indices of attributes.
 * @param {boolean=} opt_withDateTime Whether indices contain date and time
 *     attribute.
 * @param {boolean=} opt_withRepair Whether indices contain Repair attribute.
 * @returns {Array.<number>} An array of indices of attributes.
 * @throws {kclv.Exception.InvalidMaterial} If specified material kind is
 *     invalid.
 * @nosideeffects
 */
kclv.Relation.Materials.prototype.getIndicesOf = function(
    material, opt_withDateTime, opt_withRepair
) {
    var indexOf = this.getAttributes(),
        indices;

    switch (material) {
        case 'Resources':
            indices = [
                indexOf.Fuel,
                indexOf.Ammunition,
                indexOf.Steel,
                indexOf.Bauxite
            ];
            break;
        case 'Consumables':
            indices = [
                indexOf.Repair,
                indexOf.Construction,
                indexOf.Development
            ];
            break;
        default:
            indices = [ indexOf[material] ];
    }

    if (! indices) {
        throw new kclv.Exception.InvalidMaterial(material);
    }

    if (opt_withRepair) {
        indices.push(indexOf.Repair);
    }
    if (opt_withDateTime) {
        indices.unshift(indexOf.DateTime);
    }

    return indices;
};

// ----------------------------------------------------------------
// Relation of Ships
// ----------------------------------------------------------------

/**
 * A relation about ships (Combined Fleet Girls).
 * @public
 * @constructor
 * @extends {kclv.Relation.Base}
 */
kclv.Relation.Ships = function() {
    kclv.Relation.Base.call(this);

    return;
};
kclv.Relation.Ships.prototype = Object.create(kclv.Relation.Base.prototype);
kclv.Relation.Ships.prototype.constructor = kclv.Relation.Base;

/**
 * Get a dictionary of attribute/index mapping.
 * @public
 * @override
 * @returns {Object.<string, number>} A dictionary of attribute/index mapping.
 * @nosideeffects
 */
kclv.Relation.Ships.prototype.getAttributes = function() {
    return {
        ID             : 0,
        Name           : 1,
        Classification : 2,
        Levels         : 3,
        Experiences    : 4
    };
};

/**
 * Get an array of indices of attributes.
 * @public
 * @override
 * @param {!string} attribute A string representing indices of attributes.
 * @returns {Array.<number>} An array of indices of attributes.
 * @throws {kclv.Exception.InvalidSkill} If specified skill kind is invalid.
 * @nosideeffects
 */
kclv.Relation.Ships.prototype.getIndicesOf = function(attribute) {
    var indexOf = this.getAttributes(),
        indices = [ indexOf[attribute] ];

    if (! indices) {
        throw new kclv.Exception.InvalidSkill(attribute); // TODO
    }

    return indices;
};

// ----------------------------------------------------------------
// Relation Factory
// ----------------------------------------------------------------

/**
 * A relation factory.
 *     It is an instance of the Singleton pattern (GoF) and the Flyweight
 *     pattern (GoF).
 * @public
 * @const
 * @constructor
 */
kclv.RelationFactory = ( function() {
    /**
     * The relation pool as a Flyweight object.
     * @private {Object.<string, kclv.Relation.Base>}
     */
    var pool = {};

    return {
        /**
         * Get a relation object by the specified relation name and the
         *     specified agent object. If the relation object was already
         *     created, the method returns it without another creation.
         * @public
         * @param {!string} name A name of relation.
         * @param {!kclv.Agent} agent An agent object.
         * @returns {kclv.Relation.Base} A relation object.
         */
        getInstance : function(name, agent) {
            if ( pool[name] === undefined ) {
                pool[name] = agent.buildRelation(name);
            }

            return pool[name];
        }
    };
}() );


// ================================================================
// Tables
// ================================================================

// ----------------------------------------------------------------
// Interface of Tables
// ----------------------------------------------------------------

/**
 * An interface of tables.
 * @public
 * @interface
 * @extends {kclv.PseudoInterface}
 */
kclv.TableLike = function() {
    kclv.PseudoInterface.call(this, []); // TODO

    return;
};
kclv.TableLike.prototype = Object.create(kclv.PseudoInterface.prototype);
kclv.TableLike.prototype.constructor = kclv.PseudoInterface;

// ----------------------------------------------------------------
// Namespace for Tables
// ----------------------------------------------------------------

/**
 * A namespace for tables.
 * @public
 */
kclv.Table = {};

// ----------------------------------------------------------------
// Base Table
// ----------------------------------------------------------------

/**
 * A base table.
 *     Note: The object is for the convenience of definition of a table-like
 *     object. Therefore, your object isn't necessarily have to extend the
 *     object while it implement {@code kclv.TableLike} interface.
 * @public
 * @constructor
 * @implements {kclv.TableLike}
 * @param {kclv.Relation.Base} relation A relation object as a data source of
 *     the table.
 * @param {(Array.<string>|string)} option An option of the table.
 */
kclv.Table.Base = function(relation, option) {
    /**
     * A relation object as a data source of the table.
     * @protected {!kclv.Relation.Base}
     * @const
     */
    this.relation = relation;

    /**
     * A target kind of building the table.
     * @public {string}
     * @const
     */
    this.kind = Array.isArray(option) ? option[0] : option;

    /**
     * An option of the table.
     *     It may used as sort order, frequency of candlestick chart, etc.
     * @protected {string|null}
     * @const
     */
    this.option = Array.isArray(option) ? option[1] : null;

    /**
     * A delegated formatter object.
     * @protected {kclv.Formatter}
     * @const
     */
    this.formatter = new kclv.Formatter();

    /**
     * A locale string (ISO 639) of a chart client HTML file.
     * @protected {string}
     * @const
     */
    this.locale = kclv.Configuration.get('locale');

    /**
     * Columns of the table.
     *     It is to be used by a {@code script} element in a chart client HTML
     *     file.
     * @public {Object}
     * @const
     */
    this.columns = this.buildColumns();

    /**
     * Rows of the table.
     *     It is to be used by a {@code script} element in a chart client HTML
     *     file.
     * @public {Object}
     * @const
     */
    this.rows = this.buildRows();

    /**
     * A title of the table.
     * @public {string}
     * @const
     */
    this.title = this.buildTitle();

    return;
};

/**
 * (Abstract) Build columns of the table.
 *     It may be overridden in a descendent object.
 * @protected
 * @throws {kclv.Exception.AbstractMethod} Always.
 */
kclv.Table.Base.prototype.buildColumns = function() {
    throw new kclv.Exception.AbstractMethod();
};

/**
 * (Abstract) Build rows of the table.
 *     It must be overridden in a descendent object.
 * @protected
 * @throws {kclv.Exception.AbstractMethod} Always.
 */
kclv.Table.Base.prototype.buildRows = function() {
    throw new kclv.Exception.AbstractMethod();
};

/**
 * Get the maximum value of the table by specified indices.
 *     It often works as a simple bridge to its own relation object. However,
 *     it may overridden by a subtype if it needs particular logic.
 * @public
 * @param {!(Array.<number>|string)} indices An array of indices of attributes
 *     or a string representing the indices.
 * @returns {number} The maximum value of the table.
 * @nosideeffects
 * @see #minimum
 */
kclv.Table.Base.prototype.maximum = function(indices) {
    return this.relation.maximum(indices);
};

/**
 * Get the minimum value of the table by specified indices.
 *     It often works as a simple bridge to its own relation object. However,
 *     it may overridden by a subtype if it needs particular logic.
 * @public
 * @param {!(Array.<number>|string)} indices An array of indices of attributes
 *     or a string representing the indices.
 * @returns {number} The minimum value of the table.
 * @nosideeffects
 * @see #maximum
 */
kclv.Table.Base.prototype.minimum = function(indices) {
    return this.relation.minimum(indices);
};

/**
 * Count an amount of rows.
 *     It often works as a simple bridge to its own relation object. However,
 *     it may overridden by a subtype if it needs particular logic.
 * @public
 * @returns {number} An amount of rows.
 * @nosideeffects
 */
kclv.Table.Base.prototype.count = function() {
    return this.rows.length;
};

/**
 * Build a title of the table and get it.
 * @protected
 * @returns {string} A title of the table.
 * @nosideeffects
 */
kclv.Table.Base.prototype.buildTitle = function() {
    return kclv.Configuration.get([
        'legend', this.locale, this.kind, 'title'
    ]);
};

// ----------------------------------------------------------------
// Namespace for Material Tables
// ----------------------------------------------------------------

/**
 * A namespace for material tables.
 * @public
 */
kclv.Table.Materials = {};

// ----------------------------------------------------------------
// Base Table Object for Material Tables
// ----------------------------------------------------------------

/**
 * A base table for material tables.
 * @public
 * @constructor
 * @extends {kclv.Table.Base}
 * @implements {kclv.TableLike}
 * @param {kclv.Relation.Base} relation A relation object as a data source of
 *     the table.
 * @param {(Array.<string>|string)} option An option of the table.
 */
kclv.Table.Materials.Base = function(relation, option) {
    kclv.Table.Base.call(this, relation, option);

    return;
};
kclv.Table.Materials.Base.prototype = Object.create(kclv.Table.Base.prototype);
kclv.Table.Materials.Base.prototype.constructor = kclv.Table.Base;

// ----------------------------------------------------------------
// Material Table Object to Draw a Candlestick Chart
// ----------------------------------------------------------------

/**
 * A material table to draw a candlestick chart.
 * @public
 * @constructor
 * @extends {kclv.Table.Base}
 * @implements {kclv.TableLike}
 * @param {kclv.Relation.Base} relation A relation object as a data source of
 *     the table.
 * @param {string} kind A target kind of building the table.
 * @param {Array.<string>} option An option of the table.
 *     {@code option[0]} is a material kind (a concrete material name).
 *     For example, {@code Fuel}, {@code Repair}, etc.
 *     {@code option[1]} is frequency.
 *     For example, {@code Monthly}, {@code Weekly}, etc.
 */
kclv.Table.Materials.Candlestick = function(relation, option) {
    kclv.Table.Base.call(this, relation, option);

    return;
};
kclv.Table.Materials.Candlestick.prototype =
    Object.create(kclv.Table.Materials.Base.prototype);
kclv.Table.Materials.Candlestick.prototype.constructor =
    kclv.Table.Materials.Base;

/**
 * Build columns of the table as undefined.
 *     Note: A candlestick chart has no columns.
 * @protected
 * @override
 * @nosideeffects
 */
kclv.Table.Materials.Candlestick.prototype.buildColumns = function() {
    return;
};

/**
 * Build rows of the table from its own relation object.
 *     Note: Tuples of a two-dimensional relation array must be sorted
 *     ascendingly by an attribute (an element of a tuple) of index 0
 *     (representing {@code Date}).
 * @protected
 * @override
 * @returns {Array.<Array>} Rows representing candlesticks (period and values:
 *     low, opening, closing and high value).
 * @nosideeffects
 */
kclv.Table.Materials.Candlestick.prototype.buildRows = function() {
    var indexOfValue = this.relation.getIndexOf(this.kind),
        indexOfDateTime = this.relation.getIndexOf('DateTime'),
        frequency = this.option,
        table = [];

    table.push( this.relation.reduce( function(row, tuple) {
        var current =
                new kclv.Date(tuple[indexOfDateTime]).toPeriod(frequency),
            value = tuple[indexOfValue];

        if ( row[0] === current ) { // Staying the same period.
            // Overwrite values when it was needed.
            if ( row[1] > value ) { row[1] = value; } // Low value.
            row[3] = value;                           // Closing value.
            if ( row[4] < value ) { row[4] = value; } // High value.
        } else { // Entered a new period.
            if (row.length) { // Not the first row. (row !== [])
                table.push(row); // Place the previous values with the table.
            }
            // Initialize period and values (Low, Opening, Closing and High).
            row = [ current, value, value, value, value ];
        }

        return row;
    }, [] ) ); // The last row was placed at the end.

    return table;
};

/**
 * Build a title of the table and get it.
 * @protected
 * @override
 * @returns {string} A title of the table.
 * @nosideeffects
 */
kclv.Table.Materials.Candlestick.prototype.buildTitle = function() {
    var configuration = kclv.Configuration.get([
        'legend', this.locale, kclv.Game.Materials.getKindOf(this.kind)
    ]);

    return configuration.title + ' ' +
           this.formatter.parenthesize( configuration[this.kind] );
};

// ----------------------------------------------------------------
// Material Table Object to Draw a Line Chart
// ----------------------------------------------------------------

/**
 * A material table to draw a line chart.
 * @public
 * @constructor
 * @extends {kclv.Table.Base}
 * @implements {kclv.TableLike}
 * @param {kclv.Relation.Base} relation A relation object as a data source of
 *     the table.
 * @param {string} kind A target kind of building the table.
 */
kclv.Table.Materials.Line = function(relation, kind) {
    /**
     * An opposing target kind.
     * @public {string=}
     * @const
     */
    this.opposite =
        kind === 'Resources' &&
        kclv.Configuration.get('chart.Resources.withRepair', true) ?
            'Consumables' : null;

    // Note: Lazily initializate it! (for opposite)
    kclv.Table.Materials.Base.call(this, relation, kind);

    return;
};
kclv.Table.Materials.Line.prototype =
    Object.create(kclv.Table.Materials.Base.prototype);
kclv.Table.Materials.Line.prototype.constructor = kclv.Table.Materials.Base;

/**
 * Build columns of the table from legends of material kinds.
 * @protected
 * @override
 * @returns {Object.<(string|number|Object.<string, (string|number)>)>}
 *     Columns representing date and legends of material kinds.
 * @nosideeffects
 */
kclv.Table.Materials.Line.prototype.buildColumns = function() {
    var legend = kclv.Configuration.get(['legend', this.locale]),
        header = [ legend.dateTime ];

    // TODO: strategy
    switch (this.kind) {
        case 'Resources':
            header.push(
                legend.Resources.Fuel,
                legend.Resources.Ammunition,
                legend.Resources.Steel,
                legend.Resources.Bauxite
            );
            if ( this.opposite ) {
                header.push( legend.Consumables.Repair );
            }
            break;
        case 'Consumables':
            header.push(
                legend.Consumables.Repair,
                legend.Consumables.Construction,
                legend.Consumables.Development
            );
            break;
        default:
            throw new kclv.Exception.InvalidMaterial(this.kind);
    }

    return this.formatter.quote(header);
};

/**
 * Build rows of the table from its own relation object.
 *     Note: JScript's Date#toLocaleString() doesn't accept locales.
 *     Note: JScript/JavaScript does'nt have locale setter/getter.
 * @protected
 * @override
 * @returns {Array.<Array>} Rows representing parts (points) of a lines (date
 *     and values of specified materials).
 * @nosideeffects
 */
kclv.Table.Materials.Line.prototype.buildRows = function() {
    if (this.relation.count() === 0) {
        throw new RangeError('A relation (table) has no tuple (row).');
    }

    var indexOfDateTime = this.relation.getIndexOf('DateTime');

    // Note: Use a cloned object to avoid destruct (project) a relation array.
    return this.relation.clone().
        project(
            this.relation.getIndicesOf(this.kind, true, this.opposite)
        ).
        map( function(tuple) {
            tuple[indexOfDateTime] = this.formatter.quote(
                tuple[indexOfDateTime].toLocaleString()
            );
            return tuple;
        }, this );
};

// ----------------------------------------------------------------
// Namespace for Ship Tables
// ----------------------------------------------------------------

/**
 * A namespace for ship tables.
 * @public
 */
kclv.Table.Ships = {};

// ----------------------------------------------------------------
// Base Table for Ship Tables
// ----------------------------------------------------------------

/**
 * A base table for ship tables.
 * @public
 * @constructor
 * @extends {kclv.Table.Base}
 * @implements {kclv.TableLike}
 * @param {kclv.Relation.Base} relation A relation object as a data source of
 *     the table.
 * @param {Array.<string>} option An option of the table.
 *     {@code option[0]} is an indicator of ship's skill ({@code Levels} or
 *     {@code Experiences}).
 *     {@code option[1]} is sort kind ({@code Order} of arrival or
 *     {@code Experiences}).
 * @param {boolean} hasOrder Whether rows of the table have a first column
 *     representing order.
 */
kclv.Table.Ships.Base = function(relation, option, hasOrder) {
    /**
     * Whether rows of the table have a first column representing order.
     * @protected {boolean}
     * @const
     */
    this.hasOrder = hasOrder;

    // Note: Lazily initializate it! (for hasOrder)
    kclv.Table.Base.call(this, relation, option);

    return;
};
kclv.Table.Ships.Base.prototype = Object.create(kclv.Table.Base.prototype);
kclv.Table.Ships.Base.prototype.constructor = kclv.Table.Base;

/**
 * Build columns of the table from ship classification.
 *     Note: {@code class} is a reserved word when in strict mode.
 * @protected
 * @override
 * @returns {Object.<(string|number|Object.<string, (string|number)>)>}
 *     Columns representing ship classification.
 * @nosideeffects
 */
kclv.Table.Ships.Base.prototype.buildColumns = function() {
    var legend = kclv.Configuration.get(['legend', this.locale, 'Ships']),
        label = kclv.Configuration.get('chart.Ships.abbreviate', true) ?
            'abbreviation' : 'classification';

    return Object.keys(kclv.Game.Ships.ABBREVIATION_FOR).
        map( function(shipClass) {
            var abbreviation = kclv.Game.Ships.ABBREVIATION_FOR[shipClass];

            return {
                id : abbreviation,
                label : legend[label][abbreviation],
                type : 'number'
            };
        } );
};

/**
 * Build rows of the table from its own relation object.
 *     Note: Tuples of a two-dimensional relation array must be sorted
 *     ascendingly an attribute (an element of a tuple) of index 0
 *     (representing an order of arrival).
 * @protected
 * @override
 * @returns {Array.<Array>} Rows representing scattered points (specified
 *     order, name, class and indicator of her skill: experience points or
 *     level).
 * @nosideeffects
 */
kclv.Table.Ships.Base.prototype.buildRows = function() {
    // Note: Use a cloned object to avoid destruct (sort) a relation array.
    var indexOf = this.getClassificationDictionary_(),
        relation = this.relation.clone(),
        attributeOf = this.relation.getAttributes(),
        mothballLevel =
            kclv.Configuration.get('chart.Ships.mothballLevel', true);

    if (this.option === 'Experiences') {
        relation.sort( function(a, b) {
            // Exp. 1,000,000 is Lv. 99 or 100.
            return a[attributeOf.Experiences] === b[attributeOf.Experiences] ?
                // Compare levels (100 > 99) descendingly.
                b[attributeOf.Levels] - a[attributeOf.Levels] :
                // Compare experience pionts descendingly.
                b[attributeOf.Experiences] - a[attributeOf.Experiences];
        } );
    }

    return relation.map( function(tuple, index) {
        var columns = [],
            offset = 1;

        if (mothballLevel && tuple[ attributeOf.Levels ] <= mothballLevel) {
            return { c : columns };
        }

        columns.length = this.columns.length; // It is undefined padding.
        columns.fill(null); // Explicit null padding.

        if (this.hasOrder) {
            columns[0] = {
                v : index + offset,
                f : '#' + ( index + offset ) + ':' + tuple[ attributeOf.ID ]
            };
        }

        columns[ indexOf[ tuple[ attributeOf.Classification ] ] ] = {
            v : tuple[ attributeOf[this.kind] ],
            f : tuple[ attributeOf.Name ] +
                ' Lv.' + tuple[ attributeOf.Levels ] + (
                    this.kind === 'Levels' ?
                        '' :
                        ' ' + this.formatter.parenthesize(
                            this.formatter.commify(
                                tuple[ attributeOf.Experiences ]
                            )
                        )
                )
        };

        return { c : columns };
    }, this );
};

/**
 * Get a dictionary how to place a value in an element of a row array by a
 *     ship class.
 * @private
 * @returns {Object.<string, number>} A dictionary.
 * @nosideeffects
 */
kclv.Table.Ships.Base.prototype.getClassificationDictionary_ = function() {
    var dictionary = {},
        offset = this.hasOrder ? 1 : 0;

    Object.keys(kclv.Game.Ships.ABBREVIATION_FOR).forEach( function(
        shipClass, index
    ) {
        dictionary[ kclv.Game.Ships.ABBREVIATION_FOR[shipClass] ] =
            index + offset;
    } );

    return dictionary;
};

/**
 * Get the maximum value from ships.
 *     Note: The maximum level is evaluated in light of fractional experience
 *     points except the ship reaches the maximum level.
 * @public
 * @override
 * @param {string} kind An indicator of ship's skill ({@code Levels} or
 *     {@code Experiences}).
 * @returns {number} The maximum value (level or experience points).
 * @nosideeffects
 */
kclv.Table.Ships.Base.prototype.maximum = function(kind) {
    var maximum = kclv.Table.Base.prototype.maximum.call(this, kind);

    return kind === 'Experiences' ||
           maximum === kclv.Game.Ships.EXPERIENCES.length ?
        maximum :    // The ship reaches the maximum level.
        maximum + 1; // Round up as fractional experience points to next level.
};

/**
 * Build a title of the table and get it.
 * @protected
 * @override
 * @returns {string} A title of the table.
 * @nosideeffects
 */
kclv.Table.Ships.Base.prototype.buildTitle = function() {
    var configuration = kclv.Configuration.get([
        'legend', this.locale, 'Ships'
    ]);

    return configuration.title + ' ' +
           this.formatter.parenthesize( configuration[this.kind] );
};

// ----------------------------------------------------------------
// Ship Table to Draw a Bubble Chart
// ----------------------------------------------------------------

/**
 * A ship table to draw a bubble chart.
 * @public
 * @constructor
 * @extends {kclv.Table.Base}
 * @implements {kclv.TableLike}
 * @param {kclv.Relation.Base} relation A relation object as a data source of
 *     the table.
 * @param {Array.<string>} option An option of the table.
 *     {@code option[0]} is an indicator of ship's skill ({@code Levels} or
 *     {@code Experiences}).
 *     {@code option[1]} is sort kind ({@code Order} of arrival or
 *     {@code Experiences}).
 */
kclv.Table.Ships.Bubble = function(relation, option) {
    kclv.Table.Ships.Base.call(this, relation, option, false);

    return;
};
kclv.Table.Ships.Bubble.prototype =
    Object.create(kclv.Table.Ships.Base.prototype);
kclv.Table.Ships.Bubble.prototype.constructor = kclv.Table.Ships.Base;

/**
 * Build columns of the table from ship classificatoin.
 *     Note: {@code class} is a reserved word when in strict mode.
 * @protected
 * @override
 * @returns {Array.<Object.<string, string>>} Columns of a bubble chart.
 * @nosideeffects
 */
kclv.Table.Ships.Bubble.prototype.buildColumns = function() {
    var legend = kclv.Configuration.get([
        'legend', this.locale, 'Ships', 'Bubble'
    ]);

    return [
        legend.classification,
        legend.total,
        legend.average,
        legend.rate,
        legend.practical
    ];
};

/**
 * Build rows of the table from its own relation object.
 * @protected
 * @override
 * @returns {Array.<Array<(string|number)>>} Rows of a bubble chart.
 * @nosideeffects
 */
kclv.Table.Ships.Bubble.prototype.buildRows = function() {
    var attributeOf = this.relation.getAttributes(),
        roster = {},
        threshold =
            kclv.Configuration.get('chart.Ships.vertical.level', true) || 0,
        label = kclv.Configuration.get([
            'legend', kclv.Configuration.get('locale'), 'Ships',
            kclv.Configuration.get('chart.Ships.abbreviate', true) ?
                'abbreviation' : 'classification'
        ]);

    this.relation.forEach( function(tuple) {
        var classification = tuple[attributeOf.Classification],
            level = tuple[ attributeOf.Levels ];

        if (! roster[classification]) {
            roster[classification] = [];
        }
        roster[classification].push(level);
    } );

    return Object.keys(roster).map( function(shipClass) {
        var totalNumber = roster[shipClass].length,
            practicalShips = roster[shipClass].filter( function(level) {
                return level >= threshold;
            } ),
            practicalNumber = practicalShips.length,
            // Round rate off to 2 decimal places (maximum 1.00, minimum 0.00).
            rate = Math.round( practicalNumber * 100 / totalNumber ) / 100;

        return [
            label[shipClass],
            totalNumber,
            practicalNumber ? // Avoid division by zero.
                Math.round( practicalShips.reduce( function(sum, level) {
                    return sum + level;
                } ) / practicalNumber ) : 0,
            {
                v : rate,
                f : rate * 100 + '%'
            },
            practicalNumber
        ];
    } );
};

/**
 * Get the maximum value of average levels.
 * @public
 * @param {!(Array.<number>|string)} indices An array of indices of attributes
 *     or a string representing the indices.
 * @returns {number} The maximum value (an average level).
 * @nosideeffects
 * @see #minimum
 */
kclv.Table.Ships.Bubble.prototype.maximum = function(indices) {
    if (! Array.isArray(indices) ) {
        indices = this.getIndicesOf_(indices);
    }

    return kclv.Array.maximum(this.rows, indices);
};

/**
 * Get the minimum value of average levels.
 * @public
 * @param {!(Array.<number>|string)} indices An array of indices of attributes
 *     or a string representing the indices.
 * @returns {number} The minimum value (an average level).
 * @nosideeffects
 * @see #maximum
 */
kclv.Table.Ships.Bubble.prototype.minimum = function(indices) {
    if (! Array.isArray(indices) ) {
        indices = this.getIndicesOf_(indices);
    }

    return kclv.Array.minimum(this.rows, indices);
};

/**
 * Get an array of indices of attributes.
 * @private
 * @param {!string} attribute A string representing indices of attributes.
 * @returns {Array.<number>} An array of indices of attributes.
 * @throws {Error} If specified attribute is invalid. (TODO)
 * @nosideeffects
 */
kclv.Table.Ships.Bubble.prototype.getIndicesOf_ = function(attribute) {
    switch (attribute) {
        case 'TotalShipNumber':
            return [1];
        case 'AverageLevel':
            return [2];
        default:
            throw new Error(
                'Specified attribute (' + attribute + ') is invalid.'
            );
    }
};

/**
 * Build a title of the table and get it.
 * @protected
 * @override
 * @returns {string} A title of the table.
 * @nosideeffects
 */
kclv.Table.Ships.Bubble.prototype.buildTitle = function() {
    return kclv.Configuration.get([
        'legend', this.locale, 'Ships', 'Bubble', 'title'
    ]);
};

// ----------------------------------------------------------------
// Ship Table to Draw a Scatter Chart
// ----------------------------------------------------------------

/**
 * A ship table to draw a scatter chart.
 * @public
 * @constructor
 * @extends {kclv.Table.Base}
 * @implements {kclv.TableLike}
 * @param {kclv.Relation.Base} relation A relation object as a data source of
 *     the table.
 * @param {Array.<string>} option An option of the table.
 *     {@code option[0]} is an indicator of ship's skill ({@code Levels} or
 *     {@code Experiences}).
 *     {@code option[1]} is sort kind ({@code Order} of arrival or
 *     {@code Experiences}).
 */
kclv.Table.Ships.Scatter = function(relation, option) {
    kclv.Table.Ships.Base.call(this, relation, option, true);

    return;
};
kclv.Table.Ships.Scatter.prototype =
    Object.create(kclv.Table.Ships.Base.prototype);
kclv.Table.Ships.Scatter.prototype.constructor = kclv.Table.Ships.Base;

/**
 * Build columns of the table from ship classificatoin.
 *     Note: {@code class} is a reserved word when in strict mode.
 * @protected
 * @override
 * @returns {Object.<(string|number|Object.<string, (string|number)>)>}
 *     Columns representing order and ship classification.
 * @nosideeffects
 */
kclv.Table.Ships.Scatter.prototype.buildColumns = function() {
    var columns = kclv.Table.Ships.Base.prototype.buildColumns.call(this);

    columns.unshift( {
        id: 'Order',
        label: 'Order of ' + this.option.toLowerCase(),
        type: 'number'
    } );

    return columns;
};

// ----------------------------------------------------------------
// Ship Table to Draw a Histogram
// ----------------------------------------------------------------

/**
 * A ship table to draw a histogram.
 *     It is a simple subtype of {@code kclv.Table.Ships.Base} at the moment.
 * @public
 * @constructor
 * @extends {kclv.Table.Base}
 * @implements {kclv.TableLike}
 * @param {kclv.Relation.Base} relation A relation object as a data source of
 *     the table.
 * @param {string} option An option of the table.
 *     It is an indicator of ship's skill ({@code Levels} or
 *     {@code Experiences}).
 */
kclv.Table.Ships.Histogram = function(relation, option) {
    kclv.Table.Ships.Base.call(this, relation, option, false);

    return;
};
kclv.Table.Ships.Histogram.prototype =
    Object.create(kclv.Table.Ships.Base.prototype);
kclv.Table.Ships.Histogram.prototype.constructor = kclv.Table.Ships.Base;


// ================================================================
// Charts
// ================================================================

// ----------------------------------------------------------------
// Interface of Charts
// ----------------------------------------------------------------

/**
 * An interface of charts.
 * @public
 * @interface
 * @extends {kclv.PseudoInterface}
 */
kclv.ChartLike = function() {
    kclv.PseudoInterface.call(this, []); // TODO

    return;
};
kclv.ChartLike.prototype = Object.create(kclv.PseudoInterface.prototype);
kclv.ChartLike.prototype.constructor = kclv.PseudoInterface;

// ----------------------------------------------------------------
// Namespace for Charts
// ----------------------------------------------------------------

/**
 * A namespace for charts.
 * @public
 */
kclv.Chart = {};

// ----------------------------------------------------------------
// Base Chart
// ----------------------------------------------------------------

/**
 * A base chart.
 *     Note: The object is for the convenience of definition of a chart-like
 *     object. Therefore, your object isn't necessarily have to extend the
 *     object while it implement {@code kclv.ChartLike} interface.
 * @public
 * @constructor
 * @implements {kclv.ChartLike}
 * @param {string} name A name of the chart.
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Base = function(name, table) {
    /**
     * A name of the chart.
     * @private {string}
     * @const
     */
    this.name_ = name;

    /**
     * A table object as a data source of the
     *     chart.
     * @public {kclv.Table.Base}
     * @const
     */
    this.table = table;

    /**
     * An Option for the chart.
     *     It is to be used by a {@code script} element in a chart client HTML
     *     file.
     * @public {Object.<string, *>}
     * @const
     */
    this.option = this.buildOption();

    /**
     * An inscription object.
     * @public {kclv.Inscription}
     * @const
     */
    this.inscription = new kclv.Inscription();

    return;
};

/**
 * Build and get a basic option for the chart.
 * @protected
 * @param {Object=} opt_configuration Configuration about the drowing chart.
 * @returns {Object.<string, *>} A basic option for the chart.
 * @nosideeffects
 */
kclv.Chart.Base.prototype.buildOption = function(opt_configuration) {
    var option = {};

    this.setOption(option, 'redraw', kclv.Configuration.get('chart'));
    option.vertical = {};
    option.horizontal = {};

    if (! opt_configuration) {
        return option;
    }

    if (opt_configuration.vertical) {
        this.setOption(
            option.vertical, 'gridlines', opt_configuration.vertical
        );
        this.setOption(
            option.vertical, 'minorGridlines', opt_configuration.vertical
        );
    }

    if (opt_configuration.horizontal) {
        this.setOption(
            option.horizontal, 'gridlines', opt_configuration.horizontal
        );
        this.setOption(
            option.horizontal, 'minorGridlines', opt_configuration.horizontal
        );
    }

    return option;
};

/**
 * Set a value into the specified (branch of) option tree from the specified
 *     (branch of) configuration tree.
 * @protected
 * @param {Object.<string, *>} option A (partial branch of) option tree about
 *     the drawing chart.
 * @param {string} key A name of the specified option tree (and the specified
 *     configuration tree).
 * @param {Object.<string, *>} configuration A (partial branch of)
 *     configuration tree about the drowing chart.
 * @param {string=} opt_configurationKey A name of the specified configuration
 *     tree. If it is not specified, it uses {@code key}.
 */
kclv.Chart.Base.prototype.setOption = function(
    option, key, configuration, opt_configurationKey
) {
    if (configuration === undefined) {
        return;
    }

    opt_configurationKey = opt_configurationKey || key;
    var value = configuration[opt_configurationKey];

    if (value !== undefined) {
        option[key] = value;
    }

    return;
};

/**
 * Calculate a threshold ({@code maximum} and {@code minimum}) value.
 * @protected
 * @param {Object} configuration Configuration about the drowing chart.
 * @param {string} direction An axis of the table.
 *     It is {@code horizontal} or {@code vertical}.
 * @param {string} edge An edge of the range.
 *     It is {@code maximum} or {@code minimum}.
 * @param {string=} opt_kind A target kind of building the table.
 * @returns {number} A threshold value.
 * @nosideeffects
 */
kclv.Chart.Base.prototype.getThreshold = function(
    configuration, direction, edge, opt_kind
) {
    if (
        configuration[direction] !== undefined &&
        typeof configuration[direction][edge] === 'number'
    ) {
        return configuration[direction][edge];
    }

    if (direction === 'vertical') {
        return this.table[edge](opt_kind);
    }

    return edge === 'maximum' ? this.table.count() : 1;
};

/**
 * Build ticks on Y-axis of a chart as array of numbers.
 *     Note: It overrites {@code this.option.maximum} and
 *     {@code this.option.maximum} as a side effect.
 *     Note: Y2-axis (ex. an instant repair on a resources chart) does not have
 *     an unique ticks. It follow Y1-axis.
 * @protected
 * @const
 * @param {Object.<string, *>} option A proper option.
 *     Note: Values (maximum and minimum) were temporarily converted into
 *     indices in advance.
 * @param {number} step A step of ticks of Y-axis on a line chart.
 * @param {Array.<number>=} opt_array A criterial array of ticks.
 * @returns {Array.<number>} Ticks of Y-axis on a line chart.
 */
kclv.Chart.Base.prototype.buildTicks = function(option, step, opt_array) {
    // Get the first tick.
    var ticks = option.minimum > 0 ?
        [ option.minimum - option.minimum % step ] : [0];

    // Get ticks. Note: JavaScript does not support a negative index.
    do {
        ticks.push(ticks[ticks.length - 1] + step);
    } while (ticks[ticks.length - 1] < option.maximum);

    // Convert back indices into values.
    if (opt_array) {
        // Ex. Lv.1 (Exp.0), 5(1000), 10(4500), 15(10500), 20(19000), ...
        ticks = ticks.map( function(tick) {
            return opt_array[tick - 1];
        } );
        ticks[0] = ticks[0] || 0;
        if (ticks[ticks.length - 1] === undefined) {
            ticks[ticks.length - 1] = opt_array[opt_array.length - 1];
        }
    }

    // Overwrite range (window) of Y-axis or scale of X-axis.
    option.minimum = ticks[0];
    option.maximum = ticks[ticks.length - 1];

    return ticks;
};

// ----------------------------------------------------------------
// Annotation Chart
// ----------------------------------------------------------------

/**
 * An annotation chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Annotation = function(table) {
    kclv.Chart.Base.call(this, 'Annotation', table);

    return;
};
kclv.Chart.Annotation.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Annotation.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Bar Chart
// ----------------------------------------------------------------

/**
 * A bar chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Bar = function(table) {
    kclv.Chart.Base.call(this, 'Bar', table);

    return;
};
kclv.Chart.Bar.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Bar.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Bubble Chart
// ----------------------------------------------------------------

/**
 * A bubble chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Bubble = function(table) {
    kclv.Chart.Base.call(this, 'Bubble', table);

    return;
};
kclv.Chart.Bubble.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Bubble.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Calendar Chart
// ----------------------------------------------------------------

/**
 * A calendar chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Calendar = function(table) {
    kclv.Chart.Base.call(this, 'Calendar', table);

    // For soties, ...

    return;
};
kclv.Chart.Calendar.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Calendar.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Candlestick Chart
// ----------------------------------------------------------------

/**
 * A candlestick chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {!kclv.Table.Materials.Candlestick} table A table object as a data
 *     source of the chart.
 */
kclv.Chart.Candlestick = function(table) {
    kclv.Chart.Base.call(this, 'Candlestick', table);

    return;
};
kclv.Chart.Candlestick.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Candlestick.prototype.constructor = kclv.Chart.Base;

/**
 * Build and get an option for the candlestick chart.
 * @protected
 * @override
 * @returns {Object.<string, *>} An option for the candlestick chart.
 * @nosideeffects
 */
kclv.Chart.Candlestick.prototype.buildOption = function() {
    var material = this.table.kind,
        kind = kclv.Game.Materials.getKindOf(material),
        configuration = kclv.Configuration.get(['chart', kind]),
        option =
            kclv.Chart.Base.prototype.buildOption.call(this, configuration);

    option.vertical.maximum =
        this.getThreshold(configuration, 'vertical', 'maximum', material);
    option.vertical.minimum =
        this.getThreshold(configuration, 'vertical', 'minimum', material);

    if (configuration.vertical) {
        if (configuration.vertical.step) {
            option.vertical.ticks =
                this.buildTicks(option.vertical, configuration.vertical.step);
        }
        if (configuration.vertical.level) {
            option.vertical.baseline = kclv.Game.Materials.getCeilingOf(
                kind, configuration.vertical.level
            );
        }
    }

    this.setOption(option, 'hollowIsRising', kclv.Configuration.get('chart'));

    return option;
};

// ----------------------------------------------------------------
// Column Chart
// ----------------------------------------------------------------

/**
 * A column chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Column = function(table) {
    kclv.Chart.Base.call(this, 'Column', table);

    return;
};
kclv.Chart.Column.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Column.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Diff Chart
// ----------------------------------------------------------------

/**
 * A diff chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Diff = function(table) {
    kclv.Chart.Base.call(this, 'Diff', table);

    return;
};
kclv.Chart.Diff.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Diff.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Histogram
// ----------------------------------------------------------------

/**
 * A histogram.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {!kclv.Table.Ships.Histogram} table A table object as a data source
 *     of the chart.
 */
kclv.Chart.Histogram = function(table) {
    kclv.Chart.Base.call(this, 'Histogram', table);

    return;
};
kclv.Chart.Histogram.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Histogram.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Interval Chart
// ----------------------------------------------------------------

/**
 * An interval chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Interval = function(table) {
    kclv.Chart.Base.call(this, 'Interval', table);

    return;
};
kclv.Chart.Interval.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Interval.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Line Chart
// ----------------------------------------------------------------

/**
 * A line chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {!kclv.Table.Materials.Line} table A data source of the chart.
 */
kclv.Chart.Line = function(table) {
    kclv.Chart.Base.call(this, 'Line', table);

    return;
};
kclv.Chart.Line.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Line.prototype.constructor = kclv.Chart.Base;

/**
 * Build a chart option.
 *     It is to be used by a {@code script} element in a chart client HTML
 *     file.
 * @protected
 * @override
 * @nosideeffects
 */
kclv.Chart.Line.prototype.buildOption = function() {
    var kind = this.table.kind, //TODO
        configuration = kclv.Configuration.get(['chart', kind]),
        option =
            kclv.Chart.Base.prototype.buildOption.call(this, configuration);

    option.vertical.maximum =
        this.getThreshold(configuration, 'vertical', 'maximum', kind);
    option.vertical.minimum =
        this.getThreshold(configuration, 'vertical', 'minimum', kind);

    if (configuration.vertical) {
        if (configuration.vertical.step > 0) {
            option.vertical.ticks =
                this.buildTicks(option.vertical, configuration.vertical.step);
        }
        if (configuration.vertical.level > 0) {
            option.vertical.baseline = kclv.Game.Materials.getCeilingOf(
                kind, configuration.vertical.level
            );
        }
    }

    if (this.table.opposite) {
        // Note: Do not call getThreshold() because it maybe unnecessary.
        this.setOption(
            option.vertical,
            'opposingBaseline',
            kclv.Configuration.get(
                ['chart', this.table.opposite, 'vertical'], true
            ),
            'minimum'
        );
    }

    // TODO: Horizontal (X-axis) ticks. (Monthly or Weekly or Daily ...)

    return option;
};

// ----------------------------------------------------------------
// Pie Chart
// ----------------------------------------------------------------

/**
 * A pie chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Pie = function(table) {
    kclv.Chart.Base.call(this, 'Pie', table);

    return;
};
kclv.Chart.Pie.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Pie.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Sankey Chart
// ----------------------------------------------------------------

/**
 * A sankey chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Sankey = function(table) {
    kclv.Chart.Base.call(this, 'Sankey', table);

    return;
};
kclv.Chart.Sankey.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Sankey.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Scatter Chart
// ----------------------------------------------------------------

/**
 * A scatter chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {!kclv.Table.Ships.Scatter} table A table object as a data source of
 *     the chart.
 */
kclv.Chart.Scatter = function(table) {
    kclv.Chart.Base.call(this, 'Scatter', table);

    return;
};
kclv.Chart.Scatter.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Scatter.prototype.constructor = kclv.Chart.Base;

/**
 * Calculate a threshold ({@code maximum} and {@code minimum}) value.
 *     Note: If {@code kind} is {@code Experiences}, the returned value is
 *     converted to experience points (from the table or the specified level).
 * @protected
 * @override
 * @param {Object} configuration Configuration about the drowing chart.
 * @param {string} direction An axis of the table.
 *     It is {@code horizontal} or {@code vertical}.
 * @param {string} edge An edge of the range.
 *     It is {@code maximum} or {@code minimum}.
 * @param {string} kind A target kind of building the table.
 * @returns {number} A threshold value.
 * @nosideeffects
 */
kclv.Chart.Scatter.prototype.getThreshold = function(
    configuration, direction, edge, kind
) {
    if (
        kind === 'Experiences' &&
        configuration[direction] !== undefined &&
        typeof configuration[direction][edge] === 'number'
    ) {
        return kclv.Game.Ships.EXPERIENCES[configuration[direction][edge] - 1];
    }

    return kclv.Chart.Base.prototype.getThreshold.apply(this, arguments);
};

/**
 * Build a chart option.
 *     It is to be used by a {@code script} element in a chart client HTML
 *     file.
 * @protected
 * @override
 * @nosideeffects
 */
kclv.Chart.Scatter.prototype.buildOption = function() {
    var kind = this.table.kind,
        configuration = kclv.Configuration.get('chart.Ships'),
        option =
            kclv.Chart.Base.prototype.buildOption.call(this, configuration),
        experiences = kclv.Game.Ships.EXPERIENCES,
        step = null;

    option.vertical.maximum =
        this.getThreshold(configuration, 'vertical', 'maximum', kind);
    option.vertical.minimum =
        this.getThreshold(configuration, 'vertical', 'minimum', kind);

    if (configuration.vertical) {
        if (configuration.vertical.step > 0) {
            step = configuration.vertical.step;
            if (kind === 'Experiences' && option.vertical.minorGridlines > 0) {
                step =
                    Math.floor( step / (option.vertical.minorGridlines + 1) );
                option.vertical.minorGridlines = null;
            }

            // Note: Experiences (as values of experiences array: maximum and
            // minimum) were temporarily converted into levels (as indices+1).
            option.vertical.maximum = this.getThreshold(
                configuration, 'vertical', 'maximum', 'Levels'
            );
            option.vertical.minimum = this.getThreshold(
                configuration, 'vertical', 'minimum', 'Levels'
            );

            // Note: Levels (as indices + 1) are converted back into
            // experiences (as values of experiences array).
            option.vertical.ticks = this.buildTicks(
                option.vertical,
                step,
                kind === 'Experiences' ? experiences : null
            );
        }
        if (configuration.vertical.level) {
            option.vertical.baseline = kind === 'Levels' ?
                configuration.vertical.level :
                experiences[ configuration.vertical.level - 1 ];
        }
    }

    if (configuration.horizontal) {
        option.horizontal.maximum =
            this.getThreshold(configuration, 'horizontal', 'maximum');
        option.horizontal.minimum =
            this.getThreshold(configuration, 'horizontal', 'minimum');
        if (configuration.horizontal.step > 0) {
            option.horizontal.ticks = this.buildTicks(
                option.horizontal, configuration.horizontal.step
            );
        }
    }

    return option;
};

// ----------------------------------------------------------------
// Stepped Area Chart
// ----------------------------------------------------------------

/**
 * A stepped area chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.SteppedArea = function(table) {
    kclv.Chart.Base.call(this, 'SteppedArea', table);

    return;
};
kclv.Chart.SteppedArea.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.SteppedArea.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Timeline
// ----------------------------------------------------------------

/**
 * A timeline.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Timeline = function(table) {
    kclv.Chart.Base.call(this, 'Timeline', table);

    return;
};
kclv.Chart.Timeline.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Timeline.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Tree Map Chart
// ----------------------------------------------------------------

/**
 * A tree map chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.TreeMap = function(table) {
    kclv.Chart.Base.call(this, 'TreeMap', table);

    return;
};
kclv.Chart.TreeMap.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.TreeMap.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Trendline
// ----------------------------------------------------------------

/**
 * A trendline.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Trendline = function(table) {
    kclv.Chart.Base.call(this, 'Trendline', table);

    return;
};
kclv.Chart.Trendline.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Trendline.prototype.constructor = kclv.Chart.Base;


// ================================================================
// Template
// ================================================================

/**
 * A wrapper for a template engine (JsViews).
 * @public
 * @constructor
 * @param {!Array.<string>} names Fragments of the chart name.
 */
kclv.Template = function(names) {
    /**
     * A delegated file reader object to read a template file.
     * @private {kclv.Stream}
     */
    this.stream_ = new kclv.Stream();

    /**
     * A delegated template engine (JsViews) object.
     * @private {Object}
     */
    this.engine_ = this.buildEngine_(names);

    return;
};


/**
 * Render contents for a chart client HTML file from template.
 * @public
 * @param {!Object} complements Fill-in a template form.
 * @returns {string} A rendered string.
 */
kclv.Template.prototype.render = function(complements) {
    return this.engine_.render(complements);
};

/**
 * Build and get a delegated template engin object.
 *     TODO: jsviews object prototype.
 * @private
 * @param {!Array.<string>} names Fragments of the chart name.
 * @returns {Object} Template engine (JsViews) object.
 * @nosideeffects
 */
kclv.Template.prototype.buildEngine_ = function(names) {
    return jsviews.templates({
        markup : this.readTemplate_(names),
        templates : {
            meta : this.readTemplate_(['meta']),
            body : this.readTemplate_(['body'])
        },
        helpers : {
            formatter : new kclv.Formatter()
        }
    });
};

/**
 * Get a template string from the specified template file. It's a syntax suger.
 * @private
 * @param {!string} kind Template kind.
 * @returns {string} A template string.
 * @nosideeffects
 */
kclv.Template.prototype.readTemplate_ = function(names) {
    return this.stream_.readFile(
        kclv.Configuration.get('chart.path.template') + '/' +
        names.join('.') + '.html'
    );
};


// ================================================================
// Visualizer
// ================================================================

/**
 * Visualizer, so-called "main" object.
 *     It is not a "service model" (DDD) but just a "service layer" (PoEAA).
 * @public
 * @constructor
 */
kclv.Visualizer = function() {
    /**
     * A delegated file writer object to write a chart client file.
     * @private {kclv.Stream}
     */
    this.stream_ = new kclv.Stream();

    return;
};

/**
 * (Integration) Create a chart client HTML file.
 * @public
 * @param {!Object.<string, string>} directive A directive of the
 *     visualization. It must have {@code agent}, {@code relation},
 *     {@code chart} and {@code option}.
 * @see ../help.html (User's guide)
 */
kclv.Visualizer.prototype.visualize = function(directive) {
    var agent = kclv.Factory.getInstance(
            kclv.Agent,
            directive.agent
        ),
        relation = kclv.RelationFactory.getInstance(
            directive.relation,
            agent
        ),
        table = kclv.Factory.getInstance(
            kclv.Table,
            [ directive.relation, directive.chart ],
            [ relation, directive.option ]
        ),
        chart = kclv.Factory.getInstance(
            kclv.Chart,
            directive.chart,
            [ table ]
        ),
        template = new kclv.Template(
            [ directive.relation, directive.chart ]
        ),
        path = kclv.Configuration.get('chart.path.chart') + '/' +
                   [
                       directive.agent,
                       directive.relation,
                       directive.chart,
                       directive.option
                   ].join('.') + '.html';

    this.stream_.writeFile( path, template.render(chart) );

    return;
};

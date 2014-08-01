/**
 * @fileOverview A partical object for a pseudo-interface.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

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

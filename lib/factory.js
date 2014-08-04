/**
 * @fileOverview A partical object for a factory.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

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

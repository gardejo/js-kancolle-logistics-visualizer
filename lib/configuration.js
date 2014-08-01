/**
 * @fileOverview A partical object for a configuration.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

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

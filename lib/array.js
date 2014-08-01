/**
 * @fileOverview A partical object for an array helper.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

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
 * @see ./polyfill.js
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
         * @see #getThreshold_
         * @see #minimum
         */
        maximum : function(array, indices) {
            return this.getThreshold_.call(this, array, indices, 'maximum');
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
         * @see #getThreshold_
         * @see #maximum
         */
        minimum : function(array, indices) {
            return this.getThreshold_.call(this, array, indices, 'minimum');
        },

        /**
         * (Template) Get the threshold (maximum or minimum) value in specified
         *     elements (by indices) of the specified two-dimensional array.
         * @private
         * @param {Array.<Array>} array An array which targeted an examination.
         * @param {!(Array.<number>|string)} indices Targeted indices or string
         *     representing it.
         * @param {string} edge An edge of the range.
         *     It is {@code maximum} or {@code minimum}.
         * @returns {number} The threshold (maximum or minimum) value.
         * @nosideeffects
         */
        getThreshold_ : function(array, indices, edge) {
            var edgeMethod = edge === 'maximum' ? 'max' : 'min';

            return array.reduce( function(threshold, row) {
                /*
                // TODO: Return threshold (previous value) if 'NaN'.
                var candidate = Math[edgeMethod].apply(null, columns);
                return typeof candidate === 'number' ? candidate : threshold;
                */
                return Math[edgeMethod].apply(
                    null,
                    kclv.Array.values(row, indices).filter( function(column) {
                        return column !== null;
                    } ).concat(threshold)
                );
            }, edge === 'maximum' ? -Infinity : +Infinity );
        }
    };
}() );

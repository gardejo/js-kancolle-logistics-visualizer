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
         * @param {boolean=} opt_allowOutOfRange Whether it allows an
         *     out-of-range index.
         * @throws {RangeError} If invalid array index was specified.
         * @nosideeffects
         * @example
         *     kclv.Array.values([1,2,3,4], [1,3]); // becomes [2,4]
         *     kclv.Array.values([5,6,7,8], [2,0]); // becomes [7,5]
         */
        values : function(array, indices, opt_allowOutOfRange) {
            return indices.map( function(index) {
                if (this.length <= index) {
                    if (opt_allowOutOfRange) {
                        return null;
                    } else {
                        throw new RangeError('Invalid array length: ' + index);
                    }
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
         * @param {Object=} opt_resolver An object to convert names of indices
         *     into numbers of indices.
         * @returns {number} The maximum value.
         * @nosideeffects
         * @see #getThreshold_
         * @see #minimum
         */
        maximum : function(array, indices, opt_resolver) {
            return this.getThreshold_.call(
                this, array, indices, 'max', opt_resolver
            );
        },

        /**
         * Get the minimum value in specified elements (by indices) of the
         *     specified two-dimensional array.
         * @public
         * @param {Array.<Array>} array An array which targeted an examination.
         * @param {!(Array.<number>|string)} indices Targeted indices or string
         *     representing it.
         * @param {Object=} opt_resolver An object to convert names of indices
         *     into numbers of indices.
         * @returns {number} The minimum value.
         * @nosideeffects
         * @see #getThreshold_
         * @see #maximum
         */
        minimum : function(array, indices, opt_resolver) {
            return this.getThreshold_.call(
                this, array, indices, 'min', opt_resolver
            );
        },

        /**
         * (Template) Get the threshold (maximum or minimum) value in specified
         *     elements (by indices) of the specified two-dimensional array.
         * @private
         * @param {Array.<Array>} array An array which targeted an examination.
         * @param {!(Array.<number>|string)} indices Targeted indices or string
         *     representing it.
         * @param {string} edgeMethod A name of method to get an edge of the
         *     range. It is {@code max} or {@code min}.
         * @param {Object=} opt_resolver An object to convert names of indices
         *     into numbers of indices.
         * @returns {number} The threshold (maximum or minimum) value.
         * @nosideeffects
         */
        getThreshold_ : function(array, indices, edgeMethod, opt_resolver) {
            if (! Array.isArray(indices) && opt_resolver) {
                indices = opt_resolver.getIndicesOf(indices);
            }

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
            }, edgeMethod === 'max' ? -Infinity : +Infinity );
        }
    };
}() );

/**
 * @fileOverview A partical object for attribute projectors.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

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
// Materials Attribute Projector by the Specified Indices
// ----------------------------------------------------------------

/**
 * A material attribute projector extracting some attributes.
 *     Note: The object is for the convenience of definition of a projector
 *     object. Therefore, your object isn't necessarily have to extend the
 *     object while it implement {@code kclv.ProjectorLike} interface.
 * @public
 * @constructor
 * @param {number} offset An offset to attributes (indices) of a tuple in the
 *     iterating two-dimensional relation array.
 * @implements {kclv.ProjectorLike}
 */
kclv.Projector.Materials.Threshold = function(offset) {
    /**
     * Attributes (indices) of a tuple in the iterating two-dimensional
     *     relation array.
     * @protected {Array.<number>}
     */
    this.attributes = [
         0  // Date & Time.
    ].concat([
         1, // Fuel.
         3, // Ammunition.
         5, // Steel.
         7, // Bauxite.
         9, // Repair.
        11, // Construction.
        13, // Development.
        15  // Improvement. Note: Not yet implemented (w/o LogbookEx).
    ].map( function(index) {
        return index + offset;
    } ));

    return;
};

/**
 * (Callback) Get an array from extracted some elements of the specified tuple.
 *     It is a callback function as a projectile.
 * @public
 * @override
 * @this {kclv.Projector.Materials.Threshold}
 * @param {!Array.<(string|number)>} tuple A tuple (an one-dimensional array)
 *     of the iterating two-dimensional relation array.
 * @returns {Array} An array from extracted elements of the specified tuple.
 * @nosideeffects
 */
kclv.Projector.Materials.Threshold.prototype.project = function(tuple) {
    return kclv.Array.values(tuple, this.attributes, true);
};

// ----------------------------------------------------------------
// Materials Attribute Projector by High-Values
// ----------------------------------------------------------------

/**
 * A material attribute projector extracting high-value attributes.
 *     Caveat: It works right only for agent KCRDB.
 * @public
 * @constructor
 * @extends {kclv.Projector.Materials.Threshold}
 * @implements {kclv.ProjectorLike}
 */
kclv.Projector.Materials.High = function() {
    kclv.Projector.Materials.Threshold.call(this, 1);

    return;
};
kclv.Projector.Materials.High.prototype =
    Object.create(kclv.Projector.Materials.Threshold.prototype);
kclv.Projector.Materials.High.prototype.constructor =
    kclv.Projector.Materials.Threshold;

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
        Math.round( ( tuple[13] + tuple[14] ) / 2 ), // Development.
        (
            // Improvement. Note: Not yet implemented (w/o LogbookEx).
            Number.isInteger(tuple[15]) && Number.isInteger(tuple[16]) ?
                Math.round( ( tuple[15] + tuple[16] ) / 2 ) : null
        )
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
 * @extends {kclv.Projector.Materials.Threshold}
 * @implements {kclv.ProjectorLike}
 */
kclv.Projector.Materials.Low = function() {
    kclv.Projector.Materials.Threshold.call(this, 0);

    return;
};
kclv.Projector.Materials.Low.prototype =
    Object.create(kclv.Projector.Materials.Threshold.prototype);
kclv.Projector.Materials.Low.prototype.constructor =
    kclv.Projector.Materials.Threshold;

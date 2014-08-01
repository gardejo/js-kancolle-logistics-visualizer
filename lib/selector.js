/**
 * @fileOverview A partical object for tuple selectors.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

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

/**
 * @fileOverview A partical object for tables.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

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

    // Ensure this.kind and this.option are valid.
    this.ensureValidDirective();

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
 * Ensure the specified directive is valid, otherwise throw an exception.
 * @protected
 * @throws {kclv.Exception.InvalidDirective} If the specified directive is
 *     invalid.
 * @nosideeffects
 */
kclv.Table.Base.prototype.ensureValidDirective = function(
    opt_validKinds, opt_validOptions
) {
    var alignments = {
        kind   : opt_validKinds,
        option : opt_validOptions
    };

    for (var validatee in alignments) {
        if (! alignments[validatee]) {
            continue;
        }
        if ( alignments[validatee].indexOf(this[validatee]) < 0 ) {
            throw new kclv.Exception.InvalidDirective(
                this[validatee], alignments[validatee]
            );
        }
    }

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
 * (Abstract) Build a title of the table and get it.
 *     It must be overridden in a descendent object.
 * @protected
 * @throws {kclv.Exception.AbstractMethod} Always.
 */
kclv.Table.Base.prototype.buildTitle = function() {
    throw new kclv.Exception.AbstractMethod();
};

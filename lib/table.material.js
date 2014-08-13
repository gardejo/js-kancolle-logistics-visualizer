/**
 * @fileOverview A partical object for tables of materials.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

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

/**
 * Ensure a relation has some tuple, otherwise throw an exception.
 * @protected
 * @const
 * @throws {RangeError} If a relation has no tuple.
 * @nosideeffects
 */
kclv.Table.Materials.Base.prototype.ensureTupleExisted = function() {
    if (this.relation.count() === 0) {
        throw new RangeError('A relation (table) has no tuple (row).');
    }

    return;
};

/**
 * Build a title of the table and get it.
 * @protected
 * @override
 * @returns {string} A title of the table.
 * @nosideeffects
 */
kclv.Table.Materials.Base.prototype.buildTitle = function() {
    return kclv.Configuration.get([
        'legend',
        this.locale,
        kclv.Game.Materials.getKindOf(this.kind),
        'title'
    ]);
};

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
    this.ensureTupleExisted();

    var indexOfValue = this.relation.getIndexOf(this.kind),
        indexOfDateTime = this.relation.getIndexOf('DateTime'),
        frequency = this.option,
        table = [];

    table.push( this.relation.reduce( function(row, tuple) {
        var current =
                new kclv.Date(tuple[indexOfDateTime]).toPeriod(frequency),
            value = tuple[indexOfValue];

        if (value === null) {
            return row; // Interpolate null value for "Sandanshiki Kanpan".
        }

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
            'Repair' : null;

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
        header = [ legend.dateTime ],
        MATERIALS_OF = kclv.Game.Materials.MATERIALS_OF;

    if ( MATERIALS_OF[this.kind] ) {
        header = header.concat(
            MATERIALS_OF[this.kind].map( function(material) {
                return legend[this.kind][material];
            }, this )
        );
    } else {
        header.push(
            // It may throw an exception (Error).
            legend[ kclv.Game.Materials.getKindOf(this.kind) ][this.kind]
        );
    }

    if (this.opposite) {
        header.push(
            legend[kclv.Game.Materials.getKindOf(this.opposite)][this.opposite]
        );
    }

    return header;
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
    this.ensureTupleExisted();

    var indexOfDateTime = this.relation.getIndexOf('DateTime');

    // Note: Use a cloned object to avoid destruct (project) a relation array.
    return this.relation.clone().
        project(
            this.relation.getIndicesOf(this.kind, true, this.opposite)
        ).
        map( function(tuple) {
            tuple[indexOfDateTime] = tuple[indexOfDateTime].toLocaleString();
            return tuple;
        } );
};

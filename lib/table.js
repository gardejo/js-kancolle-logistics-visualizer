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
        'legend',
        this.locale,
        kclv.Game.Materials.getKindOf(this.kind),
        'title'
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
            header.push(
                legend[ kclv.Game.Materials.getKindOf(this.kind) ][this.kind]
            );
    }

    if (header.length === 1) {
        throw new kclv.Exception.InvalidMaterial(this.kind);
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
            tuple[indexOfDateTime] = tuple[indexOfDateTime].toLocaleString();
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
    var indexOf = this.getClassificationDictionary_(),
        attributeOf = this.relation.getAttributes(),
        relation = this.canonizeRelation_(attributeOf),
        mothballLevel =
            kclv.Configuration.get('chart.Ships.mothballLevel', true);

    return relation.map( function(tuple, index) {
        var columns = [],
            offset = 1;

        // Caveat: Only "mothballLevel" works. ("backups" was ignored)
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
 * Canonize (clone and sort) ship relation.
 * @private
 * @param {Object.<string, number>} attributeOf A attribute/index mapping.
 * @returns {Array.<Object>>} A cloned and sorted ships relation.
 * @nosideeffects
 */
kclv.Table.Ships.Base.prototype.canonizeRelation_ = function(attributeOf) {
    // Note: Use a cloned object to avoid destruct (sort) a relation array.
    var relation = this.relation.clone();

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

    return relation;
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
 */
kclv.Table.Ships.Bubble = function(relation) {
    kclv.Table.Ships.Base.call(this, relation, null, false);

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
    var roster = this.buildRoster_(),
        threshold =
            kclv.Configuration.get('chart.Ships.vertical.level', true) || 0,
        label = kclv.Configuration.get([
            'legend', kclv.Configuration.get('locale'), 'Ships',
            kclv.Configuration.get('chart.Ships.abbreviate', true) ?
                'abbreviation' : 'classification'
        ]);

    return Object.keys(roster).map( function(shipClass) {
        var totalNumber = roster[shipClass].length,
            practicalShips = roster[shipClass].filter( function(level) {
                return level >= threshold;
            } ),
            practicalNumber = practicalShips.length,
            rate = practicalNumber / totalNumber;

        return [
            label[shipClass],
            totalNumber,
            totalNumber ? // Avoid division by zero.
                Math.round( roster[shipClass].reduce( function(sum, level) {
                    return sum + level;
                } ) / totalNumber ) : 0,
            {
                v : rate,
                // Round rate off to 2 decimal places.
                f : Math.round(rate * 100) + '%'
            },
            practicalNumber
        ];
    } );
};

/**
 * Build roster object (ship levels by ship classifications).
 * @private
 * @returns {Object.<string, Array.<number>>} Ships levels by ship
 *     classifications.
 * @nosideeffects
 */
kclv.Table.Ships.Bubble.prototype.buildRoster_ = function() {
    var roster = {},
        attributeOf = this.relation.getAttributes(),
        mothballLevel =
            kclv.Configuration.get('chart.Ships.mothballLevel', true),
        backups = {}; // Lookup table. Array#some() is pretty slow.

    ( kclv.Configuration.get('chart.Ships.backups', true) || [] ).forEach(
        function(id) { backups[id] = true; }
    );

    this.relation.forEach( function(tuple) {
        var classification = tuple[attributeOf.Classification],
            level = tuple[ attributeOf.Levels ];

        if (
            backups[ tuple[attributeOf.ID] ] ||
            ( mothballLevel && level <= mothballLevel )
        ) {
            return;
        }

        if (! roster[classification]) {
            roster[classification] = [];
        }

        roster[classification].push(level);

        return;
    } );

    return roster;
};

/**
 * Get the maximum value of average levels or total ship number.
 * @public
 * @param {!(Array.<number>|string)} indices An array of indices of attributes
 *     or a string representing the indices.
 * @returns {number} The maximum value (an average level or a total ship
 *     number).
 * @nosideeffects
 * @see #minimum
 */
kclv.Table.Ships.Bubble.prototype.maximum = function(indices) {
    return this.getThreshold_('maximum', indices);
};

/**
 * Get the minimum value of average levels or total ship number.
 * @public
 * @param {!(Array.<number>|string)} indices An array of indices of attributes
 *     or a string representing the indices.
 * @returns {number} The minimum value (an average level or a total ship
 *     number).
 * @nosideeffects
 * @see #maximum
 */
kclv.Table.Ships.Bubble.prototype.minimum = function(indices) {
    return this.getThreshold_('minimum', indices);
};

/**
 * Get the threshold ({@code maximum} or {@code minimum}) value of average
 *     levels or total ship number.
 * @private
 * @param {string} edge An edge of the range.
 *     It is {@code maximum} or {@code minimum}.
 * @param {!(Array.<number>|string)} indices An array of indices of attributes
 *     or a string representing the indices.
 * @returns {number} The threshold value (an average level or a total ship
 *     number).
 * @nosideeffects
 */
kclv.Table.Ships.Bubble.prototype.getThreshold_ = function(edge, indices) {
    if (! Array.isArray(indices) ) {
        indices = this.getIndicesOf_(indices);
    }

    return kclv.Array[edge](this.rows, indices);
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

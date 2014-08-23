/**
 * @fileOverview A partical object for tables of ships.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

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
            // Note: totalNumber is always 1 or more.
            //     Because an absent ship classification is not in "roster".
            //     So we are not to worry about zero-division.
            Math.round( roster[shipClass].reduce( function(sum, level) {
                return sum + level;
            } ) / totalNumber ),
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
    return kclv.Array.maximum(this.rows, indices, this);
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
    return kclv.Array.minimum(this.rows, indices, this);
};

/**
 * Get an array of indices of attributes.
 * @public
 * @param {!string} attribute A string representing indices of attributes.
 * @returns {Array.<number>} An array of indices of attributes.
 * @throws {kclv.Exception.InvalidSpecification} If specified attribute is
 *     invalid.
 * @nosideeffects
 */
kclv.Table.Ships.Bubble.prototype.getIndicesOf = function(attribute) {
    switch (attribute) {
        case 'TotalShipNumber':
            return [1];
        case 'AverageLevel':
            return [2];
        default:
            throw new kclv.Exception.InvalidSpecification(
                attribute, ['TotalShipNumber', 'AverageLevel']
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
 * Ensure the specified directive is valid, otherwise throw an exception.
 * @protected
 * @override
 * @throws {kclv.Exception.InvalidDirective} If the specified directive is
 *     invalid.
 * @nosideeffects
 */
kclv.Table.Ships.Scatter.prototype.ensureDirectiveValidated = function() {
    kclv.Table.Base.prototype.ensureDirectiveValidated.call(
        this, ['Levels', 'Experiences'], ['Arrival', 'Experiences']
    );

    return;
};

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

/**
 * Ensure the specified directive is valid, otherwise throw an exception.
 * @protected
 * @override
 * @throws {kclv.Exception.InvalidDirective} If the specified directive is
 *     invalid.
 * @nosideeffects
 */
kclv.Table.Ships.Histogram.prototype.ensureDirectiveValidated = function() {
    kclv.Table.Base.prototype.ensureDirectiveValidated.call(
        this, ['Levels', 'Experiences'], [null]
    );

    return;
};

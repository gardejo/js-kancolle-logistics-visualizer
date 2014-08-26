/**
 * @fileOverview A partical object for relations.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

// ================================================================
// Relations
// ================================================================

// ----------------------------------------------------------------
// Namespace for Relations
// ----------------------------------------------------------------

/**
 * A namespace for relations.
 * @public
 */
kclv.Relation = {};

// ----------------------------------------------------------------
// Base (Abstract) Relation
// ----------------------------------------------------------------

/**
 * A base (abstract) relation, which provides relation algebra.
 *     Some algebra are provided by strategy objects (selector and projector).
 * @public
 * @constructor
 */
kclv.Relation.Base = function() {
    /**
     * A two-dimensional array of a relation model.
     * @protected {Array.<Array>}
     */
    this.relation = [];

    /**
     * Interfaces for strategy objects of relation algebra.
     * @private {Object<string, kclv.PseudoInterface>}
     * @const
     */
    this.interface_ = {
        selector  : new kclv.SelectorLike(),
        projector : new kclv.ProjectorLike()
    };

    return;
};

/**
 * Insert an other relation into its own relation.
 * @public
 * @const
 * @param {!(Array.<Array>|kclv.Relation.Base)} relation An other relation.
 * @returns {kclv.Relation.Base} This object for method chaining.
 * @throws {TypeError} If the specified relation is invalid.
 */
kclv.Relation.Base.prototype.insert = function(relation) {
    if ( Array.isArray(relation) ) {
        this.relation = this.relation.concat(relation);
    } else if ( relation instanceof this.constructor ) {
        this.relation = this.relation.concat( relation.clone().relation );
    } else {
        throw new TypeError(
            'Relation is neither Array nor a kclv.Relation.Base object.'
        );
    }

    return this;
};

/**
 * Select (relation algebra) a relation by the specified selector.
 *     Note: It may destruct a {@code relation} property.
 * @public
 * @const
 * @param {(Array.<number>|kclv.Relation.Base)=} opt_selector A relation
 *     selector. If it isn't defined, the method does no operation, and throws
 *     no exception.
 * @returns {kclv.Relation.Base} This object for method chaining.
 */
kclv.Relation.Base.prototype.select = function(opt_selector) {
    if (! opt_selector) {
        return this; // NOP
    }

    if ( Array.isArray(opt_selector) ) {
        this.relation = kclv.Array.values(this.relation, opt_selector);
    } else {
        this.relation = this.extract_(
            'filter',
            'select',
            this.interface_.selector,
            opt_selector
        );
    }

    return this;
};

/**
 * Project (relation algebra) a relation by the specified projector.
 *     Note: It may destruct a {@code relation} property.
 * @public
 * @const
 * @param {(Array.<number>|kclv.Relation.Base)=} opt_projector A relation
 *     projector. If it isn't defined, the method does no operation, and throws
 *     no exception.
 * @returns {kclv.Relation.Base} This object for method chaining.
 */
kclv.Relation.Base.prototype.project = function(opt_projector) {
    if (! opt_projector) {
        return this; // NOP
    }

    if ( Array.isArray(opt_projector) ) {
        this.relation = this.relation.map( function(tuple) {
            return kclv.Array.values(tuple, this);
        }, opt_projector );
    } else {
        this.relation = this.extract_
            ('map', 'project', this.interface_.projector, opt_projector);
    }

    return this;
};

/**
 * (Template) Extract (select or project) a relation by the specified operator.
 *     Note: It may destruct a {@code relation} property.
 * @public
 * @const
 * @param {!string} iterator A name of an iterator method.
 * @param {!string} operation A method name of extraction.
 * @param {!kclv.PseudoInterface} operatorInterface An interface of an
 *     operator.
 * @param {Object} operator A relation operator.
 * @returns {Array.<Array>} Two-dimentional array as a relation.
 * @throws {kclv.Exception.InvalidStrategy} If the specified operator is
 *     invalid type.
 */
kclv.Relation.Base.prototype.extract_ = function(
    iterator, operation, operatorInterface, operator
) {
    if ( operatorInterface.implemented(operator) ) {
        return this.relation[iterator](operator[operation], operator);
    }

    throw new kclv.Exception.InvalidStrategy(
        'An attribute operator (' + operation + ') is neither Array nor ' +
        'an object which implements an operator interface.'
    );
};

/**
 * Get the maximum value in fields of the relation.
 * @public
 * @const
 * @param {!(Array.<number>|string)} indices An array of indices of attributes
 *     or a string representing the indices.
 * @returns {number} The maximum value in fields of the relation.
 * @nosideeffects
 * @see #getThreshold_
 * @see #minimum
 */
kclv.Relation.Base.prototype.maximum = function(indices) {
    return kclv.Array.maximum(this.relation, indices, this);
};

/**
 * Get the minimum value in fields of the relation.
 * @public
 * @const
 * @param {!(Array.<number>|string)} indices An array of indices of attributes
 *     or a string representing the indices.
 * @returns {number} The minimum value in fields of the relation.
 * @nosideeffects
 * @see #getThreshold_
 * @see #maximum
 */
kclv.Relation.Base.prototype.minimum = function(indices) {
    return kclv.Array.minimum(this.relation, indices, this);
};

/**
 * Get the opening time stamp or the number of the first tuple of the relation.
 * @public
 * @const
 * @returns {number|Date} The opening time stamp of the relation represented by
 *     a time series, or the number of the first tuple of the simple relation.
 * @nosideeffects
 * @see #closing
 */
kclv.Relation.Base.prototype.opening = function() {
    return this.isChronological() ?
        this.relation[0][ this.getAttributes().DateTime ] :
        1;
};

/**
 * Get the closing time stamp or the number of the last tuple of the relation.
 * @public
 * @const
 * @returns {number|Date} The closing time stamp of the relation represented by
 *     a time series, or the number of the last tuple of the simple relation.
 * @nosideeffects
 * @see #opening
 */
kclv.Relation.Base.prototype.closing = function() {
    return this.isChronological() ?
        this.relation[this.count() - 1][ this.getAttributes().DateTime ] :
        this.count();
};

/**
 * Check whether the relation is represented by a time series.
 * @public
 * @const
 * @returns {boolean} Whether the relation is represented by a time series.
 * @nosideeffects
 */
kclv.Relation.Base.prototype.isChronological = function() {
    var indexOf = this.getAttributes();

    return indexOf.DateTime !== undefined;
};

/**
 * Count an amount of tuples.
 * @public
 * @const
 * @returns {number} An amount of tuples.
 * @nosideeffects
 */
kclv.Relation.Base.prototype.count = function() {
    return this.relation.length;
};

/**
 * Sort the tuples of the relation in place and return the relation.
 * @public
 * @const
 * @param {Function} sorter A function that defines the sort order.
 * @returns {Array.<Array>} A sorted relation.
 * @see Array#sort()
 */
kclv.Relation.Base.prototype.sort = function(sorter) {
    return this.relation.sort(sorter);
};

/**
 * Create a new relation with the results of calling a provided mapper function
 *     on every tuple in the relation.
 * @public
 * @const
 * @param {Function} mapper A function that produces a tuple of the new
 *     relation.
 * @param {Object=} opt_thisObject Value to use as {@code this} when executing
 *     {@code mapper} function.
 * @return {Array.<Array>} A mapped new relation.
 * @nosideeffects
 * @see Array#map()
 */
kclv.Relation.Base.prototype.map = function(mapper, opt_thisObject) {
    return this.relation.map(mapper, opt_thisObject);
};

/**
 * Execute the specified function once per tuple in the relation.
 * @public
 * @const
 * @param {Function} visitor A function that execute for each tuple in the
 *     relation.
 * @param {Object=} opt_thisObject Value to use as {@code this} when executing
 *     {@code mapper} function.
 * @nosideeffects
 * @see Array#forEach()
 */
kclv.Relation.Base.prototype.forEach = function(visitor, opt_thisObject) {
    this.relation.forEach(visitor, opt_thisObject);

    return;
};

/**
 * Apply the specified reducer function against an accumulator and each value
 *     of the relation (from left-to-right) has to reduce it to a single value.
 * @public
 * @const
 * @param {Function} reducer A function to execute on each value in the
 *     relation.
 * @param {Object=} opt_initialValue An object to use as the first argument
 *     to the first call of the {@code reducer} function.
 * @return {Object} A reduced single value.
 * @nosideeffects
 * @see Array#reduce()
 */
kclv.Relation.Base.prototype.reduce = function(reducer, opt_initialValue) {
    return this.relation.reduce(reducer, opt_initialValue);
};

/**
 * (Abstract) Get a dictionary of attribute/index mapping.
 * @public
 * @throws {kclv.Exception.AbstractMethod} Always.
 */
kclv.Relation.Base.prototype.getAttributes = function() {
    throw new kclv.Exception.AbstractMethod();
};

/**
 * (Abstract) Get an array of indices of attributes.
 * @public
 * @throws {kclv.Exception.AbstractMethod} Always.
 * @see #getIndexOf
 */
kclv.Relation.Base.prototype.getIndicesOf = function() {
    throw new kclv.Exception.AbstractMethod();
};

/**
 * Get an integer of index of attribute.
 * @public
 * @param {!string} attribute A string representing index of attribute.
 * @returns {number} An integer of index of attribute.
 * @nosideeffects
 * @see #getIndicesOf
 */
kclv.Relation.Base.prototype.getIndexOf = function(attribute) {
    return this.getIndicesOf(attribute).shift();
};

/**
 * Clone itself.
 * @public
 * @const
 * @return {kclv.Relation.Base} A cloned relation object.
 * @nosideeffects
 */
kclv.Relation.Base.prototype.clone = function() {
    var cloned = Object.create(this);
    cloned.relation = this.relation.slice(); // Deeply cloned.

    return cloned;
};

// ----------------------------------------------------------------
// Relation of Materials
// ----------------------------------------------------------------

/**
 * A relation about materials (Resources and consumables).
 * @public
 * @constructor
 * @extends {kclv.Relation.Base}
 */
kclv.Relation.Materials = function() {
    kclv.Relation.Base.call(this);

    return;
};
kclv.Relation.Materials.prototype =
    Object.create(kclv.Relation.Base.prototype);
kclv.Relation.Materials.prototype.constructor = kclv.Relation.Base;

/**
 * Get a dictionary of attribute/index mapping.
 * @public
 * @override
 * @returns {Object.<string, number>} A dictionary of attribute/index mapping.
 * @nosideeffects
 */
kclv.Relation.Materials.prototype.getAttributes = function() {
    return {
        DateTime     : 0,
        Fuel         : 1, // "material": "api_value" of "api_id" (1).
        Ammunition   : 2, // "material": "api_value" of "api_id" (2).
        Steel        : 3, // "material": "api_value" of "api_id" (3).
        Bauxite      : 4, // "material": "api_value" of "api_id" (4).
        Repair       : 5, // "material": "api_value" of "api_id" (6).
        Construction : 6, // "material": "api_value" of "api_id" (5).
        Development  : 7  // "material": "api_value" of "api_id" (7).
    };
};

/**
 * Get an array of indices of attributes.
 * @public
 * @override
 * @param {!string} material A string representing indices of attributes.
 * @param {boolean=} opt_withDateTime Whether indices contain date and time
 *     attribute.
 * @param {boolean=} opt_withRepair Whether indices contain Repair attribute.
 * @returns {Array.<number>} An array of indices of attributes.
 * @throws {kclv.Exception.InvalidMaterial} If specified material kind is
 *     invalid.
 * @nosideeffects
 */
kclv.Relation.Materials.prototype.getIndicesOf = function(
    material, opt_withDateTime, opt_withRepair
) {
    var indexOf = this.getAttributes(),
        index,
        indices,
        concreteMaterials = kclv.Game.Materials.MATERIALS_OF[material];

    if (concreteMaterials) {
        indices = concreteMaterials.map( function(concreteMaterial) {
            return indexOf[concreteMaterial];
        } );
    } else {
        index = indexOf[material];
        if (index === undefined) {
            throw new kclv.Exception.InvalidMaterial(material);
        }
        indices = [ index ];
    }

    if (opt_withRepair) {
        indices.push(indexOf.Repair);
    }
    if (opt_withDateTime) {
        indices.unshift(indexOf.DateTime);
    }

    return indices;
};

// ----------------------------------------------------------------
// Relation of Ships
// ----------------------------------------------------------------

/**
 * A relation about ships (Combined Fleet Girls).
 * @public
 * @constructor
 * @extends {kclv.Relation.Base}
 */
kclv.Relation.Ships = function() {
    kclv.Relation.Base.call(this);

    return;
};
kclv.Relation.Ships.prototype = Object.create(kclv.Relation.Base.prototype);
kclv.Relation.Ships.prototype.constructor = kclv.Relation.Base;

/**
 * Get a dictionary of attribute/index mapping.
 * @public
 * @override
 * @returns {Object.<string, number>} A dictionary of attribute/index mapping.
 * @nosideeffects
 */
kclv.Relation.Ships.prototype.getAttributes = function() {
    return {
        ID             : 0, // "ship": "api_id" (not "api_ship_id").
        Name           : 1, // "ship": "api_name" (Kanji).
        Classification : 2, // "ship": "api_stype"
        Levels         : 3, // "ship": "api_lv"
        Experiences    : 4  // "ship": "api_exp"
    };
};

/**
 * Get an array of indices of attributes.
 * @public
 * @override
 * @param {!string} attribute A string representing indices of attributes.
 * @returns {Array.<number>} An array of indices of attributes.
 * @throws {kclv.Exception.InvalidSpecification} If specified skill kind is
 *     invalid.
 * @nosideeffects
 */
kclv.Relation.Ships.prototype.getIndicesOf = function(attribute) {
    var indexOf = this.getAttributes(),
        index = indexOf[attribute];

    if (index === undefined) {
        throw new kclv.Exception.InvalidSpecification(attribute);
    }

    return [ index ];
};

// ----------------------------------------------------------------
// Relation Factory
// ----------------------------------------------------------------

/**
 * A relation factory.
 *     It is an instance of the Singleton pattern (GoF) and the Flyweight
 *     pattern (GoF).
 * @public
 * @const
 * @constructor
 */
kclv.RelationFactory = ( function() {
    /**
     * The relation pool as a Flyweight object.
     * @private {Object.<string, kclv.Relation.Base>}
     */
    var pool = {};

    return {
        /**
         * Get a relation object by the specified relation name and the
         *     specified agent object. If the relation object was already
         *     created, the method returns it without another creation.
         * @public
         * @param {!string} name A name of relation.
         * @param {!kclv.Agent} agent An agent object.
         * @returns {kclv.Relation.Base} A relation object.
         */
        getInstance : function(name, agent) {
            if ( pool[name] === undefined ) {
                pool[name] = agent.buildRelation(name);
            }

            return pool[name];
        }
    };
}() );

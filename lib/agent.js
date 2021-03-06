/**
 * @fileOverview A partical object for agents.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

// ================================================================
// Agents
// ================================================================

// ----------------------------------------------------------------
// Namespace for Agents
// ----------------------------------------------------------------

/**
 * A namespace for agents.
 * @public
 */
kclv.Agent = {};

// ----------------------------------------------------------------
// Base Agent
// ----------------------------------------------------------------

/**
 * A base agent.
 *     An agent (a.k.a. the game client, a dedicated browser (an user agent),
 *     or a dedicated proxy) has its own format of log files. Their concrete
 *     operations are delegeted to a tokenizer object.
 *     Note: If you want to add a tokenizer for an other agent object into the
 *     library, please send a specification (an actual log file, path of a log
 *     file, etc.).
 * @public
 * @param {string} name A name of the agent.
 * @param {string} characterSet A character set of agent's log.
 * @constructor
 */
kclv.Agent.Base = function(name, characterSet) {
    /**
     * A name of the agent.
     *     It's to be used as a part of key in a configuration object tree.
     * @protected {string}
     * @const
     */
    this.name = name;

    /**
     * A character set of agent's log.
     * @protected {string}
     * @const
     */
    this.CHARACTER_SET = characterSet;

    /**
     * A delegated file reader object to read a log file.
     * @protected {kclv.Stream}
     * @const
     */
    this.stream = new kclv.Stream();

    return;
};

/**
 * Build a relation object and get it.
 * @public
 * @param {string} relationName A name of relation.
 * @returns {kclv.Relation.Base} A relation object.
 */
kclv.Agent.Base.prototype.buildRelation = function(relationName) {
    var relation = kclv.Factory.getInstance(kclv.Relation, relationName).
                   insert( this.buildMatrix(relationName) );

    // TODO: Strategy
    if (relationName === 'Materials') {
        relation.select( this.getSelector() );
    }

    return relation;
};

/**
 * Build a matrix (two-dimensional array) representing a log file.
 * @protected
 * @param {!string} relationName A name of relation.
 *     (ex. {@code Materials}, {@code Ships})
 * @param {string=} opt_concreteRelationName A name of concrete relation.
 *     (ex. {@code Fuel}, {@code Repair})
 * @returns {Array.<Array>} Two-dimensional array representing contents of a
 *     log file.
 * @nosideeffects
 */
kclv.Agent.Base.prototype.buildMatrix = function(
    relationName, opt_concreteRelationName
) {
    var tokenizer = kclv.Factory.getInstance(
        kclv.Tokenizer, [this.name, relationName]
    );

    return tokenizer.toMatrix(
        this.stream.readFile(
            this.getPathOf_(opt_concreteRelationName || relationName),
            this.CHARACTER_SET
        )
    );
};

/**
 * Build a tuple seleector object and get it.
 * @protected
 * @returns {kclv.Selector.Base} A tuple selector object.
 * @nosideeffects
 */
kclv.Agent.Base.prototype.getSelector = function() {
    var configuration = kclv.Configuration.get('relation');

    return typeof configuration.duration === 'number' ?
        new kclv.Selector.Retrospection(
            configuration.duration
        ) :
        new kclv.Selector.Period(
            configuration.inception,
            configuration.expiration
        );
};

/**
 * (Abstract) Build an attribute projector object and get it.
 * @protected
 * @throws {kclv.Exception.AbstractMethod} Always.
 */
kclv.Agent.Base.prototype.getProjector = function() {
    throw new kclv.Exception.AbstractMethod();
};

/**
 * Get a path string of the specified relation name.
 * @private
 * @param {!string} relationName A name of relation.
 * @returns {string} A path string of the specified log file.
 * @nosideeffects
 */
kclv.Agent.Base.prototype.getPathOf_ = function(relationName) {
    return kclv.Configuration.get(['agent', this.name, 'path', relationName]);
};

// ----------------------------------------------------------------
// Browser as an Agent ("Manual")
// ----------------------------------------------------------------

/**
 * An agent for "Manual".
 *     It is a simple subtype of {@code kclv.Agent.Base} at the moment.
 * @public
 * @constructor
 * @extends {kclv.Agent.Base}
 */
kclv.Agent.Manual = function() {
    kclv.Agent.Base.call(this, 'Manual', 'Shift_JIS');

    return;
};
kclv.Agent.Manual.prototype = Object.create(kclv.Agent.Base.prototype);
kclv.Agent.Manual.prototype.constructor = kclv.Agent.Base;

/**
 * Build two-dimensional array representing a log file.
 *     We did not dare to implement the supplement to missing values in the
 *     {@code kclv.Tokenizer.Manual.Ships.prototype.toMatrix} method,
 *     because a tokenizer object should devote itself to tokenize strings.
 * @protected
 * @override
 * @param {!string} relationName A name of relation.
 *     (ex. {@code Materials}, {@code Ships})
 * @param {string=} opt_concreteRelationName A name of concrete relation.
 *     (ex. {@code Fuel}, {@code Repair})
 * @returns {Array.<Array>} Two-dimensional array representing contents of a
 *     log file.
 */
kclv.Agent.Manual.prototype.buildMatrix = function(relationName) {
    var matrix =
            kclv.Agent.Base.prototype.buildMatrix.call(this, relationName);

    if (relationName === 'Ships') {
        var EXPERIENCES = kclv.Game.Ships.EXPERIENCES;
        matrix = matrix.map( function(columns, index) {
            return [
                index + 1,  // Expedient ID with a line number.
                columns[0], // Name.
                columns[1], // Abbreviation for ship classification.
                columns[2], // Level.
                // An experience points with her level (an excess is omitted).
                EXPERIENCES[ columns[2] - 1 ]
            ];
        } );
    }

    return matrix;
};

// ----------------------------------------------------------------
// Agent "KCRDB"
// ----------------------------------------------------------------

/**
 * An agent for "KCRDB".
 * @public
 * @constructor
 * @extends {kclv.Agent.Base}
 * @see http://hetaregrammer.blog.fc2.com/
 */
kclv.Agent.KCRDB = function() {
    kclv.Agent.Base.call(this, 'KCRDB', 'Shift_JIS');

    return;
};
kclv.Agent.KCRDB.prototype = Object.create(kclv.Agent.Base.prototype);
kclv.Agent.KCRDB.prototype.constructor = kclv.Agent.Base.prototype;

/**
 * Build a relation object and get it.
 * @public
 * @override
 * @param {string} relationName A name of relation.
 * @returns {kclv.Relation.Base} A relation object.
 */
kclv.Agent.KCRDB.prototype.buildRelation = function(relationName) {
    var relation =
            kclv.Agent.Base.prototype.buildRelation.call(this, relationName);

    // TODO: Strategy
    if (relationName === 'Materials') {
        relation.project( this.getProjector() );
    }

    return relation;
};

/**
 * Build an attribute projector object by the configurated kind and get it.
 *     Note: The default kind is 'Low'.
 * @protected
 * @override
 * @returns {kclv.Projector.Base} An attribute projector object.
 * @nosideeffects
 */
kclv.Agent.KCRDB.prototype.getProjector = function() {
    var kind = kclv.Configuration.get('relation.values', true) || 'Low';

    return kclv.Factory.getInstance(kclv.Projector.Materials, kind);
};

// ----------------------------------------------------------------
// Agent "Logbook"
// ----------------------------------------------------------------

/**
 * An agent for "Logbook".
 *     It is a simple subtype of {@code kclv.Agent.Base} at the moment.
 * @public
 * @constructor
 * @extends {kclv.Agent.Base}
 * @see http://kancolle.sanaechan.net/
 */
kclv.Agent.Logbook = function() {
    kclv.Agent.Base.call(this, 'Logbook', 'Shift_JIS');

    return;
};
kclv.Agent.Logbook.prototype = Object.create(kclv.Agent.Base.prototype);
kclv.Agent.Logbook.prototype.constructor = kclv.Agent.Base;

// ----------------------------------------------------------------
// Agent "LogbookEx"
// ----------------------------------------------------------------

/**
 * An agent for "LogbookEx".
 *     It is a simple subtype of {@code kclv.Agent.Base} at the moment.
 * @public
 * @constructor
 * @extends {kclv.Agent.Logbook}
 * @see https://github.com/nekopanda/logbook
 */
kclv.Agent.LogbookEx = function() {
    kclv.Agent.Logbook.call(this);

    /**
     * A name of the agent.
     *     It's to be used as a part of key in a configuration object tree.
     * @protected {string}
     * @override
     * @const
     */
    this.name = 'LogbookEx';

    return;
};
kclv.Agent.LogbookEx.prototype = Object.create(kclv.Agent.Logbook.prototype);
kclv.Agent.LogbookEx.prototype.constructor = kclv.Agent.Logbook;

// ----------------------------------------------------------------
// Agent "Sandanshiki Kanpan" (Three Flight Decks)
// ----------------------------------------------------------------

/**
 * An agent for "Sandanshiki Kanpan" (Three Flight Decks).
 * @public
 * @constructor
 * @extends {kclv.Agent.Base}
 * @see http://3dan.preflight.cc/
 */
kclv.Agent.SandanshikiKanpan = function() {
    kclv.Agent.Base.call(this, 'SandanshikiKanpan', 'Shift_JIS');

    return;
};
kclv.Agent.SandanshikiKanpan.prototype =
    Object.create(kclv.Agent.Base.prototype);
kclv.Agent.SandanshikiKanpan.prototype.constructor = kclv.Agent.Base;

/**
 * Build a relation object and get it.
 * @public
 * @override
 * @param {string} relationName A name of relation.
 * @returns {kclv.Relation.Base} A relation object.
 * @throws {kclv.Exception.InvalidRelation} If the specified relation name is
 *     not {@code Materials}.
 */
kclv.Agent.SandanshikiKanpan.prototype.buildRelation = function(relationName) {
    if (relationName !== 'Materials') {
        throw new kclv.Exception.InvalidRelation(relationName, ['Materials']);
    }

    var contents = {},
        MATERIALS = kclv.Game.Materials.MATERIALS,
        RADIX = 10;

    MATERIALS.forEach( function(material, index) {
        if (material === 'Improvement') {
            return;
        }
        // [["date0", value0], ["date1", value0], ...]
        this.buildMatrix(relationName, material).forEach( function(columns) {
            // { "date0" : [value0, value1, ...], "date1": ... }
            var date = columns[0].getTime();
            contents[date] = contents[date] || MATERIALS.slice().fill(null);
            contents[date][index] = columns[1];
        } );
    }, this );

    return kclv.Factory.getInstance(kclv.Relation, relationName).
        insert(
            // [ [date0, value0, value1, ...], [date1, value0, ...], ... ]
            Object.keys(contents).
            map( function(date) {
                return [ new Date(parseInt(date, RADIX)) ].
                    concat(contents[date]);
            } ).
            sort( function(a, b) { return a[0] - b[0]; } )
        ).
        select( this.getSelector() );
};

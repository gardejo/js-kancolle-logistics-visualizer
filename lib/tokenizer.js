/**
 * @fileOverview A partical object for tokenizers.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

// ================================================================
// Tokenizers
// ================================================================

// ----------------------------------------------------------------
// Namespace for Tokenizers
// ----------------------------------------------------------------

/**
 * A namespace for tokenizers.
 * @public
 */
kclv.Tokenizer = {};

// ----------------------------------------------------------------
// Base Tokenizer Object
// ----------------------------------------------------------------

/**
 * A base tokenizer.
 *     TODO: Remove concrete objects, and define these logic in configuration
 *     file instead.
 *     ex. {@code {adopt":[0,1,3,4,5],unquote:[1,2],integerize:[0,3,4]}}
 * @public
 * @constructor
 * @param {boolean} hasHeader Whether a log file has a header as the first row.
 */
kclv.Tokenizer.Base = function(hasHeader) {
    /**
     * Whether a log file has a header as the first row.
     * @private {boolean}
     * @const
     */
    this.hasHeader_ = hasHeader;

    /**
     * A string or a RegExp pattern as a split token of log files.
     *     For example, {@code 42, "Foo, Bar and Baz"} row will be converted
     *     into two ({@code [42, '"Foo", "Bar and Baz"']}) columns.
     * @protected {Object.<string, (RegExp|string)>}
     */
    this.SPLIT_TOKEN_OF_ = {
        rows    : /\s*\r?\n/, // CR+LF (Windows) and LF (Unixen)
        // CAVEAT: JScript sucks! 'a,,b,c'.split(/,/).length !== 4, === 3
     // columns : /\s*,\s*/   // TODO: Escape
        columns : ','         // TODO: Escape
    };

    /**
     * A delegated formatter object to normalize values.
     * @protected {kclv.Formatter}
     * @const
     */
    this.formatter = new kclv.Formatter();

    return;
};

/**
 * (Template) Convert the specified string into two-dimensional array of a
 *     relation. Methods of concrete operations ({@code toRows} and
 *     {@code toColumns}) may overridden by a descendent object.
 * @public
 * @const
 * @param {!string} string Contents of a log file.
 * @returns {Array.<Array>} Two-dimensional array representing contents of a
 *     log file.
 * @nosideeffects
 */
kclv.Tokenizer.Base.prototype.toRelationalArray = function(string) {
    return this.toRows(string).map(this.toColumns, this);
};

/**
 * Convert the specified string into arrays representing each line (row) by its
 *     own patterns or characters of a delimiter token (Usually, End-of-Line).
 *     Note: It also removes the first row as header if its own
 *     {@code hasHeader_} property is true.
 *     Note: It also filters out empty (blank) rows, bcause POSIX defines a
 *     "Line" and a "Last Close of a File" at IEEE Std 1003.1-2004, section
 *     3.204 and 3.205.
 *     Note: May normalize some rows by a descendent object.
 * @protected
 * @param {!string} string Contents of a log file.
 * @returns {Array.<string>} One-dimensional array representing each lines of
 *     the specified string.
 * @nosideeffects
 * @see http://pubs.opengroup.org/onlinepubs/000095399/basedefs/xbd_chap03.html
 */
kclv.Tokenizer.Base.prototype.toRows = function(string) {
    var rows = string.split( this.SPLIT_TOKEN_OF_.rows ).
               filter( function(row) { return row !== ''; } );

    if (this.hasHeader_) {
        rows.shift(); // Remove a header.
    }

    return rows;
};

/**
 * (Callback) Convert and normalize the specified string into arrays
 *     representing each columns.
 * @protected
 * @this {kclv.Tokenizer.Base}
 * @param {!string} row A string of row (line).
 * @returns {Array.<Array>} Array representing each columns of the specified
 *     row.
 * @nosideeffects
 */
kclv.Tokenizer.Base.prototype.toColumns = function(row) {
    switch (this.kind_) {
        case 'Materials':
            return this.toColumnsAsMaterials_(row);
        case 'Ships':
            return this.toColumnsAsShips_(row);
        default:
            throw new kclv.Exception.InvalidKind(this.kind_);
    }
};

/**
 * (Template) Convert the specified row into two-dimensional arrays
 *     representing material-related columns.
 * @private
 * @param {Array.<Array>} row Array representing each columns.
 * @returns {Array.<Array>} Array representing each columns of the specified
 *     row.
 * @nosideeffects
 */
kclv.Tokenizer.Base.prototype.toColumnsAsMaterials_ = function(row) {
    var columns = this.splitRow_(row),
        timeStamp = new Date( this.canonizeTimeStamp(
                columns.splice(this.indicesOf.timeStamp, 1).shift()
            ) );

    return [timeStamp].concat( this.formatter.integerize(columns) );
};

/**
 * (Template) Convert the specified row into two-dimensional arrays
 *     representing ship-related columns.
 * @private
 * @param {Array.<Array>} row Array representing each columns.
 * @param {!Object.<string, *>} indicesOf A dictionary for target indices of
 *     some filtering methods.
 * @returns {Array.<Array>} Array representing each columns of the specified
 *     row.
 * @nosideeffects
 */
kclv.Tokenizer.Base.prototype.toColumnsAsShips_ = function(row) {
    var columns = this.splitRow_(row);

    columns = kclv.Array.values(columns, this.indicesOf.filter);
    columns = this.formatter.unquote(columns, this.indicesOf.unquote);
    columns[this.indicesOf.abbreviate] =
        kclv.Game.Ships.ABBREVIATION_FOR[ columns[this.indicesOf.abbreviate] ];
    columns = this.formatter.integerize(columns, this.indicesOf.integerize);

    return columns;
};

/**
 * Convert the specified row string representing each columns into an array
 *     with its own patterns or characters of a delimiter token.
 * @private
 * @param {!string} row A string of row (line).
 * @returns {Array.<Array>} Array representing each columns of the specified
 *     row.
 * @nosideeffects
 */
kclv.Tokenizer.Base.prototype.splitRow_ = function(row) {
    return row.split( this.SPLIT_TOKEN_OF_.columns );
};

/**
 * (Abstract) Canonize time stamp string and get it.
 * @protected
 * @throws {kclv.Exception.AbstractMethod} Always.
 */
kclv.Tokenizer.Base.prototype.canonizeTimeStamp = function() {
    throw new kclv.Exception.AbstractMethod();
};

// ----------------------------------------------------------------
// Tokeninzer Role (Trait) for Material Objects
// ----------------------------------------------------------------

/**
 * A tokenizer role (trait) for material objects.
 * @public
 * @constructor
 */
kclv.Tokenizer.Materials = function() {
    /**
     * A relation kind.
     * @private {string}
     * @const
     */
    this.kind_ = 'Materials';

    /**
     * Indices of the column attributes.
     * @protected {Object.<string, number>}
     */
    this.indicesOf = {
        timeStamp : 0
    };

    return;
};

// ----------------------------------------------------------------
// Tokeninzer Role (Trait) for Ship Objects
// ----------------------------------------------------------------

/**
 * A tokenizer role (trait) for ship objects.
 * @public
 * @constructor
 */
kclv.Tokenizer.Ships = function() {
    /**
     * A relation kind.
     * @private {string}
     * @const
     */
    this.kind_ = 'Ships';

    /**
     * Indices of the column attributes.
     * @protected {Object.<string, number>}
     */
    this.indicesOf = {};

    return;
};

// ----------------------------------------------------------------
// Namespace for Tokeninzers of KCRDB
// ----------------------------------------------------------------

/**
 * A namespace for tokenizers of KCRDB.
 * @public
 */
kclv.Tokenizer.KCRDB = {};

// ----------------------------------------------------------------
// Base Tokeninzer for KCRDB
// ----------------------------------------------------------------

/**
 * A base tokenizer for KCRDB.
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.Base}
 */
kclv.Tokenizer.KCRDB.Base = function() {
    kclv.Tokenizer.Base.call(this, false);

    return;
};
kclv.Tokenizer.KCRDB.Base.prototype =
    Object.create(kclv.Tokenizer.Base.prototype);
kclv.Tokenizer.KCRDB.Base.prototype.constructor = kclv.Tokenizer.Base;

// ----------------------------------------------------------------
// Tokeninzer for a KCRDB's Materials Log
// ----------------------------------------------------------------

/**
 * A tokenizer for a KCRDB's materials log.
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.KCRDB.Base}
 */
kclv.Tokenizer.KCRDB.Materials = function() {
    kclv.Tokenizer.KCRDB.Base.call(this);
    kclv.Tokenizer.Materials.call(this); // Mix-in.

    return;
};
kclv.Tokenizer.KCRDB.Materials.prototype =
    Object.create(kclv.Tokenizer.KCRDB.Base.prototype);
kclv.Tokenizer.KCRDB.Materials.prototype.constructor =
    kclv.Tokenizer.KCRDB.Base;

/**
 * Canonize time stamp string and get it.
 * @protected
 * @override
 * @param {string} timeStamp A string as a logged time stamp.
 * @returns {string} A string as a parameter of {@code Date} constructor.
 */
kclv.Tokenizer.KCRDB.Materials.prototype.canonizeTimeStamp = function(
    timeStamp
) {
    // Convert "#2013/04/23 01:23:45#" into "2013/04/23 01:23:45".
    return timeStamp.replace(/#/g, '');
};

// ----------------------------------------------------------------
// Tokeninzer for a KCRDB's Ships Log
// ----------------------------------------------------------------

/**
 * A tokenizer for a KCRDB's ships log.
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.KCRDB}
 */
kclv.Tokenizer.KCRDB.Ships = function() {
    kclv.Tokenizer.KCRDB.Base.call(this);
    kclv.Tokenizer.Ships.call(this); // Mix-in.

    /**
     * Indices of the column attributes.
     *     <pre>
     *     0 -> 0 : ID (Order of arrival, includes omissions).
     *     1 -> 1 : Name.
     *     2      : Master ID. (For example, DD Fubuki is always 201.)
     *     3 -> 2 : Ship class.
     *     4 -> 3 : Level.
     *     5 -> 4 : Experience points.
     *     ...    : (snip)
     *     </pre>
     * @override
     * @protected {Object.<string, number>}
     */
    this.indicesOf = {
        filter     : [0, 1, 3, 4, 5],
        unquote    : [1, 2],
        abbreviate : 2,
        integerize : [0, 3, 4]
    };

    return;
};
kclv.Tokenizer.KCRDB.Ships.prototype =
    Object.create(kclv.Tokenizer.KCRDB.Base.prototype);
kclv.Tokenizer.KCRDB.Ships.prototype.constructor =
    kclv.Tokenizer.KCRDB.Base;

// ----------------------------------------------------------------
// Namespace for Tokeninzers of Logbook
// ----------------------------------------------------------------

/**
 * A namespace for tokenizers of Logbook.
 * @public
 */
kclv.Tokenizer.Logbook = {};

// ----------------------------------------------------------------
// Base Tokeninzer for Logbook
// ----------------------------------------------------------------

/**
 * Base tokenizer for Logbook.
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.Base}
 */
kclv.Tokenizer.Logbook.Base = function() {
    kclv.Tokenizer.Base.call(this, true);

    return;
};
kclv.Tokenizer.Logbook.Base.prototype =
    Object.create(kclv.Tokenizer.Base.prototype);
kclv.Tokenizer.Logbook.Base.prototype.constructor = kclv.Tokenizer.Base;

// ----------------------------------------------------------------
// Tokeninzer for a Logbook's Materials Log
// ----------------------------------------------------------------

/**
 * A tokenizer for a Logbook's materials log.
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.Logbook}
 */
kclv.Tokenizer.Logbook.Materials = function() {
    kclv.Tokenizer.Logbook.Base.call(this);
    kclv.Tokenizer.Materials.call(this); // Mix-in.

    return;
};
kclv.Tokenizer.Logbook.Materials.prototype =
    Object.create(kclv.Tokenizer.Logbook.Base.prototype);
kclv.Tokenizer.Logbook.Materials.prototype.constructor =
    kclv.Tokenizer.Logbook.Base;

/**
 * Canonize time stamp string and get it.
 * @protected
 * @override
 * @param {string} timeStamp A string as a logged time stamp.
 * @returns {string} A string as a parameter of {@code Date} constructor.
 */
kclv.Tokenizer.Logbook.Materials.prototype.canonizeTimeStamp = function(
    timeStamp
) {
    // Convert "2013-04-23 01:23:45" into "2013/04/23 01:23:45".
    return timeStamp.replace(/-/g, '/');
};

// ----------------------------------------------------------------
// Tokeninzer for a Logbook's Ships Log
// ----------------------------------------------------------------

/**
 * A tokenizer for a Logbook's ships log.
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.Logbook.Base}
 * @throws {TypeError} If the constructor was invoked.
 */
kclv.Tokenizer.Logbook.Ships = function() {
    kclv.Tokenizer.Logbook.Base.call(this);
    kclv.Tokenizer.Ships.call(this); // Mix-in.

    /**
     * Indices of the column attributes.
     *     <pre>
     *     0      : Order of arrival, excludes omissions. (1-190)
     *     1 -> 0 : ID (Order of arrival, includes omissions).
     *     2      : Fleet number. (empty, 1, 2, 3 and 4)
     *     3 -> 1 : Name.
     *     4 -> 2 : Ship class.
     *     5      : Condition value. (0-100)
     *     6      : Time to departure. (hh:mm)
     *     7 -> 3 : Level.
     *     8      : Experience points to next level.
     *     9 -> 4 : Experience points.
     *     ...    : (snip)
     *     </pre>
     * @override
     * @protected {Object.<string, number>}
     */
    this.indicesOf = {
        filter     : [1, 3, 4, 7, 9],
        unquote    : null,
        abbreviate : 2,
        integerize : [0, 3, 4]
    };

    return;
};
kclv.Tokenizer.Logbook.Ships.prototype =
    Object.create(kclv.Tokenizer.Logbook.Base.prototype);
kclv.Tokenizer.Logbook.Ships.prototype.constructor =
    kclv.Tokenizer.Logbook.Base;

// ----------------------------------------------------------------
// Namespace for Tokeninzers of Sandanshiki Kanpan (Three Flight Decks)
// ----------------------------------------------------------------

/**
 * A namespace for tokenizers of Sandanshiki Kanpan (Three Flight Decks).
 * @public
 */
kclv.Tokenizer.SandanshikiKanpan = {};

// ----------------------------------------------------------------
// Base Tokeninzer for Sandanshiki Kanpan (Three Flight Decks)
// ----------------------------------------------------------------

/**
 * Base tokenizer for Sandanshiki Kanpan (Three Flight Decks).
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.Base}
 */
kclv.Tokenizer.SandanshikiKanpan.Base = function() {
    kclv.Tokenizer.Base.call(this, false);

    return;
};
kclv.Tokenizer.SandanshikiKanpan.Base.prototype =
    Object.create(kclv.Tokenizer.Base.prototype);
kclv.Tokenizer.SandanshikiKanpan.Base.prototype.constructor =
    kclv.Tokenizer.Base;

// ----------------------------------------------------------------
// Tokeninzer for a Sandanshiki Kanpan (Three Flight Decks)'s Materials Log
// ----------------------------------------------------------------

/**
 * A tokenizer for a Sandanshiki Kanpan (Three Flight Decks)'s materials log.
 * @public
 * @constructor
 * @extends {kclv.Tokenizer.SandanshikiKanpan}
 */
kclv.Tokenizer.SandanshikiKanpan.Materials = function() {
    kclv.Tokenizer.SandanshikiKanpan.Base.call(this);
    kclv.Tokenizer.Materials.call(this); // Mix-in.

    this.SPLIT_TOKEN_OF_.columns = /\t/;

    return;
};
kclv.Tokenizer.SandanshikiKanpan.Materials.prototype =
    Object.create(kclv.Tokenizer.SandanshikiKanpan.Base.prototype);
kclv.Tokenizer.SandanshikiKanpan.Materials.prototype.constructor =
    kclv.Tokenizer.SandanshikiKanpan.Base;

/**
 * Canonize time stamp string and get it.
 * @protected
 * @override
 * @param {string} timeStamp A string as a logged time stamp.
 * @returns {string} A string as a parameter of {@code Date} constructor.
 */
kclv.Tokenizer.SandanshikiKanpan.Materials.prototype.canonizeTimeStamp =
function(timeStamp) {
    // Convert "2013-04-23-01-23-45-6789" into "2013/04/23 01:23:45".
    return timeStamp.replace(
        /^(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{4})$/,
        '$1/$2/$3 $4:$5:$6'
    );
};

/**
 * @fileOverview A partical object for exceptions.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

// ================================================================
// Exceptions
// ================================================================

// ----------------------------------------------------------------
// Namespace for Exceptions
// ----------------------------------------------------------------

/**
 * A namespace for exceptions.
 *     TODO: Substitute more built-in exceptions into proper exceptions.
 * @public
 */
kclv.Exception = {};

// ----------------------------------------------------------------
// Exception for Abstract Methods
// ----------------------------------------------------------------

/**
 * An exception for abstract methods.
 *     Note: {@code Error} doesn't manipulate {@code this}. So we don't write
 *     {@code Error.call(this, 'message')}.
 * @public
 * @constructor
 * @extends {Error}
 */
kclv.Exception.AbstractMethod = function() {
    Error.call(this);

    /**
     * The name of the function instead of the anonymous function.
     * @public {string}
     * @override
     * @const
     */
    this.name = 'kclv.Exception.AbstractMethod';

    /**
     * Human-readable description of the error.
     * @public {string}
     * @override
     * @const
     */
    this.message =
        'The method must be overridden or implemented by a subtype.';

    return;
};
kclv.Exception.AbstractMethod.prototype = Object.create(Error.prototype);
kclv.Exception.AbstractMethod.prototype.constructor = Error;

// ----------------------------------------------------------------
// Base Exception for Invalid Kinds
// ----------------------------------------------------------------

/**
 * A base exception for invalid kinds.
 *     Note: {@code Error} doesn't manipulate {@code this}. So we don't write
 *     {@code Error.call(this, 'message')}.
 * @public
 * @constructor
 * @param {!string} name The name of the function instead of the anonymous
 *     function.
 * @param {!Array.<string>} validKinds Valid kinds.
 * @param {!string} kind A string representing an invalid kind.
 * @extends {Error}
 */
kclv.Exception.InvalidKind = function(name, validKinds, kind) {
    Error.call(this);

    /**
     * The name of the function instead of the anonymous function.
     * @public {string}
     * @override
     * @const
     */
    this.name = name;

    /**
     * Valid kinds.
     * @private {Array.<string>}
     * @const
     */
    this.validKinds_ = validKinds;

    /**
     * Human-readable description of the error.
     * @public {string}
     * @override
     * @const
     */
    this.message = this.buildMessage_(kind);

    return;
};
kclv.Exception.InvalidKind.prototype = Object.create(Error.prototype);
kclv.Exception.InvalidKind.prototype.constructor = Error;

/**
 * Build a error message according to specified kind and valid kinds.
 * @private
 * @param {string} invalidKind An invalid kind.
 * @returns {string} A error message.
 * @nosideeffects
 */
kclv.Exception.InvalidKind.prototype.buildMessage_ = function(invalidKind) {
    var formatter = new kclv.Formatter(),
        validKinds = formatter.quote(this.validKinds_);

    return 'The specified kind ' + formatter.quote(invalidKind) + ' is not ' +
        formatter.enumerate(validKinds, false) + '.';
};

// ----------------------------------------------------------------
// Exception for an Invalid Relation Kind
// ----------------------------------------------------------------

/**
 * An exception for an invalid kind of relation.
 * @public
 * @constructor
 * @extends {kclv.Exception.InvalidKind}
 * @param {!string} kind A string representing an invalid kind of relation.
 */
kclv.Exception.InvalidRelation = function(kind) {
    kclv.Exception.InvalidKind.call(
        this,
        'kclv.Exception.InvalidRelation',
        ['Materials', 'Ships'],
        kind
    );

    return;
};
kclv.Exception.InvalidRelation.prototype =
    Object.create(kclv.Exception.InvalidKind.prototype);
kclv.Exception.InvalidRelation.prototype.constructor =
    kclv.Exception.InvalidKind;

// ----------------------------------------------------------------
// Exception for an Invalid Material Kind
// ----------------------------------------------------------------

/**
 * An exception for an invalid kind of material.
 * @public
 * @constructor
 * @extends {kclv.Exception.InvalidKind}
 * @param {!string} kind A string representing an invalid kind of material.
 * @param {Array.<string>} opt_validKinds Valid kinds.
 */
kclv.Exception.InvalidMaterial = function(kind, opt_validKinds) {
    kclv.Exception.InvalidKind.call(
        this,
        'kclv.Exception.InvalidMaterial',
        opt_validKinds || ['Resources', 'Consumables'],
        kind
    );

    return;
};
kclv.Exception.InvalidMaterial.prototype =
    Object.create(kclv.Exception.InvalidKind.prototype);
kclv.Exception.InvalidMaterial.prototype.constructor =
    kclv.Exception.InvalidKind;

// ----------------------------------------------------------------
// Exception for an Invalid Ship's Specification
// ----------------------------------------------------------------

/**
 * An exception for an invalid indicator of ship's specification.
 * @public
 * @constructor
 * @extends {kclv.Exception.InvalidKind}
 * @param {!string} kind A string representing an invalid indicator of ship's
 *     specification.
 * @param {Array.<string>} opt_validKinds Valid kinds.
 */
kclv.Exception.InvalidSpecification = function(kind, opt_validKinds) {
    kclv.Exception.InvalidKind.call(
        this,
        'kclv.Exception.InvalidSpecification',
        opt_validKinds || ['Levels', 'Experiences'],
        kind
    );

    return;
};
kclv.Exception.InvalidSpecification.prototype =
    Object.create(kclv.Exception.InvalidKind.prototype);
kclv.Exception.InvalidSpecification.prototype.constructor =
    kclv.Exception.InvalidKind;

// ----------------------------------------------------------------
// Exception for Invalid Frequency
// ----------------------------------------------------------------

/**
 * An exception for invalid frequency.
 * @public
 * @constructor
 * @extends {kclv.Exception.InvalidKind}
 * @param {!string} kind A string representing invalid frequency.
 */
kclv.Exception.InvalidFrequency = function(kind) {
    kclv.Exception.InvalidKind.call(
        this,
        'kclv.Exception.InvalidFrequency',
        ['Yearly', 'Monthly', 'Weekly', 'Daily'],
        kind
    );

    return;
};
kclv.Exception.InvalidFrequency.prototype =
    Object.create(kclv.Exception.InvalidKind.prototype);
kclv.Exception.InvalidFrequency.prototype.constructor =
    kclv.Exception.InvalidKind;

// ----------------------------------------------------------------
// Exception for an Invalid Strategy
// ----------------------------------------------------------------

/**
 * An exception for an invalid strategy.
 *     Note: {@code Error} doesn't manipulate {@code this}. So we don't write
 *     {@code TypeError.call(this, 'message')}.
 * @public
 * @constructor
 * @extends {TypeError}
 * @param {!string} message Human-readable description of the error.
 */
kclv.Exception.InvalidStrategy = function(message) {
    TypeError.call(this);

    /**
     * The name of the function instead of the anonymous function.
     * @public {string}
     * @override
     * @const
     */
    this.name = 'kclv.Exception.InvalidStrategy';

    /**
     * Human-readable description of the error.
     * @public {string}
     * @override
     * @const
     */
    this.message = message;

    return this;
};
kclv.Exception.InvalidStrategy.prototype = Object.create(TypeError.prototype);
kclv.Exception.InvalidStrategy.prototype.constructor = TypeError;

// ----------------------------------------------------------------
// Exception for an Invalid Directive
// ----------------------------------------------------------------

/**
 * An exception for an invalid directive.
 * @public
 * @constructor
 * @extends {kclv.Exception.InvalidKind}
 * @param {!string} kind A string representing an invalid directive.
 * @param {Array.<string>} validDirectives Valid directives.
 */
kclv.Exception.InvalidDirective = function(directive, validDirectives) {
    kclv.Exception.InvalidKind.call(
        this,
        'kclv.Exception.InvalidDirective',
        validDirectives,
        directive
    );

    return;
};
kclv.Exception.InvalidDirective.prototype =
    Object.create(kclv.Exception.InvalidKind.prototype);
kclv.Exception.InvalidDirective.prototype.constructor =
    kclv.Exception.InvalidKind;

// ----------------------------------------------------------------
// Exception for Files
// ----------------------------------------------------------------

/**
 * An exception for files.
 *     Note: {@code Error} doesn't manipulate {@code this}. So we don't write
 *     {@code Error.call(this, 'message')}.
 * @public
 * @constructor
 * @extends {Error}
 * @param {!string} path A string of the opening file.
 */
kclv.Exception.File = function(path) {
    Error.call(this);

    /**
     * The name of the function instead of the anonymous function.
     * @public {string}
     * @override
     * @const
     */
    this.name = 'kclv.Exception.File';

    /**
     * Human-readable description of the error.
     * @public {string}
     * @override
     * @const
     */
    this.message =
        'File (' +
        new ActiveXObject('Scripting.FileSystemObject').
            GetAbsolutePathName(path) +
        ') could not opened.';

    return;
};
kclv.Exception.File.prototype = Object.create(Error.prototype);
kclv.Exception.File.prototype.constructor = Error;

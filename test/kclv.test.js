/**
 * @fileOverview Test Library on QUnit for KanColle Logistics Visualizer.
 *     Caveat: This file is encoded as UTF-8N (with BOM).
 *     Note: IE8 converts an exception into a raw object.
 * @version 0.0.0
 * @author kclv@ermitejo.com (MORIYA Masaki, alias "Gardejo")
 * @license The MIT license (See LICENSE.txt)
 * @see ../lib/kclv.js
 */


// ================================================================
// JSLint Directives
// ================================================================

/*jslint
    nomen    : true,
    plusplus : true,
    regexp   : true,
    todo     : true,
    unparam  : true,
    vars     : true,
    white    : true
*/

/*global
    ActiveXObject : false,
    JSON          : false,
    jsviews       : false
*/


// ================================================================
// Script mode syntax (Whole-library)
// ================================================================

'use strict'; // No critic.


// ================================================================
// Namespace for Test Wrappers
// ================================================================

var kclv;

kclv.Test = {};


// ================================================================
module('Inscription');
// ================================================================

test('kclv.Inscription', function() {
    var inscription = new kclv.Inscription();

    deepEqual(
        inscription.name,
        'KanColle Logistics Visualizer',
        'Has a proper name.'
    );

    deepEqual(
        inscription.version,
        '0.0.0',
        'Has a proper version number.'
    );

    deepEqual(
        inscription.stage,
        'Alpha',
        'Has a proper stage string.'
    );
});


// ================================================================
module('Factory');
// ================================================================

test('kclv.Factory', function() {
    kclv.Foo = function() { return; }; // Object
    kclv.Bar = {}; // Namespace
    kclv.Bar.Baz = function(qux) { this.qux_ = qux; }; // Object

    var foo = new kclv.Foo(),
        baz = new kclv.Bar.Baz(),
        qux = new kclv.Bar.Baz(42);

    /*
    // TODO: Not implemented yet.
    ok(
        kclv.Factory.getInstance(null, 'Date'),
        'Creates an object on global namespace.'
    );
    */

    // TODO: 'Function.prototype.bind called on incompatible undefined'
    deepEqual(
        kclv.Factory.getInstance(kclv, 'Foo'),
        foo,
        'Creates an object right under root namespace.'
    );

    deepEqual(
        kclv.Factory.getInstance(kclv, 'Bar.Baz'),
        baz,
        'Creates an object under same node namespace.'
    );

    deepEqual(
        kclv.Factory.getInstance(kclv.Bar, 'Baz'),
        baz,
        'Creates an object under same node namespace.'
    );

    deepEqual(
        kclv.Factory.getInstance(kclv, 'Bar.Baz', [42]),
        qux,
        'Creates an object with an argument.'
    );

    // TODO: Even more tests.
});


// ================================================================
module('Formatter');
// ================================================================

test('kclv.Formatter', function() {
    var formatter = new kclv.Formatter();

    deepEqual(
        formatter.quote('foo'),
        '"foo"',
        'Quotes a string.'
    );

    deepEqual(
        formatter.quote(['foo', 'bar', 'baz', 'qux']),
        ['"foo"', '"bar"', '"baz"', '"qux"'],
        'Quotes a string of all elements of an array.'
    );

    deepEqual(
        formatter.quote(['foo', 'bar', 'baz', 'qux'], [0, 2]),
        ['"foo"', 'bar', '"baz"', 'qux'],
        'Quotes a string of specified elements of an array.'
    );

    deepEqual(
        formatter.unquote('"foo"'),
        'foo',
        'Unquotes a string.'
    );

    deepEqual(
        formatter.unquote(['"foo"', '"bar"', '"baz"', '"qux"']),
        ['foo', 'bar', 'baz', 'qux'],
        'Unquotes a string of all elements of an array.'
    );

    deepEqual(
        formatter.unquote(['"foo"', '"bar"', '"baz"', '"qux"'], [0, 2]),
        ['foo', '"bar"', 'baz', '"qux"'],
        'Unquotes a string of specified elements of an array.'
    );

    deepEqual(
        formatter.parenthesize('foo'),
        '(foo)',
        'Parenthesizes a string.'
    );

    deepEqual(
        formatter.parenthesize(['foo', 'bar', 'baz', 'qux']),
        ['(foo)', '(bar)', '(baz)', '(qux)'],
        'Parenthesizes a string of all elements of an array.'
    );

    deepEqual(
        formatter.parenthesize(['foo', 'bar', 'baz', 'qux'], [0, 2]),
        ['(foo)', 'bar', '(baz)', 'qux'],
        'Parenthesizes a string of specified elements of an array.'
    );

    deepEqual(
        formatter.integerize('168'),
        168,
        'Integerizes an integer-like string.'
    );

    deepEqual(
        formatter.integerize(['168', '58', '19', '8', '401']),
        [168, 58, 19, 8, 401],
        'Integerizes an integer-like string of all elements of an array.'
    );

    deepEqual(
        formatter.integerize(['168', '58', '19', '8', '401'], [0, 2]),
        [168, '58', 19, '8', '401'],
        'Integerizes an integer-like string of specified elements of an array.'
    );

    deepEqual(
        formatter.commify(1750), // Long tons, displacement of Fubuki
        '1,750',
        'Commifies a number.'
    );

    deepEqual(
        formatter.commify(16858198.401),
        '16,858,198.401',
        'Commifies (the integer part of) a number.'
    );

    deepEqual(
        formatter.commify('Nanodesu!'),
        'Nanodesu!',
        'Does not commify a string.'
    );

    deepEqual(
        formatter.commify([4000, 2000, 5000, 5200, 20]), // A recipe for Taihou
        ['4,000', '2,000', '5,000', '5,200', '20'],
        'Commifies a number of all elements of an array.'
    );

    deepEqual(
        formatter.commify([4000, 2000, 5000, 5200, 20], [0, 2]),
        ['4,000', 2000, '5,000', 5200, 20],
        'Commifies a number of specified elements of an array.'
    );

    deepEqual(
        formatter.dialogue(new Error('foobar')),
        'Error: foobar',
        'Converts an exception object into a human-readable string.'
    );

    deepEqual(
        formatter.dialogue(),
        'Something wrong.',
        'Converts a null value into a human-readable string.'
    );

    deepEqual(
        formatter.dialogue({ foo: 'bar'}),
        'Something wrong. Object notation is:\n\n{\n    "foo": "bar"\n}',
        'Converts an object into a human-readable string.'
    );

    // TODO: Even more tests: #dialogue (too long parameter)
});


/*
// ================================================================
module('Exceptions');
// ================================================================

test('kclv.Exception', function() {
    // TODO: Even more tests.
});
*/


// ================================================================
module('Array');
// ================================================================

test('kclv.Array', function() {
    deepEqual(
        kclv.Array.values([1,2,3,4], [1,3]),
        [2,4],
        'Slices an array by indices.'
    );

    deepEqual(
        kclv.Array.values([5,6,7,8], [2,0]),
        [7,5],
        'Slices an array with a proper order of indices.'
    );

    throws(
        function() { kclv.Array.values([1,2,3,4], [1,3,42]); },
        navigator.userAgent.indexOf('MSIE') >= 0 ? Error : RangeError,
        'Throws RangeError because 42 is an invalid array index.'
    );

    deepEqual(
        kclv.Array.indices([168, 58, 19, 8, 401]),
        [0, 1, 2, 3, 4],
        'Gets all indices of an array.'
    );

    deepEqual(
        kclv.Array.indices([]),
        [],
        'Gets all indices as an emtpy array if spceficied array is empty.'
    );

    deepEqual(
        kclv.Array.maximum([ [168], [58], [19], [8], [401] ], [0]),
        401,
        'Gets the maximum value of the spceficied two-dimensional array.'
    );

    deepEqual(
        kclv.Array.maximum([
            [ 'I-168', 168 ],
            [ 'I-58',   58 ],
            [ 'I-19',   19 ],
            [ 'I-8',     8 ],
            [ 'I-402', 401 ]
        ], [1]),
        401,
        'Gets the maximum value (in the specified indices) ' +
            'of the spceficied two-dimensional array.'
    );

    deepEqual(
        kclv.Array.minimum([ [168], [58], [19], [8], [401] ], [0]),
        8,
        'Gets the minimum value of the spceficied two-dimensional array.'
    );

    deepEqual(
        kclv.Array.minimum([
            [ 'I-168', 168 ],
            [ 'I-58',   58 ],
            [ 'I-19',   19 ],
            [ 'I-8',     8 ],
            [ 'I-402', 401 ]
        ], [1]),
        8,
        'Gets the minimum value (in the specified indices) ' +
            'of the spceficied two-dimensional array.'
    );

    // TODO: Even more tests.
});


// ================================================================
module('Pseudo-Interfaces');
// ================================================================

test('kclv.PseudoInterface', function() {
    kclv.SubmarineLike = function() { this.methodNames = ['dive']; };
    kclv.SubmarineLike.prototype = new kclv.PseudoInterface();

    kclv.I58 = function() {
        this.dive = function() { return 'Orel cruising dechi!'; };
    };
    kclv.Nagato = function() {
        this.fire = function() { return 'Puka puka...'; };
    };
    kclv.Ju87CKai = function() {
        this.dive = 'Stuka!';  // Not a method but a property.
    };

    var submarineLike = new kclv.SubmarineLike(),
        i58 = new kclv.I58(),
        nagato = new kclv.Nagato(),
        ju87cKai = new kclv.Ju87CKai();

    submarineLike.ensure(i58);
    ok(
        true,
        'Ensures an object has some methods: SSV I-58 is like a submarine.'
    );

    ok(
        submarineLike.implemented(i58),
        'Cheks whether an object implements some methods: SSV I-58 can dive.'
    );

    throws(
        function() { submarineLike.ensure(nagato); },
        navigator.userAgent.indexOf('MSIE') >= 0 ? Error : TypeError,
        'Throws TypeError if an object does not have some methods: ' +
            'BB Nagato is not like a submarine, but like a battleship.'
    );

    ok(
        ! submarineLike.implemented(nagato),
        'Cheks whether an object implements some methods: ' +
            'BB Nagato canot dive.'
    );

    throws(
        function() { submarineLike.ensure(ju87cKai); },
        navigator.userAgent.indexOf('MSIE') >= 0 ? Error : TypeError,
        'Throws TypeError if an object does not have some methods: ' +
            'Ju87C-Kai is not like a submarine, but like a carrier-based ' +
            'bomber.'
    );

    ok(
        ! submarineLike.implemented(ju87cKai),
        'Cheks whether an object implements some methods: ' +
            ' Ju87C-Kai does not have dive method, but have dive property.'
    );
});


// ================================================================
module('Configuration');
// ================================================================

test('kclv.Configuration', function() {
    var configuration = { 'foo' : 58, 'bar' : { 'baz' : 168 } };

    kclv.Configuration.load(configuration);
    ok(
        true,
        'Stores an object by an argument.'
    );

    deepEqual(
        kclv.Configuration.get(),
        configuration,
        'Returns whole object tree.'
    );

    deepEqual(
        kclv.Configuration.get('foo'),
        58,
        'Walks its own tree and returns an object leaf right under a root.'
    );

    deepEqual(
        kclv.Configuration.get('bar'),
        { 'baz' : 168 },
        'Walks its own tree and returns an object node.'
    );

    deepEqual(
        kclv.Configuration.get('bar.baz'),
        168,
        'Walks its own tree and returns an object leaf.'
    );

    throws(
        function() { kclv.Configuration.get('qux'); },
        navigator.userAgent.indexOf('MSIE') >= 0 ? Error : ReferenceError,
        'Throws ReferenceError ' +
            'if a strict configuration does not have the specified ' +
            'property.'
    );

    deepEqual(
        kclv.Configuration.get('qux', true),
        undefined,
        'Does not throw an exception ' +
            'if a loose configuration does not have the specified property.'
    );

    kclv.Configuration.clear();
    throws(
        function() { kclv.Configuration.get(); },
        Error,
        'Throws Error if configuration not to be loaded.'
    );

    // TODO: Even more tests: from file.
});


/*
// ================================================================
module('I/O Stream');
// ================================================================

test('kclv.Stream', function() {
    // TODO: Even more tests.
});
*/


// ================================================================
module('Date');
// ================================================================

test('kclv.Date', function() {
    var date,
        epochDay = '2013/04/23'; // The KanColle Epoch Day

    ok(
        new kclv.Date().toString(),
        'Delegates toString() to its own date_ property.'
    );

    date = new Date();
    deepEqual(
        new kclv.Date(date).toString(),
        date.toString(),
        'Is to be built from a Date object as an argument of the constructor.'
    );

    date = new Date(epochDay);
    deepEqual(
        new kclv.Date(epochDay).toString(),
        date.toString(),
        'Is to be built from a date string as an argument of the constructor.'
    );

    deepEqual(
        new kclv.Date('2010/01/03').toWeek(),
        [2009, 53],
        'Considers 2010/01/03 as 53rd week of year 2009.'
    );

    deepEqual(
        new kclv.Date('2010/01/04').toWeek(),
        [2010, 1],
        'Considers 2010/01/04 as 1st week of year 2010.'
    );

    deepEqual(
        new kclv.Date('2012/12/31').toWeek(),
        [2013, 1],
        'Considers 2012/12/30 as 1st week of year 2013.'
    );

    deepEqual(
        new kclv.Date(epochDay).toWeekString(),
        '2013-W17',
        'Can stringify week number as ISO 8601 format.'
    );

    deepEqual(
        new kclv.Date(epochDay).toWeekString(''),
        '201317',
        'Can stringify week number by specified delimiter token.'
    );

    deepEqual(
        new kclv.Date('2010/01/04').toWeekString(),
        '2010-W01',
        'Can stringify week number with zero padding.'
    );

    deepEqual(
        new kclv.Date('2010/01/04').toPeriod('Yearly'),
        '2010',
        'Can convert Date into a yearly period.'
    );

    deepEqual(
        new kclv.Date('2010/01/04').toPeriod('Monthly'),
        '2010/01',
        'Can convert Date into a monthly period.'
    );

    deepEqual(
        new kclv.Date('2010/01/04').toPeriod('Weekly'),
        '2010-W01',
        'Can convert Date into a weekly period.'
    );

    deepEqual(
        new kclv.Date('2010/01/04 12:34:56').toPeriod('Daily'),
        '2010/01/04',
        'Can convert Date into a daily period.'
    );

    // TODO: Even more tests.
});


// ================================================================
module('Game Rules');
// ================================================================

// ----------------------------------------------------------------
// Materials
// ----------------------------------------------------------------

test('kclv.Game.Materials', function() {
    deepEqual(
        kclv.Game.Materials.getCeilingOf('Resources'),
        0,
        'Cannot calculate a ceiling of resources when HQ level is not defined.'
    );

    deepEqual(
        kclv.Game.Materials.getCeilingOf('Resources', null),
        0,
        'Cannot calculate a ceiling of resources when HQ level is null.'
    );

    deepEqual(
        kclv.Game.Materials.getCeilingOf('Resources', 0),
        0,
        'Cannot calculate a ceiling of resources when HQ level is imaginary 0.'
    );

    deepEqual(
        kclv.Game.Materials.getCeilingOf('Resources', 1),
        1000,
        'Calculates a ceiling of resources when HQ level is 1, minimum.'
    );

    deepEqual(
        kclv.Game.Materials.getCeilingOf('Resources', 120),
        30750,
        'Calculates a ceiling of resources when HQ level is 120, maximum.'
    );

    deepEqual(
        kclv.Game.Materials.getCeilingOf('Resources', 121),
        31000,
        'Calculates a ceiling of resources when HQ level is imaginary 121.'
    );

    deepEqual(
        kclv.Game.Materials.getCeilingOf('Consumables', 120),
        0,
        'Calculates a ceiling of consumables: Always 0.'
    );

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Ships
// ----------------------------------------------------------------

test('kclv.Game.Ships', function() {
    deepEqual(
        kclv.Game.Ships.ABBREVIATION_FOR['駆逐艦'],
        'DD',
        'Returns the abbreviation for Destroyer.'
    );

    deepEqual(
        kclv.Game.Ships.EXPERIENCES[99],
        1000000,
        'Returns the experience points necessary for "Kekkon Kakko Kari".'
    );

    // TODO: Even more tests.
});


// ================================================================
module('Agents');
// ================================================================

// ----------------------------------------------------------------
// Base
// ----------------------------------------------------------------

kclv.Test.Agent = {};

// ----------------------------------------------------------------
// Materials
// ----------------------------------------------------------------

kclv.Test.Agent.Materials = function() {
    this.dates = [
        new Date('2013/04/23 00:00:00'),
        new Date('2013/07/10 00:00:00'),
        new Date('2013/07/17 00:00:00')
    ];

    this.materials = {
        //   Date           Fue  Amm  Ste  Bau  Rep  Con  Dev
        high : [
            [this.dates[0], 116, 126, 136, 146, 156, 166, 176],
            [this.dates[1], 216, 226, 236, 246, 256, 266, 276],
            [this.dates[2], 316, 326, 336, 346, 356, 366, 376]
        ],
        average : [
            [this.dates[0], 114, 124, 134, 144, 154, 164, 174],
            [this.dates[1], 214, 224, 234, 244, 254, 264, 274],
            [this.dates[2], 314, 324, 334, 344, 354, 364, 374]
        ],
        low : [
            [this.dates[0], 111, 121, 131, 141, 151, 161, 171],
            [this.dates[1], 211, 221, 231, 241, 251, 261, 271],
            [this.dates[2], 311, 321, 331, 341, 351, 361, 371]
        ]
    };

    return;
};

kclv.Test.Agent.Materials.prototype.test = function(agent, configuration) {
    configuration.relation = {};
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(this.materials.low),
        'Builds a relation (undefined): default (low) values in whole period.'
    );

    configuration.relation = { values : null };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(this.materials.low),
        'Builds a relation (null): default (low) values in whole period.'
    );

    configuration.relation = { duration : 0 };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert([]),
        'Builds a relation: default (low) values in an empty period.'
    );

    // TODO: { duration : 1 }
    // It needs a stub for Date or to build Date dynamically.
    // See tests for Selectors.

    configuration.relation = {
        inception : '2013/07/10 00:00:00', expiration : '2013/07/17 00:00:00'
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(this.materials.low.slice(1,3)),
        'Builds a relation: default (low) values ' +
            'from Kure & Sasebo till Maiduru.'
    );

    configuration.relation = {
        inception : '2013/07/10 00:00:00', expiration : null
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(this.materials.low.slice(1,4)),
        'Builds a relation: default (low) values ' +
            'from Kure & Sasebo till now.'
    );

    return;
};

// ----------------------------------------------------------------
// Materials: KCRDB
// ----------------------------------------------------------------

test('kclv.Agent.KCRDB : Materials', function() {
    if (navigator.userAgent.indexOf('MSIE') >= 0) {
        ok(true, 'TODO: MSIE cannot the tests.');
        return;
    }

    var test = new kclv.Test.Agent.Materials(),
        agent = new kclv.Agent.KCRDB(),
        configuration = { agent: { KCRDB: { path: {
            Materials : './KCRDB.Materials.log'
        } } } };

    test.test(agent, configuration);

    configuration.relation = { values : 'High' };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(test.materials.high),
        'Builds a relation (High): high values in whole period.'
    );

    configuration.relation = { values : 'Average' };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(test.materials.average),
        'Builds a relation (Average): average values in whole period.'
    );

    configuration.relation = { values : 'Low' };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(test.materials.low),
        'Builds a relation (Low): low values in whole period.'
    );

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Materials: Logbook
// ----------------------------------------------------------------

test('kclv.Agent.Logbook : Materials', function() {
    if (navigator.userAgent.indexOf('MSIE') >= 0) {
        ok(true, 'TODO: MSIE cannot the tests.');
        return;
    }

    var test = new kclv.Test.Agent.Materials(),
        agent = new kclv.Agent.Logbook(),
        configuration = { agent: { Logbook: { path: {
            Materials : './Logbook.Materials.log'
        } } } };

    test.test(agent, configuration);

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Ships
// ----------------------------------------------------------------

kclv.Test.Agent.Ships = function() {
    this.ships = [
    //    Arr Name          Class  Lv   Exp
        [  1, '電改',       'DD',   99, 1000000 ],
        [ 12, '千歳航改二', 'CVL', 149, 4359999 ],
        [ 24, '長門',       'BB',    1,       0 ]
    ];

    return;
};

kclv.Test.Agent.Ships.prototype.test = function(agent, configuration) {
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Ships'),
        new kclv.Relation.Ships().insert(this.ships),
        'Builds a relation.'
    );

    return;
};

// ----------------------------------------------------------------
// Ships: KCRDB
// ----------------------------------------------------------------

test('kclv.Agent.KCRDB : Ships', function() {
    if (navigator.userAgent.indexOf('MSIE') >= 0) {
        ok(true, 'TODO: MSIE cannot the tests.');
        return;
    }

    var test = new kclv.Test.Agent.Ships(),
        agent = new kclv.Agent.KCRDB(),
        configuration = { agent: { KCRDB: { path: {
            Ships : './KCRDB.Ships.csv'
        } } } };

    test.test(agent, configuration);

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Ships: Logbook
// ----------------------------------------------------------------

test('kclv.Agent.Logbook : Ships', function() {
    if (navigator.userAgent.indexOf('MSIE') >= 0) {
        ok(true, 'TODO: MSIE cannot the tests.');
        return;
    }

    var test = new kclv.Test.Agent.Ships(),
        agent = new kclv.Agent.Logbook(),
        configuration = { agent : { Logbook : { path : {
            Ships : './Logbook.Ships.csv'
        } } } };

    test.test(agent, configuration);

    // TODO: Even more tests.
});


// ================================================================
module('Tokenizers');
// ================================================================

// ----------------------------------------------------------------
// Base
// ----------------------------------------------------------------

kclv.Test.Tokenizer = function() {
    return;
};

kclv.Test.Tokenizer.prototype.test = function(tokenizer, string, rows, table) {
    deepEqual(
        tokenizer.toRows(string),
        rows,
        'Converts a string into rows (an one-dimensional array).'
    );

    deepEqual(
        rows.map(tokenizer.toColumns, tokenizer),
        table,
        'Converts rows (an one-dimensional array) into ' +
            'a table (a two-dimensional array) ' +
            'and normalize some columns.'
    );

    deepEqual(
        tokenizer.toRelationalArray(string),
        table,
        'Converts a string into a table (a two-dimensional array).'
    );

    return;
};

test('kclv.Tokenizer.Base', function() {
    var test = new kclv.Test.Tokenizer(),
        tokenizer = new kclv.Tokenizer.Base(),
        string =
            '"SSV","I-58",2,3\n' + // Orel cruising dechi!
            '"CV","Akagi",5,4\n' + // Tokyo Exp. to drum up results!
            '"BB","Yamato",5,5\n', // We're sorry but "Re" class is NG.
        rows = [
            '"SSV","I-58",2,3',
            '"CV","Akagi",5,4',
            '"BB","Yamato",5,5'
        ],
        table = [
            ['"SSV"', '"I-58"',   '2', '3'],
            ['"CV"',  '"Akagi"',  '5', '4'],
            ['"BB"',  '"Yamato"', '5', '5']
        ];

    test.test(tokenizer, string, rows, table);

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// KCRDB: Materials
// ----------------------------------------------------------------

test('kclv.Tokenizer.KCRDB.Materials', function() {
    var test = new kclv.Test.Tokenizer(),
        tokenizer = new kclv.Tokenizer.KCRDB.Materials(),
        string =
            '#2013/04/23 01:23:45#,1,2,3,4,5,6,7,8,9,10,11,12,13,14\n' +
            '#2013/07/10 12:34:56#,2,3,4,5,6,7,8,9,10,11,12,13,14,15\n',
        rows = [
            '#2013/04/23 01:23:45#,1,2,3,4,5,6,7,8,9,10,11,12,13,14',
            '#2013/07/10 12:34:56#,2,3,4,5,6,7,8,9,10,11,12,13,14,15'
        ],
        table = [
            [
                new Date('2013/04/23 01:23:45'),    // Date
                1,2,3,4,5,6,7,8,9,10,11,12,13,14    // Integers
            ],
            [
                new Date('2013/07/10 12:34:56'),
                2,3,4,5,6,7,8,9,10,11,12,13,14,15
            ]
        ];

    test.test(tokenizer, string, rows, table);

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// KCRDB: Ships
// ----------------------------------------------------------------

test('kclv.Tokenizer.KCRDB.Ships', function() {
    var test = new kclv.Test.Tokenizer(),
        tokenizer = new kclv.Tokenizer.KCRDB.Ships(),
        string =
            '1,"電改",237,"駆逐艦",99,1000000,0,' +
                '30,30,15,15,20,20,83,37,37,51,51,34,34,36,36,0,47,3,' +
                '"10cm連装高角砲","10cm連装高角砲","33号対水上電探","---",' +
                '0,0,0,0,53,79,63,49,84,55,42,12,0,"",1,10\n' +
            '12,"千歳航改二",296,"軽空母",149,4359999,1,' +
                '65,65,45,45,40,40,49,34,34,0,0,42,42,33,33,4,46,4,' +
                '"流星改","烈風","彗星一二型甲","彩雲",' +
                '24,16,11,8,34,13,82,65,74,6,97,17,0,"",1,10\n' +
            '24,"長門",80,"戦艦",1,0,100,' +
                '80,80,100,100,130,130,49,17,17,0,0,0,58,14,14,0,59,4,' +
                '"38cm連装砲","38cm連装砲","38cm連装砲","empty",' +
                '3,3,3,3,144,0,34,89,24,0,12,20,30,"長門改",0,5\n',
        rows = [
            '1,"電改",237,"駆逐艦",99,1000000,0,' +
                '30,30,15,15,20,20,83,37,37,51,51,34,34,36,36,0,47,3,' +
                '"10cm連装高角砲","10cm連装高角砲","33号対水上電探","---",' +
                '0,0,0,0,53,79,63,49,84,55,42,12,0,"",1,10',
            '12,"千歳航改二",296,"軽空母",149,4359999,1,' +
                '65,65,45,45,40,40,49,34,34,0,0,42,42,33,33,4,46,4,' +
                '"流星改","烈風","彗星一二型甲","彩雲",' +
                '24,16,11,8,34,13,82,65,74,6,97,17,0,"",1,10',
            '24,"長門",80,"戦艦",1,0,100,' +
                '80,80,100,100,130,130,49,17,17,0,0,0,58,14,14,0,59,4,' +
                '"38cm連装砲","38cm連装砲","38cm連装砲","empty",' +
                '3,3,3,3,144,0,34,89,24,0,12,20,30,"長門改",0,5'
        ],
        table = [
            [  1, '電改',       'DD',   99, 1000000 ],
            [ 12, '千歳航改二', 'CVL', 149, 4359999 ],
            [ 24, '長門',       'BB',    1,       0 ]
        ];

    test.test(tokenizer, string, rows, table);

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Logbook: Materials
// ----------------------------------------------------------------

test('kclv.Tokenizer.Logbook.Materials', function() {
    var test = new kclv.Test.Tokenizer(),
        tokenizer = new kclv.Tokenizer.Logbook.Materials(),
        string =
            '日付,燃料,弾薬,鋼材,ボーキ,高速修復材,高速建造材,開発資材\n' +
            '2013-04-23 01:23:45,1,2,3,4,5,6,7\n' +
            '2013-07-10 12:34:56,2,3,4,5,6,7,8\n',
        rows = [
            '2013-04-23 01:23:45,1,2,3,4,5,6,7',
            '2013-07-10 12:34:56,2,3,4,5,6,7,8'
        ],
        table = [
            [
                new Date('2013/04/23 01:23:45'),    // Date
                1,2,3,4,5,6,7                       // Integers
            ],
            [
                new Date('2013/07/10 12:34:56'),
                2,3,4,5,6,7,8
            ]
        ];

    test.test(tokenizer, string, rows, table);

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Logbook: Ships
// ----------------------------------------------------------------

test('kclv.Tokenizer.Logbook.Ships', function() {
    var test = new kclv.Test.Tokenizer(),
        tokenizer = new kclv.Tokenizer.Logbook.Ships(),
        string =
            ',ID,艦隊,名前,艦種,疲労,回復,Lv,Next,経験値,制空,' +
                '装備1,装備2,装備3,装備4,' +
                'HP,火力,雷装,対空,装甲,回避,対潜,索敵,運\n' +
            '1,1,,電改,駆逐艦,72,,99,0,1000000,0,' +
                '10cm連装高角砲,10cm連装高角砲,33号対水上電探,,' +
                '30,53,79,63,49,84,55,42,12\n' +
            '2,12,,千歳航改二,軽空母,49,,149,1,4359999,40,' +
                '流星改,烈風,彗星一二型甲,彩雲,' +
                '65,34,13,82,65,74,6,96,17\n' +
            '3,24,,長門,戦艦,49,,1,100,0,0,' +
                '38cm連装砲,38cm連装砲,38cm連装砲,,' +
                '80,144,0,34,89,24,0,12,20\n',
        rows = [
            '1,1,,電改,駆逐艦,72,,99,0,1000000,0,' +
                '10cm連装高角砲,10cm連装高角砲,33号対水上電探,,' +
                '30,53,79,63,49,84,55,42,12',
            '2,12,,千歳航改二,軽空母,49,,149,1,4359999,40,' +
                '流星改,烈風,彗星一二型甲,彩雲,' +
                '65,34,13,82,65,74,6,96,17',
            '3,24,,長門,戦艦,49,,1,100,0,0,' +
                '38cm連装砲,38cm連装砲,38cm連装砲,,' +
                '80,144,0,34,89,24,0,12,20'
        ],
        table = [
            [  1, '電改',       'DD',   99, 1000000 ],
            [ 12, '千歳航改二', 'CVL', 149, 4359999 ],
            [ 24, '長門',       'BB',    1,       0 ]
        ];

    test.test(tokenizer, string, rows, table);

    // TODO: Even more tests.
});


// ================================================================
module('Selectors');
// ================================================================

test('kclv.SelectorLike', function() {
    kclv.Selector.Foo = function() {
        this.select = function() { return; };
    };
    kclv.Selector.Bar = function() {
        return;
    };

    var selectorInterface = new kclv.SelectorLike(),
        foo = new kclv.Selector.Foo(),
        bar = new kclv.Selector.Bar();

    selectorInterface.ensure(foo);
    ok(
        true,
        'SelectorLike interface ensures foo object has #select method.'
    );

    throws(
        function() { selectorInterface.ensure(bar); },
        navigator.userAgent.indexOf('MSIE') >= 0 ? Error : TypeError,
        'SelectorLike interface does not ensure bar object has #select method.'
    );

    // TODO: Even more tests.
});

test('kclv.Selector.Retrospection', function() {
    var now = new Date(),
        relation = [],
        selector,
        daysBefore,
        someday;

    for ( daysBefore = 0; daysBefore <= 2; daysBefore++ ) {
        someday = new Date();
        someday.setHours(23, 59, 59); // Note: Consider a time lag.
        someday.setDate( now.getDate() - daysBefore );
        relation.unshift([someday, daysBefore]);
    }

    selector = new kclv.Selector.Retrospection(3);
    deepEqual(
        relation.filter(selector.select, selector),
        relation,
        'Selects the whole day.'
    );

    selector = new kclv.Selector.Retrospection(2);
    deepEqual(
        relation.filter(selector.select, selector),
        relation,
        'Selects from 2 days ago: the whole day.'
    );

    selector = new kclv.Selector.Retrospection(1);
    deepEqual(
        relation.filter(selector.select, selector),
        relation.slice(-2),
        'Selects from 1 day ago.'
    );

    selector = new kclv.Selector.Retrospection(0);
    deepEqual(
        relation.filter(selector.select, selector),
        relation.slice(-1),
        'Selects from 0 day ago.'
    );
});

test('kclv.Selector.Period', function() {
    var relation = [
            [ new Date('2013/04/23'), 'The Yokosuka epoch' ],
            [ new Date('2013/07/10'), 'The Kure epoch'     ],
            [ new Date('2013/07/10'), 'The Sasebo epoch'   ],
            [ new Date('2013/07/17'), 'The Maiduru epoch'  ]
        ],
        selector;

    selector = new kclv.Selector.Period();
    deepEqual(
        relation.filter(selector.select, selector),
        relation,
        'Selects from the UNIX epoch to now: the whole day.'
    );

    selector = new kclv.Selector.Period('2013/04/23');
    deepEqual(
        relation.filter(selector.select, selector),
        relation,
        'Selects from the Yokosuka epoch to now: the whole day.'
    );

    selector = new kclv.Selector.Period('2013/04/23', '2013/07/10');
    deepEqual(
        relation.filter(selector.select, selector),
        relation.slice(0, 3),
        'Selects from the Yokosuka epoch to the Sasebo epoch.'
    );

    selector = new kclv.Selector.Period(null, '2013/07/10');
    deepEqual(
        relation.filter(selector.select, selector),
        relation.slice(0, 3),
        'Selects from the UNIX epoch to the Sasebo epoch.'
    );

    // TODO: Even more tests.
});


// ================================================================
module('Projectors');
// ================================================================

test('kclv.ProjectorLike', function() {
    kclv.Projector.Foo = function() {
        this.project = function() { return; };
    };
    kclv.Projector.Bar = function() {
        return;
    };

    var projectorInterface = new kclv.ProjectorLike(),
        foo = new kclv.Projector.Foo(),
        bar = new kclv.Projector.Bar();

    projectorInterface.ensure(foo);
    ok(
        true,
        'ProjectorLike interface ensures ' +
            'that foo object has #project method.'
    );

    throws(
        function() { projectorInterface.ensure(bar); },
        navigator.userAgent.indexOf('MSIE') >= 0 ? Error : TypeError,
        'ProjectorLike interface does not ensure ' +
            'that bar object has #project method.'
    );

    // TODO: Even more tests.
});

kclv.Test.Projector = function() {
    this.relation = [
    //   Date   Fuel    Ammo    Steel   Bauxite Repair  Const   Dev
        ['Foo', 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76]
    ];

    return;
};

test('kclv.Projector.Materials.High', function() {
    var test = new kclv.Test.Projector(),
        projector = new kclv.Projector.Materials.High();

    deepEqual(
        test.relation.map( projector.project ),
        [['Foo', 16, 26, 36, 46, 56, 66, 76]],
        'Projects as high.'
    );

    // TODO: Even more tests.
});

test('kclv.Projector.Materials.Average', function() {
    var test = new kclv.Test.Projector(),
        projector = new kclv.Projector.Materials.Average();

    deepEqual(
        test.relation.map( projector.project ),
        [['Foo', 14, 24, 34, 44, 54, 64, 74]],
        'Projects as average.'
    );

    // TODO: Even more tests.
});

test('kclv.Projector.Materials.Low', function() {
    var test = new kclv.Test.Projector(),
        projector = new kclv.Projector.Materials.Low();

    deepEqual(
        test.relation.map( projector.project ),
        [['Foo', 11, 21, 31, 41, 51, 61, 71]],
        'Projects as low.'
    );

    // TODO: Even more tests.
});


// ================================================================
module('Relations');
// ================================================================

kclv.Test.Relation = {};

// ----------------------------------------------------------------
// Base
// ----------------------------------------------------------------

kclv.Test.Relation.Base = function() {
    return;
};

kclv.Test.Relation.Base.prototype.testThreshold = function(
    testee, expectations
) {
    Object.keys(this.expectations).forEach( function(key, index, keys) {
        deepEqual(
            testee.minimum(key),
            expectations[key][0],
            'Gets the minimum value of ' + key + '.'
        );

        deepEqual(
            testee.maximum(key),
            expectations[key][1],
            'Gets the maximum value of ' + key + '.'
        );
    }, this );

    return;
};

kclv.Test.Relation.Base.prototype.test = function(relation) {
    deepEqual(
        relation.count(),
        this.array.length,
        'Has ' + this.array.length + 'tuples.'
    );

    this.testThreshold(relation, this.expectations);

    return;
};

test('kclv.Relation.Base', function() {
    var array = [
            ['SS',  'I-168',  111],
            ['SSV', 'I-58',   222],
            ['AS',  'Taigei', 333]
        ],
        relation = new kclv.Relation.Base().insert(
            [['BB', 'Nagato', 444]]
        );

    deepEqual(
        new kclv.Relation.Base().insert(array),
        ( function() {
            var expectation = new kclv.Relation.Base();
            expectation.relation = array; // Note: It should be protected.
            return expectation;
        }() ),
        'Inserts a two-dimensinal array.'
    );

    deepEqual(
        new kclv.Relation.Base().insert(relation),
        relation,
        'Inserts an other relation.'
    );

    throws(
        function() { new kclv.Relation.Base().insert(new Date()); },
        navigator.userAgent.indexOf('MSIE') >= 0 ? Error : TypeError,
        'Throws an exception when an invalid object was inserted.'
    );

    deepEqual(
        new kclv.Relation.Base().insert(array).select([0, 2]).relation,
        [
            ['SS', 'I-168',  111],
            ['AS', 'Taigei', 333]
        ],
        'Selects tuples.'
    );

    throws(
        function() { new kclv.Relation.Base().select(new Date()); },
        navigator.userAgent.indexOf('MSIE') >= 0 ? Error : TypeError,
        'Throws an exception ' +
            'when an invalid object was specified in selection.'
    );

    deepEqual(
        new kclv.Relation.Base().insert(array).project([0, 1]).relation,
        [
            ['SS',  'I-168' ],
            ['SSV', 'I-58'  ],
            ['AS',  'Taigei']
        ],
        'Projects attributes.'
    );

    throws(
        function() { new kclv.Relation.Base().project(new Date()); },
        navigator.userAgent.indexOf('MSIE') >= 0 ? Error : TypeError,
        'Throws an exception ' +
            'when an invalid object was specified in projection.'
    );

    throws(
        function() {
            new kclv.Relation.Base().insert([ [168], [58], [8], [19], [401] ]).
                maximum();
        },
        Error,
        'Throws an exception ' +
            'when maximum method was called without a parameter.'
    );

    throws(
        function() {
            new kclv.Relation.Base().insert([ [168], [58], [8], [19], [401] ]).
                maximum('foo');
        },
        Error,
        'Throws an exception ' +
            'when maximum method was called with a string parameter.'
    );

    deepEqual(
        new kclv.Relation.Base().insert([ [168], [58], [8], [19], [401] ]).
            maximum([0]),
        401,
        'Gets the maximum value.'
    );

    throws(
        function() {
            new kclv.Relation.Base().insert([ [168], [58], [8], [19], [401] ]).
                minimum();
        },
        Error,
        'Throws an exception ' +
            'when minimum method was called without a parameter.'
    );

    throws(
        function() {
            new kclv.Relation.Base().insert([ [168], [58], [8], [19], [401] ]).
                minimum('foo');
        },
        Error,
        'Throws an exception ' +
            'when minimum method was called with a string parameter.'
    );

    deepEqual(
        new kclv.Relation.Base().insert([ [168], [58], [8], [19], [401] ]).
            minimum([0]),
        8,
        'Gets the minimum value.'
    );

    deepEqual(
        new kclv.Relation.Base().insert([ [1], [2], [3] ]).count(),
        3,
        'Counts an amout of tuples.'
    );

    deepEqual(
        new kclv.Relation.Base().insert([ [168], [58], [8], [19], [401] ]).
            sort( function(a, b) { return b[0] - a[0]; } ),
        [ [401], [168], [58], [19], [8] ],
        'Sorts the tuples descendingly.'
    );

    deepEqual(
        new kclv.Relation.Base().insert([ [168], [58], [8], [19], [401] ]).
            sort( function(a, b) { return a[0] - b[0]; } ),
        [ [8], [19], [58], [168], [401] ],
        'Sorts the tuples ascendingly.'
    );

    deepEqual(
        new kclv.Relation.Base().insert([ [1], [2], [3] ]).
            map( function( element, index, array ) {
                return element * 2;
            } ),
        [ 2, 4, 6 ],
        'Creates a new relation with the results of doubled numbers.'
    );

    deepEqual(
        new kclv.Relation.Base().insert([ [1], [2], [3] ]).
            reduce( function(previous, current, index, array) {
                return previous + current[0];
            }, 100 ),
        106,
        'Applies a reducer function.'
    );

    deepEqual(
        new kclv.Relation.Base().insert([ [1], [2], [3] ]).clone(),
        new kclv.Relation.Base().insert([ [1], [2], [3] ]),
        'Clones itself.'
    );

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Materials
// ----------------------------------------------------------------

kclv.Test.Relation.Materials = function() {
    kclv.Test.Relation.Base.call(this);

    this.array = [
        // Date                   Fue Amm Ste Bau Rep Con Dev
        [ new Date('2013/04/23'), 11, 12, 13, 14, 15, 16, 17 ],
        [ new Date('2013/07/10'), 21, 22, 23, 24, 25, 26, 27 ],
        [ new Date('2013/07/10'), 31, 32, 33, 34, 35, 36, 37 ],
        [ new Date('2013/07/11'), 41, 42, 43, 44, 45, 46, 47 ],
        [ new Date('2013/07/17'), 51, 52, 53, 54, 55, 56, 57 ]
    ];

    this.expectations = {
        Resources   : [ 11, 54 ],
        Fuel        : [ 11, 51 ],
        Ammunition  : [ 12, 52 ],
        Steel       : [ 13, 53 ],
        Bauxite     : [ 14, 54 ],
        Consumables : [ 15, 57 ],
        Repair      : [ 15, 55 ],
        Construction: [ 16, 56 ],
        Development : [ 17, 57 ]
    };

    return;
};
kclv.Test.Relation.Materials.prototype =
    Object.create(kclv.Test.Relation.Base.prototype);
kclv.Test.Relation.Materials.prototype.constructor =
    kclv.Test.Relation.Base;

test('kclv.Relation.Materials', function() {
    var test = new kclv.Test.Relation.Materials(),
        relation = new kclv.Relation.Materials().insert(test.array);

    test.test(relation);

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Ships
// ----------------------------------------------------------------

kclv.Test.Relation.Ships = function() {
    kclv.Test.Relation.Base.call(this);

    this.array = [
    //    Arr Name            Class  Lv   Exp
        [  1, '電改',         'DD',   99, 1000000 ],
        [ 12, '千歳航改二',   'CVL', 149, 4359999 ],
        [ 13, '千代田航改二', 'CVL', 100, 1000000 ],
        [ 24, '長門',         'BB',    1,       0 ]
    ];

    this.expectations = {
        Levels      : [ 1, 149 ],
        Experiences : [ 0, 4359999 ]
    };

    return;
};
kclv.Test.Relation.Ships.prototype =
    Object.create(kclv.Test.Relation.Base.prototype);
kclv.Test.Relation.Ships.prototype.constructor =
    kclv.Test.Relation.Base;

test('kclv.Relation.Ships', function() {
    var test = new kclv.Test.Relation.Ships(),
        relation = new kclv.Relation.Ships().insert(test.array);

    test.test(relation);

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Factory
// ----------------------------------------------------------------

/*
test('kclv.RelationFactory', function() {
    // TODO: Even more tests.
});
*/


// ================================================================
module('Tables');
// ================================================================

// ----------------------------------------------------------------
// Interface
// ----------------------------------------------------------------

/*
test('kclv.TableLike', function() {
    // TODO: Even more tests.
});
*/

// ----------------------------------------------------------------
// Base
// ----------------------------------------------------------------

kclv.Test.Table = {};

kclv.Test.Table.Base = function() {
    return;
};

kclv.Test.Table.Base.prototype.testThreshold = function(table) {
    return this.relation.testThreshold(table, this.relation.expectations);
};

kclv.Test.Table.Base.prototype.test = function(
    table, kind, option, title, columns, rows
) {
    deepEqual(
        table.kind,
        kind,
        'Can visualize ' + kind + '.'
    );

    deepEqual(
        table.option,
        option,
        'Can visualize ' + option + ' something.'
    );

    deepEqual(
        table.title,
        title,
        'Builds the title of ' + kind + '.'
    );

    deepEqual(
        table.columns,
        columns,
        'Builds columns.'
    );

    deepEqual(
        table.rows,
        rows,
        'Builds rows of ' + option + ' of ' + kind + '.'
    );

    deepEqual(
        table.count(),
        rows.length,
        'Counts the rows of ' + option + ' of ' + kind + '.'
    );

    return;
};

// ----------------------------------------------------------------
// Materials
// ----------------------------------------------------------------

kclv.Test.Table.Materials = {};

kclv.Test.Table.Materials.Base = function() {
    this.relation = new kclv.Test.Relation.Materials();

    this.configuration = {
        chart : { Consumables : {}, Resources : {} },
        locale : 'xx',
        legend : { xx : {
            dateTime : 'd',
            Resources   : {
                title : 'R',
                Fuel : 'f', Ammunition : 'a', Steel : 's', Bauxite : 'b'
            },
            Consumables : {
                title : 'C',
                Repair : 'r', Construction : 'c', Development : 'd'
            }
        } }
    };

    return;
};
kclv.Test.Table.Materials.Base.prototype =
    Object.create(kclv.Test.Table.Base.prototype);
kclv.Test.Table.Materials.Base.prototype.constructor =
    kclv.Test.Table.Base;

// ----------------------------------------------------------------
// Materials: Candlestick
// ----------------------------------------------------------------

kclv.Test.Table.Materials.Candlestick = function() {
    kclv.Test.Table.Materials.Base.call(this);

    return;
};
kclv.Test.Table.Materials.Candlestick.prototype =
    Object.create(kclv.Test.Table.Materials.Base.prototype);
kclv.Test.Table.Materials.Candlestick.prototype.constructor =
    kclv.Test.Table.Materials.Base;

test('kclv.Table.Materials.Candlestick', function() {
    var test = new kclv.Test.Table.Materials.Candlestick(),
        configuration = test.configuration,
        relation = new kclv.Relation.Materials().insert(test.relation.array),
        periods = ['Yearly', 'Monthly', 'Weekly', 'Daily'],
        table = null;

    kclv.Configuration.load(configuration);

    // Threshold

    table = new kclv.Table.Materials.Candlestick(relation, ['Fuel', 'Daily']);
    test.testThreshold(table);

    // Resources, such as Fuel

    periods.forEach( function(period, index, periods) {
        table =
            new kclv.Table.Materials.Candlestick(relation, ['Fuel', period]);
        var expectedRows = {
            Yearly : [
                [ '2013', 11, 11, 51, 51 ]
            ],
            Monthly : [
                [ '2013/04', 11, 11, 11, 11 ],
                [ '2013/07', 21, 21, 51, 51 ]
            ],
            Weekly : [
                [ '2013-W17', 11, 11, 11, 11 ],
                [ '2013-W28', 21, 21, 41, 41 ],
                [ '2013-W29', 51, 51, 51, 51 ]
            ],
            Daily : [
                [ '2013/04/23', 11, 11, 11, 11 ],
                [ '2013/07/10', 21, 21, 31, 31 ],
                [ '2013/07/11', 41, 41, 41, 41 ],
                [ '2013/07/17', 51, 51, 51, 51 ]
            ]
        };

        test.test(
            table,
            'Fuel',
            period,
            'R (f)',
            undefined,
            expectedRows[period]
        );
    } );

    // Consumables, such as Repair

    periods.forEach( function(period, index, periods) {
        table =
            new kclv.Table.Materials.Candlestick(relation, ['Repair', period]);
        var expectedRows = {
            Yearly : [
                [ '2013', 15, 15, 55, 55 ]
            ],
            Monthly : [
                [ '2013/04', 15, 15, 15, 15 ],
                [ '2013/07', 25, 25, 55, 55 ]
            ],
            Weekly : [
                [ '2013-W17', 15, 15, 15, 15 ],
                [ '2013-W28', 25, 25, 45, 45 ],
                [ '2013-W29', 55, 55, 55, 55 ]
            ],
            Daily : [
                [ '2013/04/23', 15, 15, 15, 15 ],
                [ '2013/07/10', 25, 25, 35, 35 ],
                [ '2013/07/11', 45, 45, 45, 45 ],
                [ '2013/07/17', 55, 55, 55, 55 ]
            ]
        };

        test.test(
            table,
            'Repair',
            period,
            'C (r)',
            undefined,
            expectedRows[period]
        );
    } );

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Materials: Line
// ----------------------------------------------------------------

kclv.Test.Table.Materials.Line = function() {
    kclv.Test.Table.Materials.Base.call(this);

    return;
};
kclv.Test.Table.Materials.Line.prototype =
    Object.create(kclv.Test.Table.Materials.Base.prototype);
kclv.Test.Table.Materials.Line.prototype.constructor =
    kclv.Test.Table.Materials.Base;

kclv.Test.Table.Materials.Line.prototype.test = function(
    table, kind, opposite, option, title, columns, rows
) {
    kclv.Test.Table.Materials.Base.prototype.test.call(
        this, table, kind, option, title, columns, rows
    );

    deepEqual(
        table.opposite,
        opposite,
        opposite ?
            'Has an opposite (' + opposite + ').' :
            'Does not have an opposite.'
    );

    return;
};

test('kclv.Table.Materials.Line', function() {
    var test = new kclv.Test.Table.Materials.Line(),
        configuration = test.configuration,
        relation = new kclv.Relation.Materials().insert(test.relation.array),
        table = null;

    kclv.Configuration.load(configuration);

    throws(
        function() { new kclv.Table.Materials.Line(relation, 'Fuel'); },
        kclv.Exception.InvalidMaterial,
        'Could not visualize Fuels.'
    );

    // Threshold

    table = new kclv.Table.Materials.Line(relation, 'Resources');
    test.testThreshold(table);

    // Resources

    test.test(
        table,
        'Resources',
        null,
        null,
        'R',
        ['"d"', '"f"', '"a"', '"s"', '"b"'],
        [
            [ '"' + new Date('2013/04/23').toLocaleString() + '"',
                11, 12, 13, 14 ],
            [ '"' + new Date('2013/07/10').toLocaleString() + '"',
                21, 22, 23, 24 ],
            [ '"' + new Date('2013/07/10').toLocaleString() + '"',
                31, 32, 33, 34 ],
            [ '"' + new Date('2013/07/11').toLocaleString() + '"',
                41, 42, 43, 44 ],
            [ '"' + new Date('2013/07/17').toLocaleString() + '"',
                51, 52, 53, 54 ]
        ]
    );
    deepEqual(
        table.opposite,
        null,
        'Does not have an opposite (Consumables)'
    );

    // Resources + Repair

    configuration.chart.Resources.withRepair = true;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Materials.Line(relation, 'Resources');
    test.test(
        table,
        'Resources',
        'Consumables',
        null,
        'R',
        ['"d"', '"f"', '"a"', '"s"', '"b"', '"r"'],
        [
            [ '"' + new Date('2013/04/23').toLocaleString() + '"',
                11, 12, 13, 14, 15 ],
            [ '"' + new Date('2013/07/10').toLocaleString() + '"',
                21, 22, 23, 24, 25 ],
            [ '"' + new Date('2013/07/10').toLocaleString() + '"',
                31, 32, 33, 34, 35 ],
            [ '"' + new Date('2013/07/11').toLocaleString() + '"',
                41, 42, 43, 44, 45 ],
            [ '"' + new Date('2013/07/17').toLocaleString() + '"',
                51, 52, 53, 54, 55 ]
        ]
    );

    throws(
        function() { new kclv.Table.Materials.Line(relation, 'Repair'); },
        kclv.Exception.InvalidMaterial,
        'Could not visualize Instant Repairs.'
    );

    table = new kclv.Table.Materials.Line(relation, 'Consumables');
    test.test(
        table,
        'Consumables',
        null,
        null,
        'C',
        ['"d"', '"r"', '"c"', '"d"'],
        [
            [ '"' + new Date('2013/04/23').toLocaleString() + '"',
                15, 16, 17 ],
            [ '"' + new Date('2013/07/10').toLocaleString() + '"',
                25, 26, 27 ],
            [ '"' + new Date('2013/07/10').toLocaleString() + '"',
                35, 36, 37 ],
            [ '"' + new Date('2013/07/11').toLocaleString() + '"',
                45, 46, 47 ],
            [ '"' + new Date('2013/07/17').toLocaleString() + '"',
                55, 56, 57 ]
        ]
    );
});

/*
test('kclv.Table.Ships.Base', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Table.Ships.Histogram', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Table.Ships.Scatter', function() {
    // TODO: Even more tests.
});
*/


// ================================================================
module('Charts');
// ================================================================

/*
test('kclv.ChartLike', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.Base', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.Annotation', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.Bar', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.Bubble', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.CandleStick', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.Calendar', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.Column', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.Diff', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.Histogram', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.Interval', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.Line', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.Pie', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.Sankey', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.Scatter', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.SteppedArea', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.Timeline', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.TreeMap', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Chart.Trendline', function() {
    // TODO: Even more tests.
});
*/


// ================================================================
module('Template');
// ================================================================

/*
test('kclv.Template', function() {
    // TODO: Even more tests.
});
*/


// ================================================================
module('Visualizer');
// ================================================================

/*
test('kclv.Visualizer', function() {
    // TODO: Even more tests.
});
*/

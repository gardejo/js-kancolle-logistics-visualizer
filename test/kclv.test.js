/**
 * @fileOverview Test Library on QUnit for KanColle Logistics Visualizer.
 *     Caveat: This file is encoded as UTF-8N (with BOM).
 * @version 0.0.0
 * @author kclv@ermitejo.com (MORIYA Masaki, alias "Gardejo")
 * @license The MIT license (See LICENSE.txt)
 * @see ../lib/kclv.js
 */

// Note: IE8 sucks, because it converts an exception into a raw object.

var expectation = {};


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
    kclv.Foo = function() {}; // Object
    kclv.Bar = {}; // Namespace
    kclv.Bar.Baz = function(qux) { this.qux_ = qux; }; // Object

    var foo = new kclv.Foo(),
        baz = new kclv.Bar.Baz();
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
        function() { kclv.Array.values([1,2,3,4], [1,3,42]) },
        RangeError,
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

    kclv.I58 =
        function() { this.dive = function() { return 'Orel cruising dechi!' } };
    kclv.Nagato =
        function() { this.fire = function() { return 'Puka puka...' } };
    kclv.Ju87CKai =
        function() { this.dive = 'Stuka!' }; // Not a method but a property.

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
        function() { submarineLike.ensure(nagato) },
        TypeError,
        'Throws TypeError if an object does not have some methods: ' +
            'BB Nagato is not like a submarine, but like a battleship.'
    );

    ok(
        ! submarineLike.implemented(nagato),
        'Cheks whether an object implements some methods: BB Nagato canot dive.'
    );

    throws(
        function() { submarineLike.ensure(ju87cKai) },
        TypeError,
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

    kclv.Configuration.clear();
    throws(
        function() { kclv.Configuration.get() },
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

expectation.dates = [
    new Date('2013/04/23 00:00:00'),
    new Date('2013/07/10 00:00:00'),
    new Date('2013/07/17 00:00:00')
];
expectation.Relation = {};
expectation.Relation.Materials = {
    High : [
        [expectation.dates[0],116,126,136,146,156,166,176],
        [expectation.dates[1],216,226,236,246,256,266,276],
        [expectation.dates[2],316,326,336,346,356,366,376]
    ],
    Average : [
        [expectation.dates[0],114,124,134,144,154,164,174],
        [expectation.dates[1],214,224,234,244,254,264,274],
        [expectation.dates[2],314,324,334,344,354,364,374]
    ],
    Low : [
        [expectation.dates[0],111,121,131,141,151,161,171],
        [expectation.dates[1],211,221,231,241,251,261,271],
        [expectation.dates[2],311,321,331,341,351,361,371]
    ]
};

test('kclv.Agent.KCRDB : Materials', function() {
    var agent = new kclv.Agent.KCRDB,
        configuration = { agent: { KCRDB: { path: {
            Materials : './KCRDB.Materials.log'
        } } } };

    configuration.relation = {
        values: 'High', duration: null, inception: null, expiration: null
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(
            expectation.Relation.Materials.High
        ),
        'Builds a relation: high values in whole period.'
    );

    configuration.relation = {
        values: 'Average', duration: null, inception: null, expiration: null
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(
            expectation.Relation.Materials.Average
        ),
        'Builds a relation: average values in whole period.'
    );

    configuration.relation = {
        values: 'Low', duration: null, inception: null, expiration: null
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(
            expectation.Relation.Materials.Low
        ),
        'Builds a relation: low values in whole period.'
    );

    configuration.relation = {
        values: null, duration: null, inception: null, expiration: null
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(
            expectation.Relation.Materials.Low
        ),
        'Builds a relation: default (low) values in whole period.'
    );

    configuration.relation = {
        values: null, duration: 0, inception: null, expiration: null
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert([]),
        'Builds a relation: default (low) values in an empty period.'
    );

    configuration.relation = {
        values: null, duration: null,
        inception: '2013/07/10 00:00:00', expiration: '2013/07/17 00:00:00'
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(
            expectation.Relation.Materials.Low.slice(1,3)
        ),
        'Builds a relation: default (low) values ' +
            'from Kure & Sasebo till Maiduru.'
    );

    // TODO: Even more tests.
});

test('kclv.Agent.Logbook : Materials', function() {
    var agent = new kclv.Agent.Logbook,
        configuration = { agent: { Logbook: { path: {
            Materials : './Logbook.Materials.log'
        } } } };

    configuration.relation = {
        duration: null, inception: null, expiration: null
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(
            expectation.Relation.Materials.Low
        ),
        'Builds a relation: as is values in whole period.'
    );

    configuration.relation = {
        duration: 0, inception: null, expiration: null
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert([]),
        'Builds a relation: as is values in an empty period.'
    );

    configuration.relation = {
        duration: null,
        inception: '2013/07/10 00:00:00', expiration: '2013/07/17 00:00:00'
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(
            expectation.Relation.Materials.Low.slice(1,3)
        ),
        'Builds a relation: as is values ' +
            'from Kure & Sasebo till Maiduru.'
    );

    // TODO: Even more tests.
});

expectation.Relation.Ships = [
    [ 1, '電改',       'DD',   99, 1000000 ],
    [ 2, '千歳航改二', 'CVL', 150, 4360000 ],
    [ 3, '長門',       'BB',    1,       0 ]
];

test('kclv.Agent.KCRDB : Ships', function() {
    var agent = new kclv.Agent.KCRDB,
        configuration = { agent: { KCRDB: { path: {
            Ships : './KCRDB.Ships.csv'
        } } } };

    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Ships'),
        new kclv.Relation.Ships().insert(
            expectation.Relation.Ships
        ),
        'Builds a relation.'
    );

    // TODO: Even more tests.
});

test('kclv.Agent.Logbook : Ships', function() {
    var agent = new kclv.Agent.Logbook,
        configuration = { agent: { Logbook: { path: {
            Ships : './Logbook.Ships.csv'
        } } } };

    kclv.Configuration.load(configuration);
    deepEqual(
        agent.buildRelation('Ships'),
        new kclv.Relation.Ships().insert(
            expectation.Relation.Ships
        ),
        'Builds a relation.'
    );

    // TODO: Even more tests.
});


// ================================================================
module('Tokenizers');
// ================================================================

test('kclv.Tokenizer.Base', function() {
    var string =
            '"SSV","I-58",2,3\n' + // Orel cruising dechi!
            '"CV","Akagi",5,4\n' + // Tokyo Exp. to drum up results!
            '"BB","Yamato",5,5\n', // We're sorry but "Re" class is NG.
        oneDimensionalArray = [
            '"SSV","I-58",2,3',
            '"CV","Akagi",5,4',
            '"BB","Yamato",5,5'
        ],
        twoDimensionalArray = [
            ['"SSV"', '"I-58"',   '2', '3'],
            ['"CV"',  '"Akagi"',  '5', '4'],
            ['"BB"',  '"Yamato"', '5', '5']
        ],
        tokenizer = new kclv.Tokenizer.Base();

    deepEqual(
        tokenizer.toRows(string),
        oneDimensionalArray,
        'Converts a string into an one-dimensional array.'
    );

    deepEqual(
        oneDimensionalArray.map(tokenizer.toColumns, tokenizer),
        twoDimensionalArray,
        'Converts an one-dimensional array into a two-dimensional array.'
    );

    deepEqual(
        tokenizer.toRelationalArray(string),
        twoDimensionalArray,
        'Converts a string into a two-dimensional array.'
    );

    // TODO: Even more tests.
});

test('kclv.Tokenizer.KCRDB.Materials', function() {
    var string =
            '#2013/04/23 01:23:45#,1,2,3,4,5,6,7,8,9,10,11,12,13,14\n' +
            '#2013/07/10 12:34:56#,2,3,4,5,6,7,8,9,10,11,12,13,14,15\n',
        oneDimensionalArray = [
            '#2013/04/23 01:23:45#,1,2,3,4,5,6,7,8,9,10,11,12,13,14',
            '#2013/07/10 12:34:56#,2,3,4,5,6,7,8,9,10,11,12,13,14,15'
        ],
        twoDimensionalArray = [
            [
                new Date('2013/04/23 01:23:45'),    // Date
                1,2,3,4,5,6,7,8,9,10,11,12,13,14    // Integers
            ],
            [
                new Date('2013/07/10 12:34:56'),
                2,3,4,5,6,7,8,9,10,11,12,13,14,15
            ]
        ],
        tokenizer = new kclv.Tokenizer.KCRDB.Materials();

    deepEqual(
        tokenizer.toRows(string),
        oneDimensionalArray,
        'Converts a string into an one-dimensional array.'
    );

    deepEqual(
        oneDimensionalArray.map(tokenizer.toColumns, tokenizer),
        twoDimensionalArray,
        'Converts an one-dimensional array into a two-dimensional array ' +
            'and normalize some columns.'
    );

    deepEqual(
        tokenizer.toRelationalArray(string),
        twoDimensionalArray,
        'Converts a string into a two-dimensional array.'
    );

    // TODO: Even more tests.
});


// ================================================================
module('Selectors');
// ================================================================

test('kclv.SelectorLike', function() {
    kclv.Selector.Foo = function() { this.select = function() {} };
    kclv.Selector.Bar = function() {};

    var interface = new kclv.SelectorLike(),
        foo = new kclv.Selector.Foo(),
        bar = new kclv.Selector.Bar();

    interface.ensure(foo);
    ok(
        true,
        'SelectorLike interface ensures foo object has #select method.'
    );

    throws(
        function() { interface.ensure(bar) },
        'SelectorLike interface does not ensure bar object has #select method.'
    );

    // TODO: Even more tests.
});

test('kclv.Selector.Retrospection', function() {
    var now = new Date(),
        relation = [],
        selector;

    for ( var daysBefore = 0; daysBefore <= 2; daysBefore++ ) {
        var someday = new Date();
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
    kclv.Projector.Foo = function() { this.project = function() {} };
    kclv.Projector.Bar = function() {};

    var interface = new kclv.ProjectorLike(),
        foo = new kclv.Projector.Foo(),
        bar = new kclv.Projector.Bar();

    interface.ensure(foo);
    ok(
        true,
        'ProjectorLike interface ensures ' +
            'that foo object has #project method.'
    );

    throws(
        function() { interface.ensure(bar) },
        'ProjectorLike interface does not ensure ' +
            'that bar object has #project method.'
    );

    // TODO: Even more tests.
});

test('kclv.Projector.Materials.High', function() {
    var relation = [
            ['Foo', 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76]
        ],
        projector = new kclv.Projector.Materials.High();

    deepEqual(
        relation.map( projector.project ),
        [['Foo', 16, 26, 36, 46, 56, 66, 76]],
        'Projects as high.'
    );

    // TODO: Even more tests.
});

test('kclv.Projector.Materials.Average', function() {
    var relation = [
            ['Foo', 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76]
        ],
        projector = new kclv.Projector.Materials.Average();

    deepEqual(
        relation.map( projector.project ),
        [['Foo', 14, 24, 34, 44, 54, 64, 74]],
        'Projects as average.'
    );

    // TODO: Even more tests.
});

test('kclv.Projector.Materials.Low', function() {
    var relation = [
            ['Foo', 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76]
        ],
        projector = new kclv.Projector.Materials.Low();

    deepEqual(
        relation.map( projector.project ),
        [['Foo', 11, 21, 31, 41, 51, 61, 71]],
        'Projects as low.'
    );

    // TODO: Even more tests.
});


// ================================================================
module('Relations');
// ================================================================

/*
test('kclv.Relation.Base', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.RelationFactory', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Relation.Materials', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Relation.Ships', function() {
    // TODO: Even more tests.
});
*/


// ================================================================
module('Tables');
// ================================================================

/*
test('kclv.TableLike', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Table.Base', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Table.Materials.Base', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Table.Materials.Candlestick', function() {
    // TODO: Even more tests.
});
*/

/*
test('kclv.Table.Materials.Line', function() {
    // TODO: Even more tests.
});
*/

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

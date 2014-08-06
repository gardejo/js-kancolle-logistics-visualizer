/**
 * @fileOverview Test Library on QUnit for KanColle Logistics Visualizer.
 *     Caveat: This file is encoded as UTF-8N (with BOM).
 *     Note: IE8 converts an exception into a raw object.
 * @version 0.1.2
 * @author kclv@ermitejo.com (MORIYA Masaki, alias "Gardejo")
 * @license The MIT license (See LICENSE.txt)
 * @see ../lib/kclv.js
 */


// ================================================================
// Script mode syntax (Whole-library)
// ================================================================

'use strict'; // Yup yup. I know that: Use the function form of "use strict".


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
        '0.1.2',
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

    throws(
        function() { kclv.Factory.getInstance(kclv, 'Qux'); },
        navigator.userAgent.indexOf('MSIE') >= 0 ? Error : TypeError,
        'Cannot create an object which was not registered.'
    );

    throws(
        function() { kclv.Factory.getInstance(kclv); },
        navigator.userAgent.indexOf('MSIE') >= 0 ? Error : TypeError,
        'Cannot create an object: It is a namespace.'
    );

    // TODO: Even more tests.
});


// ================================================================
module('Formatter');
// ================================================================

test('kclv.Formatter', function() {
    var formatter = new kclv.Formatter(),
        indices = [0, 2],
        prefix = 'Something wrong. Object notation is:\n\n';

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
        formatter.quote(['foo', 'bar', 'baz', 'qux'], indices),
        ['"foo"', 'bar', '"baz"', 'qux'],
        'Quotes a string of specified elements of an array.'
    );

    deepEqual(
        indices,
        [0, 2],
        'No side effects on the specified indices.'
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
        formatter.unquote(['"foo"', '"bar"', '"baz"', '"qux"'], indices),
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
        formatter.parenthesize(['foo', 'bar', 'baz', 'qux'], indices),
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
        formatter.integerize(['168', '58', '19', '8', '401'], indices),
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
        formatter.commify([4000, 2000, 5000, 5200, 20], indices),
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
        prefix + '{\n    "foo": "bar"\n}',
        'Converts an object into a human-readable string.'
    );

    kclv.Test.Void = function() { return; };
    kclv.Test.Void.prototype.toJSON = function() { return; };
    deepEqual(
        formatter.dialogue(new kclv.Test.Void()),
        prefix + 'undefined',
        'Converts an object into a human-readable string (which is undefined).'
    );

    kclv.Test.LongestStringEver = function() { return; };
    kclv.Test.LongestStringEver.prototype.toJSON = function() {
        // Have the city of Llanfairpwllgwyngyll in your empire!
        return new Array(2411).join('x');
    };
    deepEqual(
        formatter.dialogue(new kclv.Test.LongestStringEver()),
        prefix + '"' + new Array(1000).join('x') + // 1000
            ' ...\n\n(Snipped 1412 characters.)', // 2411 - 1000 - 1 (quote)
        'Converts an object into a human-readable string (which is snipped).'
    );

    // TODO: Even more tests.
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
        kclv.Array.maximum([ [168], [58], [19], [8], [401] ], [0]),
        401,
        'Gets the maximum value of the spceficied two-dimensional array.'
    );

    deepEqual(
        kclv.Array.maximum([ [168], [58], [null], [19], [8], [401] ], [0]),
        401,
        'Gets the maximum value of the spceficied two-dimensional array ' +
            'which may include null.'
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
        kclv.Array.minimum([ [168], [58], [null], [19], [8], [401] ], [0]),
        8,
        'Gets the minimum value of the spceficied two-dimensional array ' +
            'which may include null.'
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
    var path = './sample.json',
        configuration = { 'foo' : 58, 'bar' : { 'baz' : 168 } };

    kclv.Configuration.load(path);
    ok(
        true,
        'Stores an object by a path argument.'
    );

    deepEqual(
        kclv.Configuration.get(),
        configuration,
        'Returns whole object tree.'
    );

    kclv.Configuration.load(configuration);
    ok(
        true,
        'Stores an object by an object argument.'
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


// ================================================================
module('I/O Stream');
// ================================================================

test('kclv.Stream', function() {
    var stream = new kclv.Stream();

    throws(
        function() { stream.readFile('./_'); },
        Error, // TODO: We were cursed with abnormal Error object.
        'Cannot read an absent file.'
    );

    stream.writeFile('./_', 'This is a sample content.');
    ok(
        true,
        'Can write some content (dummy).'
    );

    throws(
        function() { stream.writeFile('./_', null); },
        Error, // TODO: We were cursed with abnormal Error object.
        'Cannot write a file with no content.'
    );

    // TODO: Even more tests.
});


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
        'Considers 2012/12/31 as 1st week of year 2013.'
    );

    deepEqual(
        new kclv.Date('2020/12/31').toWeek(),
        [2020, 53],
        'Considers 2020/12/31 as last (53rd) week of year 2020.'
    );

    ok(
        new kclv.Date('2000/01/01').isLeapYear_(), // An edge case in our codes.
        'Year 2000 is a leap year.'
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

    throws(
        function() {
            new kclv.Date('2010/01/04 12:34:56').toPeriod('Bimonthly');
        },
        Error, // TODO: We were cursed with abnormal Error object.
        'Cannot convert Date into a bimonthly period.'
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

kclv.Test.Agent.KCRDB = function() {
    this.path = {
        Materials : './KCRDB.Materials.log',
        Ships     : './KCRDB.Ships.csv'
    };

    return;
};

kclv.Test.Agent.Logbook = function() {
    this.path = {
        Materials : './Logbook.Materials.log',
        Ships     : './Logbook.Ships.csv'
    };

    return;
};

kclv.Test.Agent.SandanshikiKanpan = function() {
    this.path = {
        // Note: An our test stub regards '%LocalAppData%' as './'.
        Fuel          : '%LocalAppData%/SandanshikiKanpan.fuel.dat',
        Ammunition    : '%LocalAppData%/SandanshikiKanpan.bullet.dat',
        Steel         : '%LocalAppData%/SandanshikiKanpan.steel.dat',
        Bauxite       : '%LocalAppData%/SandanshikiKanpan.bauxite.dat',
        Repair        : '%LocalAppData%/SandanshikiKanpan.bucket.dat',
        Construction  : '%LocalAppData%/SandanshikiKanpan.burner.dat',
        Development   : '%LocalAppData%/SandanshikiKanpan.devMaterial.dat'
    };

    return;
};

test('kclv.Agent.Base', function() {
    kclv.Agent.Foo = function() {
        kclv.Agent.Base.call(this);

        return;
    };
    kclv.Agent.Foo.prototype = Object.create(kclv.Agent.Base.prototype);
    kclv.Agent.Foo.prototype.constructor = kclv.Agent.Base;

    throws(
        function() { new kclv.Agent.Foo().getProjector(); },
        Error, // TODO: We were cursed with abnormal Error object.
        'Does not override abstract method #getProjector().'
    );
});

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

kclv.Test.Agent.Materials.prototype.test = function(testee) {
    testee.configuration.relation = {};
    kclv.Configuration.load(testee.configuration);
    deepEqual(
        testee.agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(this.materials.low),
        'Builds a relation (undefined): default (low) values in whole period.'
    );

    testee.configuration.relation = { values : null };
    kclv.Configuration.load(testee.configuration);
    deepEqual(
        testee.agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(this.materials.low),
        'Builds a relation (null): default (low) values in whole period.'
    );

    testee.configuration.relation = { duration : 0 };
    kclv.Configuration.load(testee.configuration);
    deepEqual(
        testee.agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert([]),
        'Builds a relation: default (low) values in an empty period.'
    );

    // TODO: { duration : 1 }
    // It needs a stub for Date or to build Date dynamically.
    // See tests for Selectors.

    testee.configuration.relation = {
        inception : '2013/07/10 00:00:00', expiration : '2013/07/17 00:00:00'
    };
    kclv.Configuration.load(testee.configuration);
    deepEqual(
        testee.agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert(this.materials.low.slice(1,3)),
        'Builds a relation: default (low) values ' +
            'from Kure & Sasebo till Maiduru.'
    );

    testee.configuration.relation = {
        inception : '2013/07/10 00:00:00', expiration : null
    };
    kclv.Configuration.load(testee.configuration);
    deepEqual(
        testee.agent.buildRelation('Materials'),
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
        configuration = { agent: { KCRDB: {
            path: new kclv.Test.Agent.KCRDB().path
        } } };

    test.test({
        agent         : agent,
        configuration : configuration
    });

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
        configuration = { agent: { Logbook: {
            path: new kclv.Test.Agent.Logbook().path
        } } };

    test.test({
        agent         : agent,
        configuration : configuration
    });

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Materials: Sandanshiki Kanpan (Three Flight Decks)
// ----------------------------------------------------------------

test('kclv.Agent.SandanshikiKanpan : Materials', function() {
    if (navigator.userAgent.indexOf('MSIE') >= 0) {
        ok(true, 'TODO: MSIE cannot the tests.');
        return;
    }

    var test = new kclv.Test.Agent.Materials(),
        agent = new kclv.Agent.SandanshikiKanpan(),
        configuration = { agent: { SandanshikiKanpan: {
            path: new kclv.Test.Agent.SandanshikiKanpan().path
        } } };

    test.test({
        agent         : agent,
        configuration : configuration
    });

    // Issue #10

    configuration.agent.SandanshikiKanpan.path.Bauxite =
        '%LocalAppData%/SandanshikiKanpan.bauxite.delayed.dat';
    configuration.relation = {};
    kclv.Configuration.load(configuration);

    deepEqual(
        agent.buildRelation('Materials'),
        new kclv.Relation.Materials().insert([
            [new Date('2013/04/23 00:00:00'),
                111, 121, 131, null, 151, 161, 171],
            [new Date('2013/04/23 00:00:01'),
                null, null, null, 141, null, null, null],
            [new Date('2013/07/10 00:00:00'),
                211, 221, 231, null, 251, 261, 271],
            [new Date('2013/07/10 00:00:01'),
                null, null, null, 241, null, null, null],
            [new Date('2013/07/17 00:00:00'),
                311, 321, 331, null, 351, 361, 371],
            [new Date('2013/07/17 00:00:01'),
                null, null, null, 341, null, null, null]
        ]),
        'Builds a relation: With delayed material(s).'
    );

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

kclv.Test.Agent.Ships.prototype.test = function(testee) {
    kclv.Configuration.load(testee.configuration);
    deepEqual(
        testee.agent.buildRelation('Ships'),
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
        configuration = { agent: { KCRDB: {
            path: new kclv.Test.Agent.KCRDB().path
        } } };

    test.test({
        agent         : agent,
        configuration : configuration
    });

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
        configuration = { agent : { Logbook : {
            path: new kclv.Test.Agent.Logbook().path
        } } };

    test.test({
        agent         : agent,
        configuration : configuration
    });

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Ships: Sandanshiki Kanpan (Three Flight Decks)
// ----------------------------------------------------------------

test('kclv.Agent.SandanshikiKanpan : Ships', function() {
    var agent = new kclv.Agent.SandanshikiKanpan();

    throws(
        function() { agent.buildRelation('Ships'); }, 
        Error, // TODO: We were cursed with abnormal Error object.
        'Cannot build a relation of ships.'
    );
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

kclv.Test.Tokenizer.prototype.test = function(testee) {
    deepEqual(
        testee.tokenizer.toRows(testee.string),
        testee.rows,
        'Converts a string into rows (an one-dimensional array).'
    );

    deepEqual(
        testee.rows.map(testee.tokenizer.toColumns, testee.tokenizer),
        testee.table,
        'Converts rows (an one-dimensional array) into ' +
            'a table (a two-dimensional array) ' +
            'and normalize some columns.'
    );

    deepEqual(
        testee.tokenizer.toRelationalArray(testee.string),
        testee.table,
        'Converts a string into a table (a two-dimensional array).'
    );

    return;
};

test('kclv.Tokenizer.Base', function() {
    kclv.Tokenizer.Foo = function(kind) {
        kclv.Tokenizer.Base.call(this, kind);

        return;
    };
    kclv.Tokenizer.Foo.prototype = Object.create(kclv.Tokenizer.Base.prototype);
    kclv.Tokenizer.Foo.prototype.constructor = kclv.Tokenizer.Base;

    throws(
        function() { new kclv.Tokenizer.Foo(); },
        Error, // TODO: We were cursed with abnormal Error object.
        'Has "undefined" which is a invalid kind.'
    );

    throws(
        function() {
            var tokenizer = new kclv.Tokenizer.Foo('Ships');
            tokenizer.kind_ = 'Brides';
            tokenizer.toColumns();
        },
        Error, // TODO: We were cursed with abnormal Error object.
        'Has "Brides" which is a invalid kind.'
    );

    throws(
        function() { new kclv.Tokenizer.Foo('Ships').canonizeTimeStamp(); },
        Error, // TODO: We were cursed with abnormal Error object.
        'Does not override abstract method #canonizeTimeStamp().'
    );
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

    test.test({
        tokenizer : tokenizer,
        string    : string,
        rows      : rows,
        table     : table
    });

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

    test.test({
        tokenizer : tokenizer,
        string    : string,
        rows      : rows,
        table     : table
    });

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

    test.test({
        tokenizer : tokenizer,
        string    : string,
        rows      : rows,
        table     : table
    });

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

    test.test({
        tokenizer : tokenizer,
        string    : string,
        rows      : rows,
        table     : table
    });

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Sandanshiki Kanpan (Three Flight Decks): Materials
// ----------------------------------------------------------------

test('kclv.Tokenizer.SandanshikiKanpan.Materials', function() {
    var test = new kclv.Test.Tokenizer(),
        tokenizer = new kclv.Tokenizer.SandanshikiKanpan.Materials(),
        string =
            '2013-04-23-01-23-45-1234\t1\n' +
            '2013-07-10-12-34-56-5678\t2\n',
        rows = [
            '2013-04-23-01-23-45-1234\t1',
            '2013-07-10-12-34-56-5678\t2'
        ],
        table = [
            [
                new Date('2013/04/23 01:23:45'),    // Date
                1                                   // Integer
            ],
            [
                new Date('2013/07/10 12:34:56'),
                2
            ]
        ];

    test.test({
        tokenizer : tokenizer,
        string    : string,
        rows      : rows,
        table     : table
    });

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
        test.relation.map( projector.project, projector ),
        [['Foo', 16, 26, 36, 46, 56, 66, 76]],
        'Projects as high.'
    );

    // TODO: Even more tests.
});

test('kclv.Projector.Materials.Average', function() {
    var test = new kclv.Test.Projector(),
        projector = new kclv.Projector.Materials.Average();

    deepEqual(
        test.relation.map( projector.project, projector ),
        [['Foo', 14, 24, 34, 44, 54, 64, 74]],
        'Projects as average.'
    );

    // TODO: Even more tests.
});

test('kclv.Projector.Materials.Low', function() {
    var test = new kclv.Test.Projector(),
        projector = new kclv.Projector.Materials.Low();

    deepEqual(
        test.relation.map( projector.project, projector ),
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
    Object.keys(this.expectations).forEach( function(key) {
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

kclv.Test.Relation.Base.prototype.test = function(testee) {
    deepEqual(
        testee.relation.count(),
        this.array.length,
        'Has ' + this.array.length + 'tuples.'
    );

    this.testThreshold(testee.relation, this.expectations);

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
            map( function(element) {
                return element * 2;
            } ),
        [ 2, 4, 6 ],
        'Creates a new relation with the results of doubled numbers.'
    );

    deepEqual(
        new kclv.Relation.Base().insert([ [1], [2], [3] ]).
            reduce( function(previous, current) {
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

    deepEqual(
        new kclv.Relation.Base().insert([ [1], [2], [3] ]).select(),
        new kclv.Relation.Base().insert([ [1], [2], [3] ]),
        'Selects the whole tuple.'
    );

    deepEqual(
        new kclv.Relation.Base().insert([ [1], [2], [3] ]).project(),
        new kclv.Relation.Base().insert([ [1], [2], [3] ]),
        'Projects the whole attribute.'
    );

    kclv.Relation.Foo = function() {
        kclv.Relation.Base.call(this);

        return;
    };
    kclv.Relation.Foo.prototype = Object.create(kclv.Relation.Base.prototype);
    kclv.Relation.Foo.prototype.constructor = kclv.Relation.Base;

    throws(
        function() { new kclv.Relation.Foo().getAttributes(); },
        Error, // TODO: We were cursed with abnormal Error object.
        'Does not override abstract method #getAttributes().'
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

    test.test({
        relation : relation
    });

    throws(
        function() { relation.getIndicesOf('Rubber'); },
        Error, // TODO: We were cursed with abnormal Error object.
        'Has no index for a quantitiy of rubber.'
    );

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

    test.test({
        relation : relation
    });

    throws(
        function() { relation.getIndicesOf('isLocked'); },
        Error, // TODO: We were cursed with abnormal Error object.
        'Has no index for lock status.'
    );

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Factory
// ----------------------------------------------------------------

test('kclv.RelationFactory', function() {
    var logbook = new kclv.Agent.Logbook(),
        sandanshikiKanpan = new kclv.Agent.SandanshikiKanpan(),
        configuration = {
            relation : {},
            agent: {
                Logbook : {
                    path : new kclv.Test.Agent.Logbook().path
                },
                SandanshikiKanpan: {
                    path : new kclv.Test.Agent.SandanshikiKanpan().path
                }
            }
        },
        relation = {};

    configuration.agent.SandanshikiKanpan.path.Bauxite =
        '%LocalAppData%/SandanshikiKanpan.bauxite.delayed.dat';
    kclv.Configuration.load(configuration);
    relation.Materials = new kclv.Agent.Logbook().buildRelation('Materials');
    relation.Ships = new kclv.Agent.Logbook().buildRelation('Ships');

    deepEqual(
        kclv.RelationFactory.getInstance(
            'Ships', new kclv.Agent.Logbook()
        ),
        relation.Ships,
        'Creates a ships relation.'
    );

    deepEqual(
        kclv.RelationFactory.getInstance(
            'Materials', new kclv.Agent.Logbook()
        ),
        relation.Materials,
        'Creates a materials relation.'
    );

    deepEqual(
        kclv.RelationFactory.getInstance(
            'Materials', new kclv.Agent.SandanshikiKanpan()
        ),
        relation.Materials, // From cache. Delayed bauxite log is ignored!
        'Does not Create a materials relation because it was alread created.'
    );

    // TODO: Even more tests.
});


// ================================================================
module('Tables');
// ================================================================

// ----------------------------------------------------------------
// Interface
// ----------------------------------------------------------------

test('kclv.TableLike', function() {
    ok(
        new kclv.TableLike(),
        'Is a placeholder.'
    );

    // TODO: Even more tests.
});

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

kclv.Test.Table.Base.prototype.test = function(testee) {
    deepEqual(
        testee.table.kind,
        testee.kind,
        'Can visualize ' + testee.kind + '.'
    );

    deepEqual(
        testee.table.option,
        testee.option,
        'Can visualize ' + testee.option + ' something.'
    );

    deepEqual(
        testee.table.title,
        testee.title,
        'Builds the title of ' + testee.kind + '.'
    );

    deepEqual(
        testee.table.columns,
        testee.columns,
        'Builds columns.'
    );

    deepEqual(
        testee.table.rows,
        testee.rows,
        'Builds rows of ' + testee.option + ' of ' + testee.kind + '.'
    );

    deepEqual(
        testee.table.count(),
        testee.rows.length,
        'Counts the rows of ' + testee.option + ' of ' + testee.kind + '.'
    );

    return;
};

test('kclv.Table.Base', function() {
    var configuration = { locale : 'xx' };
    kclv.Configuration.load(configuration);

    kclv.Table.Foo = function(relation, option) {
        kclv.Table.Base.call(this, relation, option);

        return;
    };
    kclv.Table.Foo.prototype = Object.create(kclv.Table.Base.prototype);
    kclv.Table.Foo.prototype.constructor = kclv.Table.Base;
    kclv.Table.Foo.prototype.buildRows = function() { return; };

    throws(
        function() { new kclv.Table.Foo(); },
        Error, // TODO: We were cursed with abnormal Error object.
        'Does not override abstract method #buildColumns().'
    );

    kclv.Table.Bar = function(relation, option) {
        kclv.Table.Base.call(this, relation, option);

        return;
    };
    kclv.Table.Bar.prototype = Object.create(kclv.Table.Base.prototype);
    kclv.Table.Bar.prototype.constructor = kclv.Table.Base;
    kclv.Table.Bar.prototype.buildColumns = function() { return; };

    throws(
        function() { new kclv.Table.Bar(); },
        Error, // TODO: We were cursed with abnormal Error object.
        'Does not override abstract method #buildRows().'
    );

});

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

    periods.forEach( function(period) {
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

        test.test({
            table   : table,
            kind    : 'Fuel',
            option  : period,
            title   : 'R (f)',
            columns : undefined,
            rows    : expectedRows[period]
        });
    } );

    // Consumables, such as Repair

    periods.forEach( function(period) {
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

        test.test({
            table   : table,
            kind    : 'Repair',
            option  : period,
            title   : 'C (r)',
            columns : undefined,
            rows    : expectedRows[period]
        });
    } );

    // Issue #10

    table = new kclv.Table.Materials.Candlestick(
        new kclv.Relation.Materials().insert([
            [ new Date('2013/04/23 00:00:00'), 11, 12, 13, 14, 15, 16, 17 ],
            [ new Date('2013/07/10 00:00:00'), 21, 22, 23, 24, 25, 26, 27 ],
            [ new Date('2013/07/10 00:00:00'),
                null, null, null, null, 35, 36, 37 ],
            [ new Date('2013/07/10 00:00:01'),
                31, 32, 33, 34, null, null, null ],
            [ new Date('2013/07/11 00:00:00'), 41, 42, 43, 44, 45, 46, 47 ],
            [ new Date('2013/07/17 00:00:00'), 51, 52, 53, 54, 55, 56, 57 ]
        ]),
        ['Repair', 'Daily']
    );
    deepEqual(
        table.rows,
        [
            [ '2013/04/23', 15, 15, 15, 15 ],
            [ '2013/07/10', 25, 25, 35, 35 ],
            [ '2013/07/11', 45, 45, 45, 45 ],
            [ '2013/07/17', 55, 55, 55, 55 ]
        ]
    );

    // Improve branch coverage: not only a bull but also a bear

    table = new kclv.Table.Materials.Candlestick(
        new kclv.Relation.Materials().insert([
            [ new Date('2013/07/10 00:00:00'), 31, 32, 33, 34, 35, 36, 37 ],
            [ new Date('2013/07/10 12:00:00'), 21, 22, 23, 24, 25, 26, 27 ]
        ]),
        ['Repair', 'Daily']
    );
    deepEqual(
        table.rows,
        [
            [ '2013/07/10', 25, 35, 25, 35 ]
        ]
    );

    // Improve branch coverage: out of scale

    throws(
        function() {
            new kclv.Table.Materials.Candlestick(
                new kclv.Relation.Materials().insert([]), // no tuple.
                ['Fuel', 'Daily']
            );
        },
        RangeError,
        'Cannot build rows from an empty relation.'
    );

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

kclv.Test.Table.Materials.Line.prototype.test = function(testee) {
    kclv.Test.Table.Materials.Base.prototype.test.call(this, testee);

    deepEqual(
        testee.table.opposite,
        testee.opposite,
        testee.opposite ?
            'Has an opposite (' + testee.opposite + ').' :
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

    // Invalid material (Ok, let's play HoI!)

    throws(
        function() { new kclv.Table.Materials.Line(relation, 'Rubber'); },
        Error, // TODO: We were cursed with abnormal Error object.
        'Could not visualize Fuels.'
    );

    // Threshold

    table = new kclv.Table.Materials.Line(relation, 'Resources');
    test.testThreshold(table);

    // Resources

    test.test({
        table    : table,
        kind     : 'Resources',
        opposite : null,
        option   : null,
        title    : 'R',
        columns  : ['d', 'f', 'a', 's', 'b'],
        rows     : [
            [ new Date('2013/04/23').toLocaleString(),
                11, 12, 13, 14 ],
            [ new Date('2013/07/10').toLocaleString(),
                21, 22, 23, 24 ],
            [ new Date('2013/07/10').toLocaleString(),
                31, 32, 33, 34 ],
            [ new Date('2013/07/11').toLocaleString(),
                41, 42, 43, 44 ],
            [ new Date('2013/07/17').toLocaleString(),
                51, 52, 53, 54 ]
        ]
    });
    deepEqual(
        table.opposite,
        null,
        'Does not have an opposite (Consumables)'
    );

    // Resources + Repair

    configuration.chart.Resources.withRepair = true;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Materials.Line(relation, 'Resources');
    test.test({
        table    : table,
        kind     : 'Resources',
        opposite : 'Consumables',
        option   : null,
        title    : 'R',
        columns  : ['d', 'f', 'a', 's', 'b', 'r'],
        rows     : [
            [ new Date('2013/04/23').toLocaleString(),
                11, 12, 13, 14, 15 ],
            [ new Date('2013/07/10').toLocaleString(),
                21, 22, 23, 24, 25 ],
            [ new Date('2013/07/10').toLocaleString(),
                31, 32, 33, 34, 35 ],
            [ new Date('2013/07/11').toLocaleString(),
                41, 42, 43, 44, 45 ],
            [ new Date('2013/07/17').toLocaleString(),
                51, 52, 53, 54, 55 ]
        ]
    });

    // Individual material: Bauxite only (Feeding service for Akagi)

    table = new kclv.Table.Materials.Line(relation, 'Bauxite');
    test.test({
        table    : table,
        kind     : 'Bauxite',
        opposite : null,
        option   : null,
        title    : 'R',
        columns  : ['d', 'b'],
        rows     : [
            [ new Date('2013/04/23').toLocaleString(), 14 ],
            [ new Date('2013/07/10').toLocaleString(), 24 ],
            [ new Date('2013/07/10').toLocaleString(), 34 ],
            [ new Date('2013/07/11').toLocaleString(), 44 ],
            [ new Date('2013/07/17').toLocaleString(), 54 ]
        ]
    });
    deepEqual(
        table.opposite,
        null,
        'Does not have an opposite (Consumables), regardless of "withRepair"'
    );

    table = new kclv.Table.Materials.Line(relation, 'Consumables');
    test.test({
        table    : table,
        kind     : 'Consumables',
        opposite : null,
        option   : null,
        title    : 'C',
        columns  : ['d', 'r', 'c', 'd'],
        rows     : [
            [ new Date('2013/04/23').toLocaleString(),
                15, 16, 17 ],
            [ new Date('2013/07/10').toLocaleString(),
                25, 26, 27 ],
            [ new Date('2013/07/10').toLocaleString(),
                35, 36, 37 ],
            [ new Date('2013/07/11').toLocaleString(),
                45, 46, 47 ],
            [ new Date('2013/07/17').toLocaleString(),
                55, 56, 57 ]
        ]
    });

    // Improve branch coverage: out of scale

    throws(
        function() {
            new kclv.Table.Materials.Line(
                new kclv.Relation.Materials().insert([]), // no tuple.
                'Fuel'
            );
        },
        RangeError,
        'Cannot build rows from an empty relation.'
    );
});

// ----------------------------------------------------------------
// Ships
// ----------------------------------------------------------------

kclv.Test.Table.Ships = {};

kclv.Test.Table.Ships.Base = function() {
    this.relation = new kclv.Test.Relation.Ships();

    this.configuration = {
        locale : 'xx',
        chart : { Ships : {} },
        legend : { xx : {
            Ships : {
                title : 'S', Levels : 'lv', Experiences : 'xp',
                classification : {
                    AS:'AS',AR:'AR',CVB:'CVB',LHA:'LHA',AV:'AV',SSV:'SSV',
                    SS:'SS',CV:'CV',BBV:'BBV',BB:'BB',BC:'BC',CVL:'CVL',
                    CAV:'CAV',CA:'CA',CLT:'CLT',CL:'CL',DD:'DD'
                },
                abbreviation : {
                    AS:'as',AR:'ar',CVB:'cvb',LHA:'lha',AV:'av',SSV:'ssv',
                    SS:'ss',CV:'cv',BBV:'bbv',BB:'bb',BC:'bc',CVL:'cvl',
                    CAV:'cav',CA:'ca',CLT:'clt',CL:'cl',DD:'dd'
                },
                Bubble : {
                    title          : 'bench strength',
                    classification : 'classification',
                    total          : 'total',
                    average        : 'average',
                    rate           : 'rate',
                    practical      : 'practical'
                }
            }
        } }
    };

    this.columns = {
        bubble : [
            'classification', 'total', 'average', 'rate', 'practical'
        ],
        classification : [
            { id : 'AS',  label : 'AS',  type : 'number' }, //  0
            { id : 'AR',  label : 'AR',  type : 'number' }, //  1
            { id : 'CVB', label : 'CVB', type : 'number' }, //  2
            { id : 'LHA', label : 'LHA', type : 'number' }, //  3
            { id : 'AV',  label : 'AV',  type : 'number' }, //  4
            { id : 'SSV', label : 'SSV', type : 'number' }, //  5
            { id : 'SS',  label : 'SS',  type : 'number' }, //  6
            { id : 'CV',  label : 'CV',  type : 'number' }, //  7
            { id : 'BBV', label : 'BBV', type : 'number' }, //  8
            { id : 'BB',  label : 'BB',  type : 'number' }, //  9
            { id : 'CVL', label : 'CVL', type : 'number' }, // 10
            { id : 'CAV', label : 'CAV', type : 'number' }, // 11
            { id : 'CA',  label : 'CA',  type : 'number' }, // 12
            { id : 'CLT', label : 'CLT', type : 'number' }, // 13
            { id : 'CL',  label : 'CL',  type : 'number' }, // 14
            { id : 'DD',  label : 'DD',  type : 'number' }  // 15
        ],
        abbreviation : [
            { id : 'AS',  label : 'as',  type : 'number' }, //  0
            { id : 'AR',  label : 'ar',  type : 'number' }, //  1
            { id : 'CVB', label : 'cvb', type : 'number' }, //  2
            { id : 'LHA', label : 'lha', type : 'number' }, //  3
            { id : 'AV',  label : 'av',  type : 'number' }, //  4
            { id : 'SSV', label : 'ssv', type : 'number' }, //  5
            { id : 'SS',  label : 'ss',  type : 'number' }, //  6
            { id : 'CV',  label : 'cv',  type : 'number' }, //  7
            { id : 'BBV', label : 'bbv', type : 'number' }, //  8
            { id : 'BB',  label : 'bb',  type : 'number' }, //  9
            { id : 'CVL', label : 'cvl', type : 'number' }, // 10
            { id : 'CAV', label : 'cav', type : 'number' }, // 11
            { id : 'CA',  label : 'ca',  type : 'number' }, // 12
            { id : 'CLT', label : 'clt', type : 'number' }, // 13
            { id : 'CL',  label : 'cl',  type : 'number' }, // 14
            { id : 'DD',  label : 'dd',  type : 'number' }  // 15
        ]
    };

    return;
};
kclv.Test.Table.Ships.Base.prototype =
    Object.create(kclv.Test.Table.Base.prototype);
kclv.Test.Table.Ships.Base.prototype.constructor =
    kclv.Test.Table.Base;

kclv.Test.Table.Ships.Base.prototype.testThreshold = function(table) {
    return this.relation.testThreshold(table, {
        Levels      : [ 1, 150 ], // It is not 149! (rounded up)
        Experiences : [ 0, 4359999 ]
    });
};

// ----------------------------------------------------------------
// Ships: Bubble
// ----------------------------------------------------------------

kclv.Test.Table.Ships.Bubble = function() {
    kclv.Test.Table.Ships.Base.call(this);

    return;
};
kclv.Test.Table.Ships.Bubble.prototype =
    Object.create(kclv.Test.Table.Ships.Base.prototype);
kclv.Test.Table.Ships.Bubble.prototype.constructor =
    kclv.Test.Table.Ships.Base;

kclv.Test.Table.Ships.Bubble.prototype.testThreshold = function(table) {

    // vertical

    deepEqual(
        table.maximum('AverageLevel'),
        125,
        'Calculates maximum average level.'
    );

    deepEqual(
        table.minimum('AverageLevel'),
        1,
        'Calculates minimum average level.'
    );

    // horizontal

    deepEqual(
        table.maximum('TotalShipNumber'),
        2,
        'Calculates maximum ship number.'
    );

    deepEqual(
        table.minimum('TotalShipNumber'),
        1,
        'Calculates minimum ship number.'
    );

    return;
};

test('kclv.Table.Ships.Bubble', function() {
    var test = new kclv.Test.Table.Ships.Bubble(),
        configuration = test.configuration,
        relation = new kclv.Relation.Ships().insert(test.relation.array),
        table = null,
        columns = test.columns;

    kclv.Configuration.load(configuration);

    // Threshold

    table = new kclv.Table.Ships.Bubble(relation);
    test.testThreshold(table);

    test.test({
        table   : table,
        kind    : null,
        option  : null,
        title   : 'bench strength',
        columns : columns.bubble,
        rows    : [
            [ 'DD',    1,  99, { v : 1,   f : '100%' },    1 ],
            [ 'CVL',   2, 125, { v : 1,   f : '100%' },    2 ],
            [ 'BB',    1,   1, { v : 1,   f : '100%' },    1 ]
        ]
    });

    // invalid attribute (column)

    throws(
        function() { table.getIndicesOf('BelovedNumber'); },
        Error,
        'Has no index for a number of beloved ships.'
    );

    // practical level

    configuration.chart.Ships.vertical = {};

    configuration.chart.Ships.vertical.level = 70;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Bubble(relation);
    test.test({
        table   : table,
        kind    : null,
        option  : null,
        title   : 'bench strength',
        columns : columns.bubble,
        rows    : [
            [ 'DD',    1,  99, { v : 1,   f : '100%' },    1 ],
            [ 'CVL',   2, 125, { v : 1,   f : '100%' },    2 ],
            [ 'BB',    1,   1, { v : 0,   f :   '0%' },    0 ]
        ]
    });

    configuration.chart.Ships.vertical.level = 149;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Bubble(relation);
    test.test({
        table   : table,
        kind    : null,
        option  : null,
        title   : 'bench strength',
        columns : columns.bubble,
        rows    : [
            [ 'DD',    1,  99, { v : 0,   f :   '0%' },   0 ],
            [ 'CVL',   2, 125, { v : 0.5, f :  '50%' },   1 ],
            [ 'BB',    1,   1, { v : 0,   f :   '0%' },   0 ]
        ]
    });

    configuration.chart.Ships.vertical.level = null;

    // mothbalLevel

    configuration.chart.Ships.mothballLevel = 1;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Bubble(relation);
    test.test({
        table   : table,
        kind    : null,
        option  : null,
        title   : 'bench strength',
        columns : columns.bubble,
        rows    : [
            [ 'DD',    1,  99, { v : 1,   f : '100%' },    1 ],
            [ 'CVL',   2, 125, { v : 1,   f : '100%' },    2 ]
        ]
    });

    configuration.chart.Ships.mothballLevel = 148;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Bubble(relation);
    test.test({
        table   : table,
        kind    : null,
        option  : null,
        title   : 'bench strength',
        columns : columns.bubble,
        rows    : [
            [ 'CVL',   1, 149, { v : 1,   f : '100%' },   1 ]
        ]
    });

    configuration.chart.Ships.mothballLevel = null;

    // backups

    configuration.chart.Ships.backups = [12, 24, 2411];
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Bubble(relation);
    test.test({
        table   : table,
        kind    : null,
        option  : null,
        title   : 'bench strength',
        columns : columns.bubble,
        rows    : [
            [ 'DD',    1,  99, { v : 1,   f : '100%' },    1 ],
            [ 'CVL',   1, 100, { v : 1,   f : '100%' },    1 ]
        ]
    });

    configuration.chart.Ships.backups = null;

    // mothbalLevel + backups

    configuration.chart.Ships.mothballLevel = 1;
    configuration.chart.Ships.backups = [13];
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Bubble(relation);
    test.test({
        table   : table,
        kind    : null,
        option  : null,
        title   : 'bench strength',
        columns : columns.bubble,
        rows    : [
            [ 'DD',    1,  99, { v : 1,   f : '100%' },    1 ],
            [ 'CVL',   1, 149, { v : 1,   f : '100%' },    1 ]
        ]
    });

    configuration.chart.Ships.mothballLevel = null;
    configuration.chart.Ships.backups = null;

    // abbreviate

    configuration.chart.Ships.abbreviate = true;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Bubble(relation);
    deepEqual(
        table.rows,
        [
            [ 'dd',    1,  99, { v : 1,   f : '100%' },   1 ],
            [ 'cvl',   2, 125, { v : 1,   f : '100%' },   2 ],
            [ 'bb',    1,   1, { v : 1,   f : '100%' },   1 ]
        ],
        'Has headings of rows as abbreviation. ' +
            '(when the abbreviate configuration is true).'
    );

    configuration.chart.Ships.abbreviate = false;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Bubble(relation);
    deepEqual(
        table.rows,
        [
            [ 'DD',    1,  99, { v : 1,   f : '100%' },   1 ],
            [ 'CVL',   2, 125, { v : 1,   f : '100%' },   2 ],
            [ 'BB',    1,   1, { v : 1,   f : '100%' },   1 ]
        ],
        'Has headings of rows as classification. ' +
            '(when the abbreviate configuration is false).'
    );

    configuration.chart.Ships.abbreviate = null;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Bubble(relation);
    deepEqual(
        table.rows,
        [
            [ 'DD',    1,  99, { v : 1,   f : '100%' },   1 ],
            [ 'CVL',   2, 125, { v : 1,   f : '100%' },   2 ],
            [ 'BB',    1,   1, { v : 1,   f : '100%' },   1 ]
        ],
        'Has headings of rows as abbreviation. ' +
            '(when the abbreviate configuration is null).'
    );

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Ships: Histogram
// ----------------------------------------------------------------

kclv.Test.Table.Ships.Histogram = function() {
    kclv.Test.Table.Ships.Base.call(this);

    return;
};
kclv.Test.Table.Ships.Histogram.prototype =
    Object.create(kclv.Test.Table.Ships.Base.prototype);
kclv.Test.Table.Ships.Histogram.prototype.constructor =
    kclv.Test.Table.Ships.Base;

test('kclv.Table.Ships.Histogram', function() {
    var test = new kclv.Test.Table.Ships.Histogram(),
        configuration = test.configuration,
        relation = new kclv.Relation.Ships().insert(test.relation.array),
        table = null,
        columns = test.columns;

    kclv.Configuration.load(configuration);

    // Threshold

    table = new kclv.Table.Ships.Histogram(relation, 'Levels');
    test.testThreshold(table);

    // Levels

    test.test({
        table   : table,
        kind    : 'Levels',
        option  : null,
        title   : 'S (lv)',
        columns : columns.classification,
        rows    : [
            { c : [
                null, null, null, null, null, null, null, null, null, null,
                null, null, null, null, null,
                { v : 99, f : '電改 Lv.99' } // Col. 15
            ] },
            { c : [
                null, null, null, null, null, null, null, null, null, null,
                { v : 149, f : '千歳航改二 Lv.149' }, // Col. 10
                null, null, null, null, null
            ] },
            { c : [
                null, null, null, null, null, null, null, null, null, null,
                { v : 100, f : '千代田航改二 Lv.100' }, // Col. 10
                null, null, null, null, null
            ] },
            { c : [
                null, null, null, null, null, null, null, null, null,
                { v : 1, f : '長門 Lv.1' }, // Col. 9
                null, null, null, null, null, null
            ] }
        ]
    });

    // mothballLevel (backups doesn't work)

    configuration.chart.Ships.mothballLevel = 1;
    configuration.chart.Ships.backups = [1, 12, 13, 24]; // OK. Doesn't work.
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Histogram(relation, 'Levels');
    test.test({
        table   : table,
        kind    : 'Levels',
        option  : null,
        title   : 'S (lv)',
        columns : columns.classification,
        rows    : [
            { c : [
                null, null, null, null, null, null, null, null, null, null,
                null, null, null, null, null,
                { v : 99, f : '電改 Lv.99' } // Col. 15
            ] },
            { c : [
                null, null, null, null, null, null, null, null, null, null,
                { v : 149, f : '千歳航改二 Lv.149' }, // Col. 10
                null, null, null, null, null
            ] },
            { c : [
                null, null, null, null, null, null, null, null, null, null,
                { v : 100, f : '千代田航改二 Lv.100' }, // Col. 10
                null, null, null, null, null
            ] },
            { c : [] }
        ]
    });

    configuration.chart.Ships.mothballLevel = 99;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Histogram(relation, 'Levels');
    test.test({
        table   : table,
        kind    : 'Levels',
        option  : null,
        title   : 'S (lv)',
        columns : columns.classification,
        rows    : [
            { c : [] },
            { c : [
                null, null, null, null, null, null, null, null, null, null,
                { v : 149, f : '千歳航改二 Lv.149' }, // Col. 10
                null, null, null, null, null
            ] },
            { c : [
                null, null, null, null, null, null, null, null, null, null,
                { v : 100, f : '千代田航改二 Lv.100' }, // Col. 10
                null, null, null, null, null
            ] },
            { c : [] }
        ]
    });

    configuration.chart.Ships.mothballLevel = null;
    configuration.chart.Ships.backups = null;

    // abbreviate

    configuration.chart.Ships.abbreviate = true;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Histogram(relation, 'Levels');
    deepEqual(
        table.columns,
        columns.abbreviation,
        'Has columns of abbreviations, ' + 
            'which includes the first column for the order of arrival ' +
            '(when the abbreviate configuration is true).'
    );

    configuration.chart.Ships.abbreviate = false;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Histogram(relation, 'Levels');
    deepEqual(
        table.columns,
        columns.classification,
        'Has columns of classifications, ' + 
            'which includes the first column for the order of arrival ' +
            '(when the abbreviate configuration is false).'
    );

    configuration.chart.Ships.abbreviate = null;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Histogram(relation, 'Levels');
    deepEqual(
        table.columns,
        columns.classification,
        'Has columns of classifications, ' + 
            'which includes the first column for the order of arrival ' +
            '(when the abbreviate configuration is null).'
    );

    // Experiences

    table = new kclv.Table.Ships.Histogram(relation, 'Experiences');
    test.test({
        table   : table,
        kind    : 'Experiences',
        option  : null,
        title   : 'S (xp)',
        columns : columns.classification,
        rows    : [
            { c : [
                null, null, null, null, null, null, null, null, null, null,
                null, null, null, null, null,
                { v : 1000000, f : '電改 Lv.99 (1,000,000)' } // Col. 15
            ] },
            { c : [
                null, null, null, null, null, null, null, null, null, null,
                { v : 4359999, f : '千歳航改二 Lv.149 (4,359,999)' },
                    // Col. 10
                null, null, null, null, null
            ] },
            { c : [
                null, null, null, null, null, null, null, null, null, null,
                { v : 1000000, f : '千代田航改二 Lv.100 (1,000,000)' },
                    // Col. 10
                null, null, null, null, null
            ] },
            { c : [
                null, null, null, null, null, null, null, null, null,
                { v : 0, f : '長門 Lv.1 (0)' }, // Col. 9
                null, null, null, null, null, null
            ] }
        ]
    });

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Ships: Scatter
// ----------------------------------------------------------------

kclv.Test.Table.Ships.Scatter = function() {
    kclv.Test.Table.Ships.Base.call(this);

    this.columns = {
        classification : this.columns.classification.slice(), // Cloned
        abbreviation   : this.columns.abbreviation.slice()    // Cloned
    };
    this.columns.classification.unshift({});
    this.columns.abbreviation.unshift({});

    return;
};
kclv.Test.Table.Ships.Scatter.prototype =
    Object.create(kclv.Test.Table.Ships.Base.prototype);
kclv.Test.Table.Ships.Scatter.prototype.constructor =
    kclv.Test.Table.Ships.Base;

kclv.Test.Table.Ships.Scatter.prototype.test = function(testee) {
    kclv.Test.Table.Ships.Base.prototype.test.call(this, testee);

    deepEqual(
        testee.table.relation.relation,
        this.relation.array,
        'Sorting has no side effects for relations.'
    );

    return;
};

test('kclv.Table.Ships.Scatter', function() {
    var test = new kclv.Test.Table.Ships.Scatter(),
        configuration = test.configuration,
        relation = new kclv.Relation.Ships().insert(test.relation.array),
        table = null,
        columns = test.columns;

    kclv.Configuration.load(configuration);

    throws(
        function() { new kclv.Table.Ships.Scatter(relation); },
        Error,
        'Could not visualize undefined skill.'
    );

    // Threshold

    table = new kclv.Table.Ships.Scatter(relation, ['Levels', 'Arrival']);
    test.testThreshold(table);

    // Levels, Arrival

    columns.classification[0] =
        { id : 'Order', label : 'Order of arrival', type : 'number' };
    test.test({
        table   : table,
        kind    : 'Levels',
        option  : 'Arrival',
        title   : 'S (lv)',
        columns : columns.classification,
        rows    : [
            { c : [
                { v : 1, f : '#1:1' }, // Col. 0
                null, null, null, null, null, null, null, null, null, null,
                null, null, null, null, null,
                { v : 99, f : '電改 Lv.99' } // Col. 16
            ] },
            { c : [
                { v : 2, f : '#2:12' }, // Col. 0
                null, null, null, null, null, null, null, null, null, null,
                { v : 149, f : '千歳航改二 Lv.149' }, // Col. 11
                null, null, null, null, null
            ] },
            { c : [
                { v : 3, f : '#3:13' }, // Col. 0
                null, null, null, null, null, null, null, null, null, null,
                { v : 100, f : '千代田航改二 Lv.100' }, // Col. 11
                null, null, null, null, null
            ] },
            { c : [
                { v : 4, f : '#4:24' }, // Col. 0
                null, null, null, null, null, null, null, null, null,
                { v : 1, f : '長門 Lv.1' }, // Col. 10
                null, null, null, null, null, null
            ] }
        ]
    });

    // mothballLevel

    configuration.chart.Ships.mothballLevel = 1;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Scatter(relation, ['Levels', 'Arrival']);
    test.test({
        table   : table,
        kind    : 'Levels',
        option  : 'Arrival',
        title   : 'S (lv)',
        columns : columns.classification,
        rows    : [
            { c : [
                { v : 1, f : '#1:1' }, // Col. 0
                null, null, null, null, null, null, null, null, null, null,
                null, null, null, null, null,
                { v : 99, f : '電改 Lv.99' } // Col. 16
            ] },
            { c : [
                { v : 2, f : '#2:12' }, // Col. 0
                null, null, null, null, null, null, null, null, null, null,
                { v : 149, f : '千歳航改二 Lv.149' }, // Col. 11
                null, null, null, null, null
            ] },
            { c : [
                { v : 3, f : '#3:13' }, // Col. 0
                null, null, null, null, null, null, null, null, null, null,
                { v : 100, f : '千代田航改二 Lv.100' }, // Col. 11
                null, null, null, null, null
            ] },
            { c : [] }
        ]
    });

    configuration.chart.Ships.mothballLevel = 99;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Scatter(relation, ['Levels', 'Arrival']);
    test.test({
        table   : table,
        kind    : 'Levels',
        option  : 'Arrival',
        title   : 'S (lv)',
        columns : columns.classification,
        rows    : [
            { c : [] },
            { c : [
                { v : 2, f : '#2:12' }, // Col. 0
                null, null, null, null, null, null, null, null, null, null,
                { v : 149, f : '千歳航改二 Lv.149' }, // Col. 11
                null, null, null, null, null
            ] },
            { c : [
                { v : 3, f : '#3:13' }, // Col. 0
                null, null, null, null, null, null, null, null, null, null,
                { v : 100, f : '千代田航改二 Lv.100' }, // Col. 11
                null, null, null, null, null
            ] },
            { c : [] }
        ]
    });

    configuration.chart.Ships.mothballLevel = null;

    // abbreviate

    configuration.chart.Ships.abbreviate = true;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Scatter(relation, ['Levels', 'Arrival']);
    columns.abbreviation[0] =
        { id : 'Order', label : 'Order of arrival', type : 'number' };
    deepEqual(
        table.columns,
        columns.abbreviation,
        'Has columns of abbreviations, ' + 
            'which includes the first column for the order of arrival ' +
            '(when the abbreviate configuration is true).'
    );

    configuration.chart.Ships.abbreviate = false;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Scatter(relation, ['Levels', 'Arrival']);
    columns.classification[0] =
        { id : 'Order', label : 'Order of arrival', type : 'number' };
    deepEqual(
        table.columns,
        columns.classification,
        'Has columns of classifications, ' + 
            'which includes the first column for the order of arrival ' +
            '(when the abbreviate configuration is false).'
    );

    configuration.chart.Ships.abbreviate = null;
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Scatter(relation, ['Levels', 'Arrival']);
    columns.classification[0] =
        { id : 'Order', label : 'Order of arrival', type : 'number' };
    deepEqual(
        table.columns,
        columns.classification,
        'Has columns of classifications, ' + 
            'which includes the first column for the order of arrival ' +
            '(when the abbreviate configuration is null).'
    );

    // Levels, Experiences

    table = new kclv.Table.Ships.Scatter(relation, ['Levels', 'Experiences']);
    columns.classification[0] =
        { id : 'Order', label : 'Order of experiences', type : 'number' };
    test.test({
        table   : table,
        kind    : 'Levels',
        option  : 'Experiences',
        title   : 'S (lv)',
        columns : columns.classification,
        rows    : [
            { c : [
                { v : 1, f : '#1:12' }, // 0
                null, null, null, null, null, null, null, null, null, null,
                { v : 149, f : '千歳航改二 Lv.149' }, // 11
                null, null, null, null, null
            ] },
            { c : [
                { v : 2, f : '#2:13' }, // 0
                null, null, null, null, null, null, null, null, null, null,
                { v : 100, f : '千代田航改二 Lv.100' }, // 11
                null, null, null, null, null
            ] },
            { c : [
                { v : 3, f : '#3:1' }, // 0
                null, null, null, null, null, null, null, null, null, null,
                null, null, null, null, null,
                { v : 99, f : '電改 Lv.99' } // 16
            ] },
            { c : [
                { v : 4, f : '#4:24' }, // 0
                null, null, null, null, null, null, null, null, null,
                { v : 1, f : '長門 Lv.1' }, // 10
                null, null, null, null, null, null
            ] }
        ]
    });

    // Experiences, Arrival

    table = new kclv.Table.Ships.Scatter(relation, ['Experiences', 'Arrival']);
    columns.classification[0] =
        { id : 'Order', label : 'Order of arrival', type : 'number' };
    test.test({
        table   : table,
        kind    : 'Experiences',
        option  : 'Arrival',
        title   : 'S (xp)',
        columns : columns.classification,
        rows    : [
            { c : [
                { v : 1, f : '#1:1' }, // Col. 0
                null, null, null, null, null, null, null, null, null, null,
                null, null, null, null, null,
                { v : 1000000, f : '電改 Lv.99 (1,000,000)' } // Col. 16
            ] },
            { c : [
                { v : 2, f : '#2:12' }, // Col. 0
                null, null, null, null, null, null, null, null, null, null,
                { v : 4359999, f : '千歳航改二 Lv.149 (4,359,999)' },
                    // Col. 11
                null, null, null, null, null
            ] },
            { c : [
                { v : 3, f : '#3:13' }, // Col. 0
                null, null, null, null, null, null, null, null, null, null,
                { v : 1000000, f : '千代田航改二 Lv.100 (1,000,000)' },
                    // Col. 11
                null, null, null, null, null
            ] },
            { c : [
                { v : 4, f : '#4:24' }, // Col. 0
                null, null, null, null, null, null, null, null, null,
                { v : 0, f : '長門 Lv.1 (0)' }, // Col. 10
                null, null, null, null, null, null
            ] }
        ]
    });

    // Experiences, Experiences

    table = new kclv.Table.Ships.Scatter(
        relation, ['Experiences', 'Experiences']
    );
    columns.classification[0] =
        { id : 'Order', label : 'Order of experiences', type : 'number' };
    test.test({
        table   : table,
        kind    : 'Experiences',
        option  : 'Experiences',
        title   : 'S (xp)',
        columns : columns.classification,
        rows    : [
            { c : [
                { v : 1, f : '#1:12' }, // Col. 0
                null, null, null, null, null, null, null, null, null, null,
                { v : 4359999, f : '千歳航改二 Lv.149 (4,359,999)' },
                    // Col. 11
                null, null, null, null, null
            ] },
            { c : [
                { v : 2, f : '#2:13' }, // Col. 0
                null, null, null, null, null, null, null, null, null, null,
                { v : 1000000, f : '千代田航改二 Lv.100 (1,000,000)' },
                    // Col. 11
                null, null, null, null, null
            ] },
            { c : [
                { v : 3, f : '#3:1' }, // Col. 0
                null, null, null, null, null, null, null, null, null, null,
                null, null, null, null, null,
                { v : 1000000, f : '電改 Lv.99 (1,000,000)' } // Col. 16
            ] },
            { c : [
                { v : 4, f : '#4:24' }, // Col. 0
                null, null, null, null, null, null, null, null, null,
                { v : 0, f : '長門 Lv.1 (0)' }, // Col. 10
                null, null, null, null, null, null
            ] }
        ]
    });

    // TODO: Even more tests.
});


// ================================================================
module('Charts');
// ================================================================

kclv.Test.Chart = {};

// ----------------------------------------------------------------
// Interface
// ----------------------------------------------------------------

test('kclv.ChartLike', function() {
    ok(
        new kclv.ChartLike(),
        'Is a placeholder.'
    );

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Base
// ----------------------------------------------------------------

kclv.Test.Chart.Base = function() {
    return;
};

kclv.Test.Chart.Base.prototype.testRedraw = function(
    chart, table, configuration
) {
    [true, false, null].forEach( function(value) {
        configuration.chart.redraw = value;
        kclv.Configuration.load(configuration);
        deepEqual(
            kclv.Factory.getInstance(kclv.Chart, chart, [table]).option.redraw,
            value,
            'Has the configurated chart option of redraw ' +
                '(when redraw was specified: ' + value + ').'
        );
    } );

    return;
};

test('kclv.Chart.Base', function() {
    var configuration = { chart : null };

    kclv.Configuration.load(configuration);
    ok(
        new kclv.Chart.Base(),
        'Creates an object.'
    );

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Materials
// ----------------------------------------------------------------

kclv.Test.Chart.Materials = function() {
    kclv.Test.Chart.Base.call(this);

    this.configuration = new kclv.Test.Table.Materials.Base().configuration;

    this.relation = new kclv.Relation.Materials().insert(
        new kclv.Test.Relation.Materials().array
    );

    return;
};
kclv.Test.Chart.Materials.prototype =
    Object.create(kclv.Test.Chart.Base.prototype);
kclv.Test.Chart.Materials.prototype.constructor =
    kclv.Test.Chart.Base;

// ----------------------------------------------------------------
// Materials: Candlestick
// ----------------------------------------------------------------

test('kclv.Chart.CandleStick', function() {
    var test = new kclv.Test.Chart.Materials(),
        configuration = test.configuration,
        table = null;

    // Consumables

    kclv.Configuration.load(configuration);
    table = new kclv.Table.Materials.Candlestick(
        test.relation, ['Repair', 'Weekly']
    );
    deepEqual(
        new kclv.Chart.Candlestick(table).option,
        {
            horizontal : {},
            vertical : { maximum : 55, minimum : 15 }
        },
        'Has the default chart options.'
    );

    configuration.chart.Consumables.vertical = { maximum : 20, minimum : 10 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Candlestick(table).option.vertical,
        { maximum : 20, minimum : 10 },
        'Has the configurated chart options ' +
            '(when vertical maximum and vertical minimum were specified).'
    );

    configuration.chart.Consumables.vertical = {
        gridlines : 10
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Candlestick(table).option.vertical,
        { gridlines : 10, maximum : 55, minimum : 15 },
        'Has the configurated chart options ' +
            '(when vertical gridlines was specified).'
    );

    configuration.chart.Consumables.vertical = {
        minorGridlines : 4
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Candlestick(table).option.vertical,
        { minorGridlines : 4, maximum : 55, minimum : 15 },
        'Has the configurated chart options ' +
            '(when vertical minorGridlines was specified).'
    );

    configuration.chart.Consumables.vertical = {
        gridlines : 5, minorGridlines : 2
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Candlestick(table).option.vertical,
        { gridlines : 5, minorGridlines : 2, maximum : 55, minimum : 15 },
        'Has the configurated chart options ' +
            '(when vertical gridlines and vertical minorGridlines ' +
            'were specified).'
    );

    configuration.chart.Consumables.vertical = { step : 10 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Candlestick(table).option.vertical,
        { maximum : 60, minimum : 10, ticks : [ 10, 20, 30, 40, 50, 60 ] },
        'Has the configurated chart options ' +
            '(when vertical step was specified).' +
            'Note: ticks, maximum and minimum were justified.'
    );

    configuration.chart.Consumables.vertical = { step : 10, minimum : 0 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Candlestick(table).option.vertical,
        { maximum : 60, minimum : 0, ticks : [ 0, 10, 20, 30, 40, 50, 60 ] },
        'Has the configurated chart options ' +
            '(when vertical step was specified).' +
            'Note: ticks, maximum and minimum were justified. ' +
            'Note: Minimum threshold is rounded down.'
    );

    configuration.chart.Consumables.vertical = { step : 100 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Candlestick(table).option.vertical,
        { maximum : 100, minimum : 0, ticks : [ 0, 100 ] },
        'Has the configurated chart options ' +
            '(when vertical step was specified). ' +
            'Note: ticks, maximum and minimum were boldly justified.'
    );

    configuration.chart.Consumables.vertical = { level : 120 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Candlestick(table).option.vertical,
        { maximum : 55, minimum : 15, baseline : 0 },
        'Has the configurated chart options ' +
            '(when vertical level was ignored).'
    );

    // Resources

    table = new kclv.Table.Materials.Candlestick(
        test.relation, ['Fuel', 'Weekly']
    );
    configuration.chart.Resources.vertical = { level : 120 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Candlestick(table).option.vertical,
        { maximum : 51, minimum : 11, baseline : 30750 },
        'Has the configurated chart options ' +
            '(when vertical level was specified for baseline).'
    );

    // etc.

    test.testRedraw('Candlestick', table, configuration);

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Materials: Line
// ----------------------------------------------------------------

test('kclv.Chart.Line', function() {
    var test = new kclv.Test.Chart.Materials(),
        configuration = test.configuration,
        table = null;

    // Resouces

    kclv.Configuration.load(configuration);
    table = new kclv.Table.Materials.Line(test.relation, 'Resources');
    deepEqual(
        new kclv.Chart.Line(table).option,
        {
            horizontal : { },
            vertical : { maximum : 54, minimum : 11 }
        },
        'Has the default chart options.'
    );

    configuration.chart.Resources.vertical = { maximum : 20, minimum : 10 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Line(table).option.vertical,
        { maximum : 20, minimum : 10 },
        'Has the configurated chart options ' +
            '(when vertical maximum and vertical minimum were specified).'
    );

    configuration.chart.Resources.vertical = { gridlines : 10 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Line(table).option.vertical,
        { gridlines : 10, maximum : 54, minimum : 11 },
        'Has the configurated chart options ' +
            '(when vertical gridlines was specified).'
    );

    configuration.chart.Resources.vertical = { minorGridlines : 4 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Line(table).option.vertical,
        { minorGridlines : 4, maximum : 54, minimum : 11 },
        'Has the configurated chart options ' +
            '(when vertical minorGridlines was specified).'
    );

    configuration.chart.Resources.vertical = {
        gridlines : 5, minorGridlines : 2
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Line(table).option.vertical,
        { gridlines : 5, minorGridlines : 2, maximum : 54, minimum : 11 },
        'Has the configurated chart options ' +
            '(when vertical gridlines and vertical minorGridlines were ' +
            'specified).'
    );

    configuration.chart.Resources.vertical = { step : 10 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Line(table).option.vertical,
        { maximum : 60, minimum : 10, ticks : [ 10, 20, 30, 40, 50, 60 ] },
        'Has the configurated chart options ' +
            '(when vertical step was specified).' +
            'Note: ticks, maximum and minimum were justified.'
    );

    configuration.chart.Resources.vertical = { step : 10, minimum : 0 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Line(table).option.vertical,
        { maximum : 60, minimum : 0, ticks : [ 0, 10, 20, 30, 40, 50, 60 ] },
        'Has the configurated chart options ' +
            '(when vertical step was specified).' +
            'Note: ticks, maximum and minimum were justified. ' +
            'Note: Minimum threshold is rounded down.'
    );

    configuration.chart.Resources.vertical = { step : 100 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Line(table).option.vertical,
        { maximum : 100, minimum : 0, ticks : [ 0, 100 ] },
        'Has the configurated chart options ' +
            '(when vertical step was specified).' +
            'Note: ticks, maximum and minimum were boldly justified.'
    );

    configuration.chart.Resources.vertical = { level : 120 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Line(table).option.vertical,
        { maximum : 54, minimum : 11, baseline : 30750 },
        'Has the configurated combined chart options ' +
            '(when vertical level was specified for baseline).'
    );

    // Individual material: Bauxite only (Feeding service for Akagi)

    configuration.chart.Resources.vertical = { level : 120 };
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Materials.Line(test.relation, 'Bauxite');
    deepEqual(
        new kclv.Chart.Line(table).option.vertical,
        { maximum : 54, minimum : 14, baseline : 30750 },
        'Has the configurated individual chart options ' +
            '(when vertical level was specified for baseline).'
    );

    // Resources + Repair

    configuration.chart.Resources = { withRepair : true };
    configuration.chart.Consumables.vertical = { minimum : 168 };
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Materials.Line(test.relation, 'Resources');
    deepEqual(
        new kclv.Chart.Line(table).option.vertical,
        { maximum : 54, minimum : 11, opposingBaseline : 168 },
        'Has the configurated chart options ' +
            '(when opposing vertical minimum was specified for ' +
            'opposing baseline).'
    );

    // etc.

    test.testRedraw('Line', table, configuration);

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Ships
// ----------------------------------------------------------------

kclv.Test.Chart.Ships = function() {
    kclv.Test.Chart.Base.call(this);

    this.configuration = new kclv.Test.Table.Ships.Base().configuration;

    this.relation = new kclv.Relation.Ships().insert(
        new kclv.Test.Relation.Ships().array
    );

    return;
};
kclv.Test.Chart.Ships.prototype =
    Object.create(kclv.Test.Chart.Base.prototype);
kclv.Test.Chart.Ships.prototype.constructor =
    kclv.Test.Chart.Base;

// ----------------------------------------------------------------
// Ships: Bubble
// ----------------------------------------------------------------

test('kclv.Chart.Bubble', function() {
    var test = new kclv.Test.Chart.Ships(),
        configuration = test.configuration,
        table = null;

    kclv.Configuration.load(configuration);

    // vertical

    table = new kclv.Table.Ships.Bubble(test.relation);
    deepEqual(
        new kclv.Chart.Bubble(table).option,
        {
            horizontal : { },
            vertical : { maximum : 125, minimum : 1 }
        },
        'Has the default chart options.'
    );

    configuration.chart.Ships.vertical = { maximum : 100, minimum : 50 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Bubble(table).option.vertical,
        { maximum : 100, minimum : 50 },
        'Has the configurated chart options ' +
            '(when vertical maximum and vertical minimum were specified).'
    );

    configuration.chart.Ships.vertical = { gridlines : 10 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Bubble(table).option.vertical,
        { gridlines : 10, maximum : 125, minimum : 1 },
        'Has the configurated chart options ' +
            '(when vertical gridlines was specified).'
    );

    configuration.chart.Ships.vertical = { minorGridlines : 4 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Bubble(table).option.vertical,
        { minorGridlines : 4, maximum : 125, minimum : 1 },
        'Has the configurated chart options ' +
            '(when vertical minorGridlines was specified).'
    );

    configuration.chart.Ships.vertical = {
        gridlines : 5, minorGridlines : 2
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Bubble(table).option.vertical,
        { gridlines : 5, minorGridlines : 2, maximum : 125, minimum : 1 },
        'Has the configurated chart options ' +
            '(when vertical gridlines and vertical minorGridlines were ' +
            'specified).'
    );

    configuration.chart.Ships.vertical = { level : 70 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Bubble(table).option.vertical,
        { baseline : 70, maximum : 125, minimum : 1 },
        'Has the configurated chart options ' +
            '(when vertical level was specified for baseline).'
    );

    configuration.chart.Ships.vertical = { step : 10 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Bubble(table).option.vertical,
        { maximum : 130, minimum : 0, ticks : [
            0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
            110, 120, 130
        ] },
        'Has the configurated chart options ' +
            '(when vertical step was specified).' +
            'Note: ticks, maximum and minimum were justified.'
    );

    configuration.chart.Ships.vertical = { step : 40 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Bubble(table).option.vertical,
        { maximum : 160, minimum : 0, ticks : [ 0, 40, 80, 120, 160 ] },
        'Has the configurated chart options ' +
            '(when vertical step was specified).' +
            'Note: ticks, maximum and minimum were boldly justified.'
    );

    // horizontal

    configuration.chart.Ships.horizontal = {};
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Bubble(table).option.horizontal,
        { maximum : 2, minimum : 1 },
        'Has the default chart options' +
            '(when horizontal was specified).'
    );

    configuration.chart.Ships.horizontal = { maximum : 10, minimum : 1 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Bubble(table).option.horizontal,
        { maximum : 10, minimum : 1 },
        'Has the configurated chart options ' +
            '(when horizontal maximum and horizontal minimum were specified).'
    );

    configuration.chart.Ships.horizontal = { gridlines : 10 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Bubble(table).option.horizontal,
        { gridlines : 10, maximum : 2, minimum : 1 },
        'Has the configurated chart options ' +
            '(when horizontal gridlines was specified).'
    );

    configuration.chart.Ships.horizontal = { minorGridlines : 4 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Bubble(table).option.horizontal,
        { minorGridlines : 4, maximum : 2, minimum : 1 },
        'Has the configurated chart options ' +
            '(when horizontal minorGridlines was specified).'
    );

    configuration.chart.Ships.horizontal = {
        gridlines : 5, minorGridlines : 2
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Bubble(table).option.horizontal,
        { gridlines : 5, minorGridlines : 2, maximum : 2, minimum : 1 },
        'Has the configurated chart options ' +
            '(when horizontal gridlines and horizontal minorGridlines were ' +
            'specified).'
    );

    configuration.chart.Ships.horizontal = { step : 10 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Bubble(table).option.horizontal,
        { maximum : 10, minimum : 0, ticks : [0, 10] },
        'Has the configurated chart options ' +
            '(when horizontal step was specified).' +
            'Note: ticks, maximum and minimum were boldly justified.'
    );

    configuration.chart.Ships.horizontal = { step : 40 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Bubble(table).option.horizontal,
        { maximum : 40, minimum : 0, ticks : [ 0, 40 ] },
        'Has the configurated chart options ' +
            '(when horizontal step was specified).' +
            'Note: ticks, maximum and minimum were boldly justified.'
    );

    // etc.

    test.testRedraw('Bubble', table, configuration);

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Ships: Histogram
// ----------------------------------------------------------------

test('kclv.Chart.Histogram', function() {
    var test = new kclv.Test.Chart.Ships(),
        configuration = test.configuration,
        table = null;

    kclv.Configuration.load(configuration);

    // Levels

    table = new kclv.Table.Ships.Histogram(test.relation, 'Levels');
    deepEqual(
        new kclv.Chart.Histogram(table).option,
        {
            horizontal : { },
            vertical : { }
        },
        'Has the default chart options.'
    );

    configuration.chart.Ships.vertical = { maximum : 100, minimum : 50 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Histogram(table).option.vertical,
        { },
        'Has the default chart options ' +
            '(when vertical options were ignored).'
    );

    // Experiences

    table = new kclv.Table.Ships.Histogram(test.relation, 'Experiences');
    deepEqual(
        new kclv.Chart.Histogram(table).option,
        {
            horizontal : { },
            vertical : { }
        },
        'Has the default chart options.'
    );

    configuration.chart.Ships.vertical = { maximum : 100, minimum : 50 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Histogram(table).option.vertical,
        { },
        'Has the default chart options ' +
            '(when vertical options were ignored).'
    );

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Ships: Scatter
// ----------------------------------------------------------------

test('kclv.Chart.Scatter', function() {
    var test = new kclv.Test.Chart.Ships(),
        configuration = test.configuration,
        table = null;

    kclv.Configuration.load(configuration);

    // vertical, Levels

    table = new kclv.Table.Ships.Scatter(
        test.relation, ['Levels', 'Arrival']
    );
    deepEqual(
        new kclv.Chart.Scatter(table).option,
        {
            horizontal : { },
            vertical : { maximum : 150, minimum : 1 }
        },
        'Has the default chart options.'
    );

    configuration.chart.Ships.vertical = { maximum : 100, minimum : 50 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.vertical,
        { maximum : 100, minimum : 50 },
        'Has the configurated chart options ' +
            '(when vertical maximum and vertical minimum were specified).'
    );

    configuration.chart.Ships.vertical = { gridlines : 10 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.vertical,
        { gridlines : 10, maximum : 150, minimum : 1 },
        'Has the configurated chart options ' +
            '(when vertical gridlines was specified).'
    );

    configuration.chart.Ships.vertical = { minorGridlines : 4 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.vertical,
        { minorGridlines : 4, maximum : 150, minimum : 1 },
        'Has the configurated chart options ' +
            '(when vertical minorGridlines was specified).'
    );

    configuration.chart.Ships.vertical = {
        gridlines : 5, minorGridlines : 2
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.vertical,
        { gridlines : 5, minorGridlines : 2, maximum : 150, minimum : 1 },
        'Has the configurated chart options ' +
            '(when vertical gridlines and vertical minorGridlines were ' +
            'specified).'
    );

    configuration.chart.Ships.vertical = { level : 70 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.vertical,
        { baseline : 70, maximum : 150, minimum : 1 },
        'Has the configurated chart options ' +
            '(when vertical level was specified for baseline).'
    );

    configuration.chart.Ships.vertical = { step : 10 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.vertical,
        { maximum : 150, minimum : 0, ticks : [
            0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
            110, 120, 130, 140, 150
        ] },
        'Has the configurated chart options ' +
            '(when vertical step was specified).' +
            'Note: ticks, maximum and minimum were justified.'
    );

    configuration.chart.Ships.vertical = { step : 40 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.vertical,
        { maximum : 160, minimum : 0, ticks : [ 0, 40, 80, 120, 160 ] },
        'Has the configurated chart options ' +
            '(when vertical step was specified).' +
            'Note: ticks, maximum and minimum were boldly justified.'
    );

    // vertical, Experiences

    configuration.chart.Ships.vertical = {};
    kclv.Configuration.load(configuration);
    table = new kclv.Table.Ships.Scatter(
        test.relation, ['Experiences', 'Arrival']
    );
    deepEqual(
        new kclv.Chart.Scatter(table).option,
        {
            horizontal : { },
            vertical : { maximum : 4359999, minimum : 0 }
        },
        'Has the default chart options ' +
            'Note: the counted levels are converted into experiences.'
    );

    configuration.chart.Ships.vertical = { maximum : 100, minimum : 50 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.vertical,
        { maximum : 1000000, minimum : 122500 },
        'Has the configurated chart options ' +
            '(when vertical maximum and vertical minimum were specified).' +
            'Note: the specified levels are converted into experiences.'
    );

    configuration.chart.Ships.vertical = { gridlines : 10 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.vertical,
        { gridlines : 10, maximum : 4359999, minimum : 0 },
        'Has the configurated chart options ' +
            '(when vertical gridlines was specified).'
    );

    configuration.chart.Ships.vertical = { minorGridlines : 4 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.vertical,
        { minorGridlines : 4, maximum : 4359999, minimum : 0 },
        'Has the configurated chart options ' +
            '(when vertical minorGridlines was specified).' +
            'Note: the counted levels are converted into experiences.'
    );

    configuration.chart.Ships.vertical = {
        gridlines : 5, minorGridlines : 2
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.vertical,
        { gridlines : 5, minorGridlines : 2, maximum : 4359999, minimum : 0 },
        'Has the configurated chart options ' +
            '(when vertical gridlines and vertical minorGridlines were ' +
            'specified).' +
            'Note: the counted levels are converted into experiences.'
    );

    configuration.chart.Ships.vertical = { level : 70 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.vertical,
        { baseline : 265000, maximum : 4359999, minimum : 0 },
        'Has the configurated chart options ' +
            '(when vertical level was specified for baseline).' +
            'Note: the counted levels are converted into experiences.'
    );

    configuration.chart.Ships.vertical = { step : 10 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.vertical,
        { maximum : 4360000, minimum : 0, ticks : [
            0, 4500, 19000, 43500, 78000, 122500, 181500, 265000, 383000,
            545500, 1000000, 1055000, 1255000, 1785000, 2760000, 4360000
        ] },
        'Has the configurated chart options ' +
            '(when vertical step was specified for baseline).' +
            'Note: the counted levels are converted into experiences.'
    );

    configuration.chart.Ships.vertical = { step : 20, minorGridlines : 1 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.vertical,
        { maximum : 4360000, minimum : 0, minorGridlines : null, ticks : [
            0, 4500, 19000, 43500, 78000, 122500, 181500, 265000, 383000,
            545500, 1000000, 1055000, 1255000, 1785000, 2760000, 4360000
        ] },
        'Has the configurated chart options ' +
            '(when vertical step vertical minorGridlines were specified ' +
            'for baseline).' +
            'Note: the counted levels are converted into experiences.'
    );

    configuration.chart.Ships.vertical = { step : 40 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.vertical,
        { maximum : 4360000, minimum : 0, ticks : [
            0, 78000, 383000, 1255000, 4360000 // Round Lv.160 down to Lv.150
        ] },
        'Has the configurated chart options ' +
            '(when vertical step was specified for baseline).' +
            'Note: the counted levels are converted into experiences. ' +
            'Note: ticks, maximum and minimum were boldly justified.'
    );

    // horizontal

    configuration.chart.Ships.horizontal = {};
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.horizontal,
        { maximum : 4, minimum : 1 },
        'Has the default chart options' +
            '(when horizontal was specified).'
    );

    configuration.chart.Ships.horizontal = { maximum : 100, minimum : 50 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.horizontal,
        { maximum : 100, minimum : 50 },
        'Has the configurated chart options ' +
            '(when horizontal maximum and horizontal minimum were specified).'
    );

    configuration.chart.Ships.horizontal = { gridlines : 10 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.horizontal,
        { gridlines : 10, maximum : 4, minimum : 1 },
        'Has the configurated chart options ' +
            '(when horizontal gridlines was specified).'
    );

    configuration.chart.Ships.horizontal = { minorGridlines : 4 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.horizontal,
        { minorGridlines : 4, maximum : 4, minimum : 1 },
        'Has the configurated chart options ' +
            '(when horizontal minorGridlines was specified).'
    );

    configuration.chart.Ships.horizontal = {
        gridlines : 5, minorGridlines : 2
    };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.horizontal,
        { gridlines : 5, minorGridlines : 2, maximum : 4, minimum : 1 },
        'Has the configurated chart options ' +
            '(when horizontal gridlines and horizontal minorGridlines were ' +
            'specified).'
    );

    configuration.chart.Ships.horizontal = { step : 10 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.horizontal,
        { maximum : 10, minimum : 0, ticks : [0, 10] },
        'Has the configurated chart options ' +
            '(when horizontal step was specified).' +
            'Note: ticks, maximum and minimum were boldly justified.'
    );

    configuration.chart.Ships.horizontal = { step : 40 };
    kclv.Configuration.load(configuration);
    deepEqual(
        new kclv.Chart.Scatter(table).option.horizontal,
        { maximum : 40, minimum : 0, ticks : [ 0, 40 ] },
        'Has the configurated chart options ' +
            '(when horizontal step was specified).' +
            'Note: ticks, maximum and minimum were boldly justified.'
    );

    // etc.

    test.testRedraw('Scatter', table, configuration);

    // TODO: Even more tests.
});

// ----------------------------------------------------------------
// Placeholders
// ----------------------------------------------------------------

test('kclv.Chart.Annotation', function() {
    ok(
        new kclv.Chart.Annotation(),
        'Is a placeholder.'
    );

    // TODO: Even more tests.
});

test('kclv.Chart.Bar', function() {
    ok(
        new kclv.Chart.Bar(),
        'Is a placeholder.'
    );

    // TODO: Even more tests.
});

test('kclv.Chart.Calendar', function() {
    ok(
        new kclv.Chart.Calendar(),
        'Is a placeholder.'
    );

    // TODO: Even more tests.
});

test('kclv.Chart.Column', function() {
    ok(
        new kclv.Chart.Column(),
        'Is a placeholder.'
    );

    // TODO: Even more tests.
});

test('kclv.Chart.Diff', function() {
    ok(
        new kclv.Chart.Diff(),
        'Is a placeholder.'
    );

    // TODO: Even more tests.
});

test('kclv.Chart.Interval', function() {
    ok(
        new kclv.Chart.Interval(),
        'Is a placeholder.'
    );

    // TODO: Even more tests.
});

test('kclv.Chart.Pie', function() {
    ok(
        new kclv.Chart.Pie(),
        'Is a placeholder.'
    );

    // TODO: Even more tests.
});

test('kclv.Chart.Sankey', function() {
    ok(
        new kclv.Chart.Sankey(),
        'Is a placeholder.'
    );

    // TODO: Even more tests.
});

test('kclv.Chart.SteppedArea', function() {
    ok(
        new kclv.Chart.SteppedArea(),
        'Is a placeholder.'
    );

    // TODO: Even more tests.
});

test('kclv.Chart.Timeline', function() {
    ok(
        new kclv.Chart.Timeline(),
        'Is a placeholder.'
    );

    // TODO: Even more tests.
});

test('kclv.Chart.TreeMap', function() {
    ok(
        new kclv.Chart.TreeMap(),
        'Is a placeholder.'
    );

    // TODO: Even more tests.
});

test('kclv.Chart.Trendline', function() {
    ok(
        new kclv.Chart.Trendline(),
        'Is a placeholder.'
    );

    // TODO: Even more tests.
});


// ================================================================
module('Template');
// ================================================================

test('kclv.Template', function() {
    var configuration = { chart : { path : { template : './template' } } },
        template;

    kclv.Configuration.load(configuration);

    ok(
        template = new kclv.Template(['Materials', 'Line']),
        'Creates an object.'
    );

    deepEqual(
        template.render({
            foo: 'filled: foo.\r\n',
            bar: 'filled: bar.\r\n'
        }),
        'This is a meta template.\r\n\r\n' +
            'filled: foo.\r\n\r\n' +
            'filled: bar.\r\n\r\n' +
            'This is a body template.\r\n\r\n',
        'Fills in a template with complements.'
    );

    // TODO: Even more tests.
});


// ================================================================
module('Visualizer');
// ================================================================

test('kclv.Visualizer', function() {
    var visualizer,
        configuration = {
            relation : {},
            agent: {
                Logbook : {
                    path : new kclv.Test.Agent.Logbook().path
                }
            },
            chart : {
                Consumables : {},
                Resources : {},
                Ships: {},
                path : {
                    template : './template',
                    chart    : './chart'
                }
            },
            locale : 'xx',
            legend : { xx : {
                dateTime : 'd',
                Resources   : {
                    title : 'R',
                    Fuel : 'f', Ammunition : 'a', Steel : 's', Bauxite : 'b'
                },
                Ships: {
                    Bubble: {
                        title: 'B'
                    },
                    title: 'S',
                    classification: {},
                    abbreviation: {}
                }
            } }
        };

    kclv.Configuration.load(configuration);

    ok(
        visualizer = new kclv.Visualizer(),
        'Creates an object.'
    );

    throws(
        function() { visualizer.visualize(); },
        Error,
        'Cannot visualize some relation with no directive.'
    );

    visualizer.visualize({
        agent: 'Logbook',
        relation: 'Materials',
        chart: 'Line',
        option: 'Resources'
    });
    ok(
        true,
        'Visualizes "Logbook.Materials.Line.Resources" direcitive.'
    );

    visualizer.visualize({
        agent: 'Logbook',
        relation: 'Ships',
        chart: 'Bubble'
    });
    ok(
        true,
        'Visualizes "Logbook.Ships.Bubble" direcitive.'
    );

    // TODO: Even more tests.
});

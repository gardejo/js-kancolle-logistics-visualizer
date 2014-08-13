/**
 * @fileOverview A partical object for game rules.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

// ================================================================
// Game Rules
// ================================================================

// ----------------------------------------------------------------
// Namespace for Game Rules
// ----------------------------------------------------------------

/**
 * A namespace of game rules.
 * @public
 */
kclv.Game = {};

// ----------------------------------------------------------------
// Game Rule about Materials
// ----------------------------------------------------------------

/**
 * A game rule about materials.
 * @public
 * @const
 * @constructor
 */
kclv.Game.Materials = ( function() {
    /**
     * (Reserved) The maximum value of supplies of materials.
     * @private {Object.<string, number>}
     * @const
     */
    /*
    var LIMIT = {
        Resources   : 300000,
        Consumables :   3000
    };
    */

    /**
     * Default limit quantity for resources in imaginary HQ level 0.
     * @private {number}
     * @const
     */
    var FLOOR = 750;

    /**
     * Raise in limit quantity for resources induced by HQ level up.
     * @private {number}
     * @const
     */
    var RAISE_CEILING_PER_LEVEL = 250;

    /**
     * A list of materials per material kind.
     * @private {Array.<string>}
     * @const
     */
    var MATERIALS_OF = {
        Resources   : [ 'Fuel', 'Ammunition', 'Steel', 'Bauxite' ],
        Consumables : [ 'Repair', 'Construction', 'Development' ]
    };

    return {
        MATERIALS_OF : MATERIALS_OF,

        /**
         * Get concrete material names as a flattened array.
         *     Note: It is in particular order (order sensitive).
         * @public
         * @returns {Array.<string>} Concrete material names.
         * @nosideeffects
         */
        MATERIALS : ( function() {
            return [].concat(
                MATERIALS_OF.Resources, MATERIALS_OF.Consumables
            );
        }() ),

        /**
         * Get a string representing a material kind which combined material
         *     names.
         * @public
         * @param {string} material A concrete material name.
         * @returns {string} A combined material name.
         * @throws {Error} If the specified concrete material name is invalid.
         * @nosideeffects
         */
        getKindOf : function(material) {
            if (MATERIALS_OF[material]) {
                return material;
            }

            for ( var kind in MATERIALS_OF ) {
                if ( MATERIALS_OF[kind].indexOf(material) >= 0 ) {
                    return kind;
                }
            }

            throw new Error(
                'The specified concrete material name (' + material +
                ') is invalid.'
            );
        },

        /**
         * Calculate a ceiling of spontaneous recovery of resources.
         *     Formula is: HQ level * 250 + 750 (base (floor) value).
         * @public
         * @param {!string} kind A string representing a material kind.
         * @returns {number} Ceiling of spontaneous recovery of resources.
         * @nosideeffects
         */
        getCeilingOf : function(kind, level) {
            return kind === 'Resources' && level ?
                level * RAISE_CEILING_PER_LEVEL + FLOOR : 0;
        }
    };
}() );

// ----------------------------------------------------------------
// Game Rule about Ships
// ----------------------------------------------------------------

/**
 * A game rule about ships (Combined Fleet Girls).
 * @public
 * @const
 * @constructor
 */
kclv.Game.Ships = ( function() {
    /* jshint -W100 */

    return {
        /**
         * Array of abbreviations for ship classification.
         *     Caveat: WSH's Active Script engine requires us to append
         *     BOM, the root of all evils, when we use string literals
         *     which includes non-ASCII characters (such as Kanji).
         *     Note: JSHint persistently warn us against even non-ASCII
         *     characters "in comments"! We have no choice.
         * @public {Array.<string>}
         * @const
         */
        ABBREVIATION_FOR : {
            '\u6F5C\u6C34\u6BCD\u8266'             : 'AS',
                // Submarine Tender
            '\u5DE5\u4F5C\u8266'                   : 'AR',
                // Repair Ship
            '\u88C5\u7532\u7A7A\u6BCD'             : 'CVB',
                // (Armored) Aircraft Carrier
            '\u63DA\u9678\u8266'                   : 'LHA',
                // Amphibious Assultship
            '\u6C34\u4E0A\u6A5F\u6BCD\u8266'       : 'AV',
                // Seaplane Carrier
            '\u6F5C\u6C34\u7A7A\u6BCD'             : 'SSV',
                // Aircraft Carrying Submarine
            '\u6F5C\u6C34\u8266'                   : 'SS',
                // Submarine
            '\u6B63\u898F\u7A7A\u6BCD'             : 'CV',
                // (Regular) Aircraft Carrier
            '\u822A\u7A7A\u6226\u8266'             : 'BBV',
                // Aviation Battleship
            '\u6226\u8266'                         : 'BB',
                // Battleship
         // '\u5DE1\u6D0B\u6226\u8266'             : 'BC',
                // Battlecruiser
            '\u8EFD\u7A7A\u6BCD'                   : 'CVL',
                // Light Aircraft Carrier
            '\u822A\u7A7A\u5DE1\u6D0B\u8266'       : 'CAV',
                // Aircraft Cruiser
            '\u91CD\u5DE1\u6D0B\u8266'             : 'CA',
                // Heavy Cruiser
            '\u91CD\u96F7\u88C5\u5DE1\u6D0B\u8266' : 'CLT',
                // Torpedo Cruiser
            '\u8EFD\u5DE1\u6D0B\u8266'             : 'CL',
                // Light Cruiser
            '\u99C6\u9010\u8266'                   : 'DD'
                // Destroyer
        },

        /**
         * (Reserved) The maximum number of player's port size.
         * @public {number}
         * @const
         */
        /*
        PORT_SIZE : 190,
        */

        /*
         * Ticks of accumulated experience points required for level up of a
         *     ship (Combined Fleet Girl).
         * @public {Array.<number>}
         * @const
         * @see http://wikiwiki.jp/kancolle/?%B7%D0%B8%B3%C3%CD#yecfa05a
         */
        EXPERIENCES : [
                  0,     100,     300,     600,    1000, //   1 -   5
               1500,    2100,    2800,    3600,    4500, //   6 -  10
               5500,    6600,    7800,    9100,   10500, //  11 -  15
              12000,   13600,   15300,   17100,   19000, //  16 -  20
              21000,   23100,   25300,   27600,   30000, //  21 -  25
              32500,   35100,   37800,   40600,   43500, //  26 -  30
              46500,   49600,   52800,   56100,   59500, //  31 -  35
              63000,   66600,   70300,   74100,   78000, //  36 -  40
              82000,   86100,   90300,   94600,   99000, //  41 -  45
             103500,  108100,  112800,  117600,  122500, //  46 -  50
             127500,  132700,  138100,  143700,  149500, //  51 -  55
             155500,  161700,  168100,  174700,  181500, //  56 -  60
             188500,  195800,  203400,  211300,  219500, //  61 -  65
             228000,  236800,  245900,  255300,  265000, //  66 -  70
             275000,  285400,  296200,  307400,  319000, //  71 -  75
             331000,  343400,  356200,  369400,  383000, //  76 -  80
             397000,  411500,  426500,  442000,  458000, //  81 -  85
             474500,  491500,  509000,  527000,  545500, //  86 -  90
             564500,  584500,  606500,  631500,  661500, //  91 -  95
             701500,  761500,  851500, 1000000, 1000000, //  96 - 100
            1010000, 1011000, 1013000, 1016000, 1020000, // 101 - 105
            1025000, 1031000, 1038000, 1046000, 1055000, // 106 - 110
            1065000, 1077000, 1091000, 1107000, 1125000, // 111 - 115
            1145000, 1168000, 1194000, 1223000, 1255000, // 116 - 120
            1290000, 1329000, 1372000, 1419000, 1470000, // 121 - 125
            1525000, 1584000, 1647000, 1714000, 1785000, // 126 - 130
            1860000, 1940000, 2025000, 2115000, 2210000, // 131 - 135
            2310000, 2415000, 2525000, 2640000, 2760000, // 136 - 140
            2887000, 3021000, 3162000, 3310000, 3465000, // 141 - 145
            3628000, 3799000, 3978000, 4165000, 4360000  // 146 - 150
        ]
    };
}() );

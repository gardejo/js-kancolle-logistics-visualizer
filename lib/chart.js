/**
 * @fileOverview A partical object for charts.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

// ================================================================
// Charts
// ================================================================

// ----------------------------------------------------------------
// Interface of Charts
// ----------------------------------------------------------------

/**
 * An interface of charts.
 * @public
 * @interface
 * @extends {kclv.PseudoInterface}
 */
kclv.ChartLike = function() {
    kclv.PseudoInterface.call(this, []); // TODO

    return;
};
kclv.ChartLike.prototype = Object.create(kclv.PseudoInterface.prototype);
kclv.ChartLike.prototype.constructor = kclv.PseudoInterface;

// ----------------------------------------------------------------
// Namespace for Charts
// ----------------------------------------------------------------

/**
 * A namespace for charts.
 * @public
 */
kclv.Chart = {};

// ----------------------------------------------------------------
// Base Chart
// ----------------------------------------------------------------

/**
 * A base chart.
 *     Note: The object is for the convenience of definition of a chart-like
 *     object. Therefore, your object isn't necessarily have to extend the
 *     object while it implement {@code kclv.ChartLike} interface.
 * @public
 * @constructor
 * @implements {kclv.ChartLike}
 * @param {string} name A name of the chart.
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Base = function(name, table) {
    /**
     * A name of the chart.
     * @private {string}
     * @const
     */
    this.name_ = name;

    /**
     * A table object as a data source of the
     *     chart.
     * @public {kclv.Table.Base}
     * @const
     */
    this.table = table;

    /**
     * An Option for the chart.
     *     It is to be used by a {@code script} element in a chart client HTML
     *     file.
     * @public {Object.<string, *>}
     * @const
     */
    this.option = this.buildOption();

    /**
     * An inscription object.
     * @public {kclv.Inscription}
     * @const
     */
    this.inscription = new kclv.Inscription();

    return;
};

/**
 * Build and get a basic option for the chart.
 * @protected
 * @param {Object=} opt_configuration Configuration about the drowing chart.
 * @returns {Object.<string, *>} A basic option for the chart.
 * @nosideeffects
 */
kclv.Chart.Base.prototype.buildOption = function(opt_configuration) {
    var option = {};

    this.setOption(option, 'redraw', kclv.Configuration.get('chart'));
    option.vertical = {};
    option.horizontal = {};

    if (! opt_configuration) {
        return option;
    }

    ['vertical', 'horizontal'].forEach( function(direction) {
        if (opt_configuration[direction]) {
            ['gridlines', 'minorGridlines'].forEach( function(property) {
                this.setOption(
                    option[direction], property, opt_configuration[direction]
                );
            }, this);
        }
    }, this );

    return option;
};

/**
 * Build a chart option about horizontal (X) axis.
 * @protected
 * @param {Object=} configuration Configuration about the drowing chart.
 * @param {Object.<string, *>} option An option for the chart.
 * @param {string=} opt_kind A target kind of building the table.
 */
kclv.Chart.Base.prototype.buildHorizontalOption = function(
    option, configuration, opt_kind
) {
    if (! configuration.horizontal) {
        return;
    }

    this.setThreshold(option, configuration, 'horizontal');

    var step = configuration.horizontal.step;
    if (
        (typeof step === 'string' && step    ) ||
        (typeof step === 'number' && step > 0)
    ) {
        option.horizontal.ticks =
            this.buildTicks('horizontal', option, configuration);
    }

    return;
};

/**
 * Merge the parent configuration object into the child one.
 *     CAVEAT: It violates a branch of the global configuration object.
 * @protected
 * @param {string} childKind A child configuration.
 * @param {string} parentKind A parent configuration.
 * @return {Object.<string, *>} A cascaded (Unified) configuration.
 */
kclv.Chart.Base.prototype.cascadeHorizontalConfiguration = function(
    childKind, parentKind
) {
    var configuration = kclv.Configuration.get(['chart', childKind]);
    configuration.horizontal =
        kclv.Configuration.get(['chart', parentKind, 'horizontal'], true);

    return configuration;
};

/**
 * Set a value into the specified (branch of) option tree from the specified
 *     (branch of) configuration tree.
 * @protected
 * @param {Object.<string, *>} option A (partial branch of) option tree about
 *     the drawing chart.
 * @param {string} key A name of the specified option tree (and the specified
 *     configuration tree).
 * @param {Object.<string, *>} configuration A (partial branch of)
 *     configuration tree about the drowing chart.
 * @param {string=} opt_configurationKey A name of the specified configuration
 *     tree. If it is not specified, it uses {@code key}.
 */
kclv.Chart.Base.prototype.setOption = function(
    option, key, configuration, opt_configurationKey
) {
    if (! configuration) {
        return;
    }

    var value = configuration[ opt_configurationKey || key ];

    if (value !== undefined) {
        option[key] = value;
    }

    return;
};

/**
 * Set threshold ({@code maximum} and {@code minimum}) values on the specified
 *     option.
 * @protected
 * @param {Object.<string, *>} option A (partial branch of) option tree about
 *     the drawing chart.
 * @param {Object} configuration Configuration about the drowing chart.
 * @param {string} direction An axis of the table.
 *     It is {@code horizontal} or {@code vertical}.
 * @param {string=} opt_kind A target kind of building the table.
 */
kclv.Chart.Base.prototype.setThreshold = function(
    option, configuration, direction, opt_kind
) {
    ['maximum', 'minimum'].forEach( function(edge) {
        option[direction][edge] =
            this.getThreshold(configuration, direction, edge, opt_kind);
    }, this );

    return;
};

/**
 * Calculate a threshold ({@code maximum} and {@code minimum}) value.
 * @protected
 * @param {Object} configuration Configuration about the drowing chart.
 * @param {string} direction An axis of the table.
 *     It is {@code horizontal} or {@code vertical}.
 * @param {string} edge An edge of the range.
 *     It is {@code maximum} or {@code minimum}.
 * @param {string=} opt_kind A target kind of building the table.
 * @returns {number} A threshold value.
 * @nosideeffects
 */
kclv.Chart.Base.prototype.getThreshold = function(
    configuration, direction, edge, opt_kind
) {
    if (
        configuration[direction] !== undefined &&
        typeof configuration[direction][edge] === 'number'
    ) {
        return configuration[direction][edge];
    }

    if (direction === 'vertical') {
        return this.table[edge](opt_kind);
    }

    return edge === 'minimum' ?
        this.table.opening() : this.table.closing();
};

/**
 * Build ticks on the specified axis of a chart as array of numbers.
 *     Note: Y2-axis (ex. an instant repair on a resources chart) does not have
 *     an unique ticks. It follow Y1-axis.
 * @protected
 * @const
 * @param {string} direction An axis of the table.
 *     It is {@code horizontal} or {@code vertical}.
 * @param {Object.<string, *>} options A proper option.
 *     Note: Values (maximum and minimum) were temporarily converted into
 *     indices in advance.
 * @param {number|Object} clueToStep A step of ticks or an its determiner.
 * @param {Array.<number>=} opt_array A criterial array of ticks.
 * @returns {Array.<number>} Ticks of the specified axis on a chart.
 */
kclv.Chart.Base.prototype.buildTicks = function(
    direction, options, clueToStep, opt_array
) {
    var option = options[direction],
        step =
            typeof clueToStep === 'number' || typeof clueToStep === 'string' ?
                clueToStep : clueToStep[direction].step;

    return direction === 'horizontal' && this.table.isChronological() ?
        this.buildChronologicalTicks_(option, step) :
        this.buildNumericalTicks_(option, step, opt_array);
};

/**
 * Build chronological ticks on a horizontal (X) axis of a chart as array of
 *     time stamps.
 *     Note: Edges of ticks (the first tick and the last tick) do not get over
 *     limits (minimum and maximum).
 * @private
 * @param {Object.<string, *>} options An option.
 * @param {string} step A frequency of step of ticks.
 * @returns {Array.<number>} Ticks of the horizontal (X) axis on a chart.
 */
kclv.Chart.Base.prototype.buildChronologicalTicks_ = function(option, step) {
    // Get the first tick.
    var ticks = [],
        increaseTick;

    switch (step) {
        case 'Daily':
            ticks.push( new kclv.Date(option.minimum).toMidnight() );
            increaseTick = function(tick) {
                return tick.setDate( tick.getDate() + 1 );
            };
            break;
        case 'Weekly':
            ticks.push( new kclv.Date(option.minimum).toMonday() );
            increaseTick = function(tick) {
                return tick.setDate( tick.getDate() + 7 );
            };
            break;
        case 'Monthly':
            ticks.push( new kclv.Date(option.minimum).toFirstDayOfMonth() );
            increaseTick = function(tick) {
                return tick.setMonth( tick.getMonth() + 1 );
            };
            break;
        case 'Yearly':
            ticks.push( new kclv.Date(option.minimum).toNewYearsDay() );
            increaseTick = function(tick) {
                return tick.setFullYear( tick.getFullYear() + 1 );
            };
            break;
        default:
            throw new kclv.Exception.InvalidFrequency(step);
    }

    // Add ticks gradually.
    while ( ticks[ticks.length - 1] < option.maximum ) {
        var tick = new Date( ticks[ticks.length - 1] ); // Clone the last tick.
        increaseTick.call(null, tick); // Increse days.
        ticks.push(tick);
    }

    // Trim edges of ticks (the first tick and the last tick) if they get over
    // limits (minimum and maximum).
    if ( ticks.length && ticks[0] < option.minimum ) {
        ticks.shift();
    }
    if ( ticks.length && ticks[ticks.length - 1] > option.maximum ) {
        ticks.pop();
    }

    // Convert time stamps into serialized strings.
    return ticks.map( function(tick) {
        return tick.toJSON(); // Note: It converts locale time into UTC.
    } );
};

/**
 * Build numerical ticks on an axis of a chart as array of numbers.
 *     Note: Edges of ticks (the first tick and the last tick) may get over
 *     limits (minimum and maximum). Therefore, range (window) of vertical (Y)
 *     axis or scale of horizontal (X) axis, in short, {@code option.maximum}
 *     and {@code option.minimum}, are overridden by each edge (the first or
 *     the last) tick as a side effect.
 * @private
 * @param {Object.<string, *>} options An option.
 *     Note: Values (minimum and maximum) were temporarily converted into
 *     indices in advance.
 * @param {number} step A step of ticks.
 * @param {Array.<number>=} opt_array A criterial array of ticks.
 * @returns {Array.<number>} Ticks of the specified axis on a chart.
 */
kclv.Chart.Base.prototype.buildNumericalTicks_ = function(
    option, step, opt_array
) {
    // Get the first tick.
    var ticks = option.minimum > 0 ?
            [ option.minimum - option.minimum % step ] : [0];

    // Add ticks gradually.
    while (ticks[ticks.length - 1] < option.maximum) {
        ticks.push(ticks[ticks.length - 1] + step);
    }

    // Convert back indices into values.
    if (opt_array) {
        // Ex. Lv.1 (Exp.0), 5(1000), 10(4500), 15(10500), 20(19000), ...
        ticks = ticks.map( function(tick) {
            return opt_array[tick - 1];
        } );
        ticks[0] = ticks[0] || 0;
        if (ticks[ticks.length - 1] === undefined) {
            ticks[ticks.length - 1] = opt_array[opt_array.length - 1];
        }
    }

    // Overwrite range (window) of Y-axis or scale of X-axis.
    option.minimum = ticks[0];
    option.maximum = ticks[ticks.length - 1];

    return ticks;
};

// ----------------------------------------------------------------
// Annotation Chart
// ----------------------------------------------------------------

/**
 * An annotation chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Annotation = function(table) {
    kclv.Chart.Base.call(this, 'Annotation', table);

    return;
};
kclv.Chart.Annotation.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Annotation.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Bar Chart
// ----------------------------------------------------------------

/**
 * A bar chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Bar = function(table) {
    kclv.Chart.Base.call(this, 'Bar', table);

    return;
};
kclv.Chart.Bar.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Bar.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Calendar Chart
// ----------------------------------------------------------------

/**
 * A calendar chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Calendar = function(table) {
    kclv.Chart.Base.call(this, 'Calendar', table);

    // For soties, ...

    return;
};
kclv.Chart.Calendar.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Calendar.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Column Chart
// ----------------------------------------------------------------

/**
 * A column chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Column = function(table) {
    kclv.Chart.Base.call(this, 'Column', table);

    return;
};
kclv.Chart.Column.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Column.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Diff Chart
// ----------------------------------------------------------------

/**
 * A diff chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Diff = function(table) {
    kclv.Chart.Base.call(this, 'Diff', table);

    return;
};
kclv.Chart.Diff.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Diff.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Interval Chart
// ----------------------------------------------------------------

/**
 * An interval chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Interval = function(table) {
    kclv.Chart.Base.call(this, 'Interval', table);

    return;
};
kclv.Chart.Interval.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Interval.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Pie Chart
// ----------------------------------------------------------------

/**
 * A pie chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Pie = function(table) {
    kclv.Chart.Base.call(this, 'Pie', table);

    return;
};
kclv.Chart.Pie.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Pie.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Sankey Chart
// ----------------------------------------------------------------

/**
 * A sankey chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Sankey = function(table) {
    kclv.Chart.Base.call(this, 'Sankey', table);

    return;
};
kclv.Chart.Sankey.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Sankey.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Stepped Area Chart
// ----------------------------------------------------------------

/**
 * A stepped area chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.SteppedArea = function(table) {
    kclv.Chart.Base.call(this, 'SteppedArea', table);

    return;
};
kclv.Chart.SteppedArea.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.SteppedArea.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Timeline
// ----------------------------------------------------------------

/**
 * A timeline.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Timeline = function(table) {
    kclv.Chart.Base.call(this, 'Timeline', table);

    return;
};
kclv.Chart.Timeline.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Timeline.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Tree Map Chart
// ----------------------------------------------------------------

/**
 * A tree map chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.TreeMap = function(table) {
    kclv.Chart.Base.call(this, 'TreeMap', table);

    return;
};
kclv.Chart.TreeMap.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.TreeMap.prototype.constructor = kclv.Chart.Base;

// ----------------------------------------------------------------
// Trendline
// ----------------------------------------------------------------

/**
 * A trendline.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Trendline = function(table) {
    kclv.Chart.Base.call(this, 'Trendline', table);

    return;
};
kclv.Chart.Trendline.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Trendline.prototype.constructor = kclv.Chart.Base;

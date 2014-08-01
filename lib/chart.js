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

    if (opt_configuration.vertical) {
        this.setOption(
            option.vertical, 'gridlines', opt_configuration.vertical
        );
        this.setOption(
            option.vertical, 'minorGridlines', opt_configuration.vertical
        );
    }

    if (opt_configuration.horizontal) {
        this.setOption(
            option.horizontal, 'gridlines', opt_configuration.horizontal
        );
        this.setOption(
            option.horizontal, 'minorGridlines', opt_configuration.horizontal
        );
    }

    return option;
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
    if (configuration === undefined) {
        return;
    }

    opt_configurationKey = opt_configurationKey || key;
    var value = configuration[opt_configurationKey];

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

    return edge === 'maximum' ? this.table.count() : 1;
};

/**
 * Build ticks on Y-axis of a chart as array of numbers.
 *     Note: It overrites {@code this.option.maximum} and
 *     {@code this.option.maximum} as a side effect.
 *     Note: Y2-axis (ex. an instant repair on a resources chart) does not have
 *     an unique ticks. It follow Y1-axis.
 * @protected
 * @const
 * @param {Object.<string, *>} option A proper option.
 *     Note: Values (maximum and minimum) were temporarily converted into
 *     indices in advance.
 * @param {number} step A step of ticks of Y-axis on a line chart.
 * @param {Array.<number>=} opt_array A criterial array of ticks.
 * @returns {Array.<number>} Ticks of Y-axis on a line chart.
 */
kclv.Chart.Base.prototype.buildTicks = function(option, step, opt_array) {
    // Get the first tick.
    var ticks = option.minimum > 0 ?
        [ option.minimum - option.minimum % step ] : [0];

    // Get ticks. Note: JavaScript does not support a negative index.
    do {
        ticks.push(ticks[ticks.length - 1] + step);
    } while (ticks[ticks.length - 1] < option.maximum);

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
// Bubble Chart
// ----------------------------------------------------------------

/**
 * A bubble chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {kclv.Table.Base} table A table object as a data source of the chart.
 */
kclv.Chart.Bubble = function(table) {
    kclv.Chart.Base.call(this, 'Bubble', table);

    return;
};
kclv.Chart.Bubble.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Bubble.prototype.constructor = kclv.Chart.Base;

/**
 * Calculate a threshold ({@code maximum} and {@code minimum}) value.
 * @protected
 * @override
 * @param {Object} configuration Configuration about the drowing chart.
 * @param {string} direction An axis of the table.
 *     It is {@code horizontal} or {@code vertical}.
 * @param {string} edge An edge of the range.
 *     It is {@code maximum} or {@code minimum}.
 * @param {string=} opt_kind A target kind of building the table.
 * @returns {number} A threshold value.
 * @nosideeffects
 */
kclv.Chart.Bubble.prototype.getThreshold = function(
    configuration, direction, edge, opt_kind
) {
    if (
        configuration[direction] !== undefined &&
        typeof configuration[direction][edge] === 'number'
    ) {
        return configuration[direction][edge];
    }

    return this.table[edge](opt_kind);
};

/**
 * Build and get an option for the bubble chart.
 *     TODO: Unify with {@code kclv.Chart.Scatter#buildOption()}
 * @protected
 * @override
 * @returns {Object.<string, *>} An option for the bubble chart.
 * @nosideeffects
 */
kclv.Chart.Bubble.prototype.buildOption = function() {
    var configuration = kclv.Configuration.get('chart.Ships'),
        option =
            kclv.Chart.Base.prototype.buildOption.call(this, configuration);

    this.setThreshold(option, configuration, 'vertical', 'AverageLevel');

    if (configuration.vertical) {
        if (configuration.vertical.step > 0) {
            // Note: Levels (as indices + 1) are converted back into
            // experiences (as values of experiences array).
            option.vertical.ticks = this.buildTicks(
                option.vertical,
                configuration.vertical.step
            );
        }
        if (configuration.vertical.level) {
            option.vertical.baseline = configuration.vertical.level;
        }
    }

    if (configuration.horizontal) {
        this.setThreshold(
            option, configuration, 'horizontal', 'TotalShipNumber'
        );
        if (configuration.horizontal.step > 0) {
            option.horizontal.ticks = this.buildTicks(
                option.horizontal, configuration.horizontal.step
            );
        }
    }

    return option;
};

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
// Candlestick Chart
// ----------------------------------------------------------------

/**
 * A candlestick chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {!kclv.Table.Materials.Candlestick} table A table object as a data
 *     source of the chart.
 */
kclv.Chart.Candlestick = function(table) {
    kclv.Chart.Base.call(this, 'Candlestick', table);

    return;
};
kclv.Chart.Candlestick.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Candlestick.prototype.constructor = kclv.Chart.Base;

/**
 * Build and get an option for the candlestick chart.
 * @protected
 * @override
 * @returns {Object.<string, *>} An option for the candlestick chart.
 * @nosideeffects
 */
kclv.Chart.Candlestick.prototype.buildOption = function() {
    var material = this.table.kind,
        kind = kclv.Game.Materials.getKindOf(material),
        configuration = kclv.Configuration.get(['chart', kind]),
        option =
            kclv.Chart.Base.prototype.buildOption.call(this, configuration);

    this.setThreshold(option, configuration, 'vertical', material);

    if (configuration.vertical) {
        if (configuration.vertical.step) {
            option.vertical.ticks =
                this.buildTicks(option.vertical, configuration.vertical.step);
        }
        if (configuration.vertical.level) {
            option.vertical.baseline = kclv.Game.Materials.getCeilingOf(
                kind, configuration.vertical.level
            );
        }
    }

    this.setOption(option, 'hollowIsRising', kclv.Configuration.get('chart'));

    return option;
};

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
// Histogram
// ----------------------------------------------------------------

/**
 * A histogram.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {!kclv.Table.Ships.Histogram} table A table object as a data source
 *     of the chart.
 */
kclv.Chart.Histogram = function(table) {
    kclv.Chart.Base.call(this, 'Histogram', table);

    return;
};
kclv.Chart.Histogram.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Histogram.prototype.constructor = kclv.Chart.Base;

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
// Line Chart
// ----------------------------------------------------------------

/**
 * A line chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {!kclv.Table.Materials.Line} table A data source of the chart.
 */
kclv.Chart.Line = function(table) {
    kclv.Chart.Base.call(this, 'Line', table);

    return;
};
kclv.Chart.Line.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Line.prototype.constructor = kclv.Chart.Base;

/**
 * Build a chart option.
 *     It is to be used by a {@code script} element in a chart client HTML
 *     file.
 * @protected
 * @override
 * @returns {Object.<string, *>} An option for the line chart.
 * @nosideeffects
 */
kclv.Chart.Line.prototype.buildOption = function() {
    var material = this.table.kind,
        kind = kclv.Game.Materials.getKindOf(material),
        configuration = kclv.Configuration.get(['chart', kind]),
        option =
            kclv.Chart.Base.prototype.buildOption.call(this, configuration);

    this.setThreshold(option, configuration, 'vertical', material);

    if (configuration.vertical) {
        if (configuration.vertical.step > 0) {
            option.vertical.ticks =
                this.buildTicks(option.vertical, configuration.vertical.step);
        }
        if (configuration.vertical.level > 0) {
            option.vertical.baseline = kclv.Game.Materials.getCeilingOf(
                kind, configuration.vertical.level
            );
        }
    }

    if (this.table.opposite) {
        // Note: Do not call getThreshold() because it maybe unnecessary.
        this.setOption(
            option.vertical,
            'opposingBaseline',
            kclv.Configuration.get(
                ['chart', this.table.opposite, 'vertical'], true
            ),
            'minimum'
        );
    }

    // TODO: Horizontal (X-axis) ticks. (Monthly or Weekly or Daily ...)

    return option;
};

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
// Scatter Chart
// ----------------------------------------------------------------

/**
 * A scatter chart.
 * @public
 * @constructor
 * @extends {kclv.Chart.Base}
 * @implements {kclv.ChartLike}
 * @param {!kclv.Table.Ships.Scatter} table A table object as a data source of
 *     the chart.
 */
kclv.Chart.Scatter = function(table) {
    kclv.Chart.Base.call(this, 'Scatter', table);

    return;
};
kclv.Chart.Scatter.prototype = Object.create(kclv.Chart.Base.prototype);
kclv.Chart.Scatter.prototype.constructor = kclv.Chart.Base;

/**
 * Calculate a threshold ({@code maximum} and {@code minimum}) value.
 *     Note: If {@code kind} is {@code Experiences}, the returned value is
 *     converted to experience points (from the table or the specified level).
 * @protected
 * @override
 * @param {Object} configuration Configuration about the drowing chart.
 * @param {string} direction An axis of the table.
 *     It is {@code horizontal} or {@code vertical}.
 * @param {string} edge An edge of the range.
 *     It is {@code maximum} or {@code minimum}.
 * @param {string} kind A target kind of building the table.
 * @returns {number} A threshold value.
 * @nosideeffects
 */
kclv.Chart.Scatter.prototype.getThreshold = function(
    configuration, direction, edge, kind
) {
    if (
        kind === 'Experiences' &&
        configuration[direction] !== undefined &&
        typeof configuration[direction][edge] === 'number'
    ) {
        return kclv.Game.Ships.EXPERIENCES[configuration[direction][edge] - 1];
    }

    return kclv.Chart.Base.prototype.getThreshold.apply(this, arguments);
};

/**
 * Build a chart option.
 *     It is to be used by a {@code script} element in a chart client HTML
 *     file.
 * @protected
 * @override
 * @returns {Object.<string, *>} An option for the scatter chart.
 * @nosideeffects
 */
kclv.Chart.Scatter.prototype.buildOption = function() {
    var configuration = kclv.Configuration.get('chart.Ships'),
        option =
            kclv.Chart.Base.prototype.buildOption.call(this, configuration);

    this.buildVerticalOption_(option, configuration);
    this.buildHorizontalOption_(option, configuration);

    return option;
};

/**
 * Build a chart option about vertical (Y) axis.
 * @private
 * @param {Object=} configuration Configuration about the drowing chart.
 * @param {Object.<string, *>} option An option for the chart.
 */
kclv.Chart.Scatter.prototype.buildVerticalOption_ = function(
    option, configuration
) {
    var kind = this.table.kind,
        step,
        experiences = kclv.Game.Ships.EXPERIENCES;

    this.setThreshold(option, configuration, 'vertical', kind);

    if (! configuration.vertical) {
        return;
    }

    if (configuration.vertical.step > 0) {
        step = configuration.vertical.step;

        if (kind === 'Experiences' && option.vertical.minorGridlines > 0) {
            step = Math.floor( step / (option.vertical.minorGridlines + 1) );
            option.vertical.minorGridlines = null;
        }

        // Note: Experiences (as values of experiences array: maximum and
        // minimum) were temporarily converted into levels (as indices+1).
        this.setThreshold(option, configuration, 'vertical', 'Levels');

        // Note: Levels (as indices + 1) are converted back into
        // experiences (as values of experiences array).
        option.vertical.ticks = this.buildTicks(
            option.vertical,
            step,
            kind === 'Experiences' ? experiences : null
        );
    }
    if (configuration.vertical.level) {
        option.vertical.baseline = kind === 'Levels' ?
            configuration.vertical.level :
            experiences[ configuration.vertical.level - 1 ];
    }

    return;
};

/**
 * Build a chart option about horizontal (X) axis.
 * @private
 * @param {Object=} configuration Configuration about the drowing chart.
 * @param {Object.<string, *>} option An option for the chart.
 */
kclv.Chart.Scatter.prototype.buildHorizontalOption_ = function(
    option, configuration
) {
    if (! configuration.horizontal) {
        return;
    }

    this.setThreshold(option, configuration, 'horizontal');

    if (configuration.horizontal.step > 0) {
        option.horizontal.ticks = this.buildTicks(
            option.horizontal, configuration.horizontal.step
        );
    }

    return;
};

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

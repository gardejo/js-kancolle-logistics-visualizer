/**
 * @fileOverview A partical object for charts of ships.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

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
            option.vertical.ticks =
                this.buildTicks('vertical', option, configuration);
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
            option.horizontal.ticks =
                this.buildTicks('horizontal', option, configuration);
        }
    }

    return option;
};

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
            'vertical', option, step,
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
        option.horizontal.ticks =
            this.buildTicks('horizontal', option, configuration);
    }

    return;
};

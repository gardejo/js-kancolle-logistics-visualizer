/**
 * @fileOverview A partical object for charts for materials.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

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
        configuration = this.cascadeHorizontalConfiguration(kind, 'Materials'),
        option =
            kclv.Chart.Base.prototype.buildOption.call(this, configuration);

    this.setThreshold(option, configuration, 'vertical', material);

    if (configuration.vertical) {
        if (configuration.vertical.step) {
            option.vertical.ticks =
                this.buildTicks('vertical', option, configuration);
        }
        if (configuration.vertical.level) {
            option.vertical.baseline = kclv.Game.Materials.getCeilingOf(
                kind, configuration.vertical.level
            );
        }
    }

    this.setOption(option, 'hollowIsRising', kclv.Configuration.get('chart'));
    if (
        this.setOption(option, 'continuous', kclv.Configuration.get('chart'))
    ) {
        this.buildHorizontalOption(option, configuration, material);
    }

    return option;
};

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
kclv.Chart.Candlestick.prototype.getThreshold = function(
    configuration, direction, edge, opt_kind
) {
    var threshold = kclv.Chart.Base.prototype.getThreshold.call(
        this, configuration, direction, edge, opt_kind
    );

    return direction === 'horizontal' ?
        new kclv.Date(threshold).toPeriod(this.table.option).v :
        threshold;
};

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
        configuration = this.cascadeHorizontalConfiguration(kind, 'Materials'),
        option =
            kclv.Chart.Base.prototype.buildOption.call(this, configuration);

    this.setThreshold(option, configuration, 'vertical', material);

    if (configuration.vertical) {
        if (configuration.vertical.step > 0) {
            option.vertical.ticks =
                this.buildTicks('vertical', option, configuration);
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
            kclv.Configuration.get( [
                'chart', 
                kclv.Game.Materials.getKindOf(this.table.opposite),
                'vertical'
            ], true ),
            'minimum'
        );
    }

    if (
        this.setOption(option, 'continuous', kclv.Configuration.get('chart'))
    ) {
        this.buildHorizontalOption(option, configuration, material);
    }

    return option;
};

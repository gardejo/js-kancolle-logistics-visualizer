/**
 * @fileOverview A partical object for a visualizer.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

// ================================================================
// Visualizer
// ================================================================

/**
 * Visualizer, so-called "main" object.
 *     It is not a "service model" (DDD) but just a "service layer" (PoEAA).
 * @public
 * @constructor
 */
kclv.Visualizer = function() {
    /**
     * A delegated file writer object to write a chart client file.
     * @private {kclv.Stream}
     */
    this.stream_ = new kclv.Stream();

    return;
};

/**
 * (Integration) Create a chart client HTML file.
 * @public
 * @param {!Object.<string, string>} directive A directive of the
 *     visualization. It must have {@code agent}, {@code relation},
 *     {@code chart} and {@code option}.
 * @see ../help.html (User's guide)
 */
kclv.Visualizer.prototype.visualize = function(directive) {
    var agent = kclv.Factory.getInstance(
            kclv.Agent,
            directive.agent
        ),
        relation = kclv.RelationFactory.getInstance(
            directive.relation,
            agent
        ),
        table = kclv.Factory.getInstance(
            kclv.Table,
            [ directive.relation, directive.chart ],
            [ relation, directive.option ]
        ),
        chart = kclv.Factory.getInstance(
            kclv.Chart,
            directive.chart,
            [ table ]
        ),
        template = new kclv.Template(
            [ directive.relation, directive.chart ]
        ),
        path = kclv.Configuration.get('chart.path.chart') + '/' +
                    [
                        directive.agent,
                        directive.relation,
                        directive.chart
                    ].concat(
                        ( directive.option ? [directive.option] : [] )
                    ).join('.') + '.html';

    this.stream_.writeFile( path, template.render(chart) );

    return;
};

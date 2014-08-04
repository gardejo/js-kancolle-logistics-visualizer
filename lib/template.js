/**
 * @fileOverview A partical object for a template.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

// ================================================================
// Template
// ================================================================

/**
 * A wrapper for a template engine (JsViews).
 * @public
 * @constructor
 * @param {!Array.<string>} names Fragments of the chart name.
 */
kclv.Template = function(names) {
    /**
     * A delegated file reader object to read a template file.
     * @private {kclv.Stream}
     */
    this.stream_ = new kclv.Stream();

    /**
     * A delegated template engine (JsViews) object.
     * @private {Object}
     */
    this.engine_ = this.buildEngine_(names);

    return;
};


/**
 * Render contents for a chart client HTML file from template.
 * @public
 * @param {!Object} complements Fill-in a template form.
 * @returns {string} A rendered string.
 */
kclv.Template.prototype.render = function(complements) {
    return this.engine_.render(complements);
};

/**
 * Build and get a delegated template engin object.
 *     TODO: jsviews object prototype.
 * @private
 * @param {!Array.<string>} names Fragments of the chart name.
 * @returns {Object} Template engine (JsViews) object.
 * @nosideeffects
 */
kclv.Template.prototype.buildEngine_ = function(names) {
    return jsviews.templates({
        markup : this.readTemplate_(names),
        templates : {
            meta : this.readTemplate_(['meta']),
            body : this.readTemplate_(['body'])
        },
        helpers : {
            formatter : new kclv.Formatter()
        }
    });
};

/**
 * Get a template string from the specified template file. It's a syntax suger.
 * @private
 * @param {!string} kind Template kind.
 * @returns {string} A template string.
 * @nosideeffects
 */
kclv.Template.prototype.readTemplate_ = function(names) {
    return this.stream_.readFile(
        kclv.Configuration.get('chart.path.template') + '/' +
        names.join('.') + '.html'
    );
};

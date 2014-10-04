/**
 * @fileOverview A partical object for an inscription.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

// ================================================================
// Inscription
// ================================================================

/**
 * An inscription of the library. It's assumed to be the {@code generator}
 *     attribute of the meta element in a chart client HTML file.
 * @public
 * @constructor
 * @struct
 */
kclv.Inscription = function() {
    /**
     * A formal name of the library.
     * @public {string}
     * @const
     */
    this.name = 'KanColle Logistics Visualizer';

    /**
     * Version number of the library.
     * @public {string}
     * @const
     * @see http://semver.org/
     */
    this.version = '0.2.0';

    /**
     * A development stage of the library.
     *     Note: The library defines stages of development below:
     *     <dl>
     *         <dt>Alpha</dt>
     *             <dd>First phase to begin testing. APIs may changed.</dd>
     *         <dt>Beta, a.k.a. Trial, (Technical) Preview or Early Access</dt>
     *             <dd>Released for trial use.</dd>
     *         <dt>RC: Release candidate</dt>
     *             <dd>Released by a candidate to GA.</dd>
     *         <dt>GA: General availability, a.k.a. Stable</dt>
     *             <dd>Released on the assumption that public use.</dd>
     *     </dl>
     * @public {string}
     * @const
     */
    this.stage = 'Beta';

    return;
};

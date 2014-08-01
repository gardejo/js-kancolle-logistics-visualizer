/**
 * @fileOverview A funny object library for KanColle Logistics Visualizer.
 *     This module added {@code kclv} symbol to the global namespace.
 *     Caveat: This file is encoded as UTF-8N (with BOM).
 *     TODO: Compile it.
 *     TODO: Platform independent (not JScript but JavaScript).
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 * @supported We demonstrate the library in environments below:
 *     <ul>
 *         <li>Windows XP Professional (32bit, Japanese edition) + SP3</li>
 *         <li>Windows Vista Home Premium (32bit, Japanese edition) + SP1</li>
 *         <li>Windows 7 Ultimate (64bit, Japanese edition) + SP1</li>
 *         <li>Windows 8.1 Professional (32bit, Japanese edition)</li>
 *         <li>Windows 8.1 Professional (64bit, Japanese edition)</li>
 *     </ul>
 * @see http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 *     Note: Only polyfills (./polyfill.js) touch built-in objects.
 * @see http://jslint.com/
 * @see http://jshint.com/
 * @see kclv.Inscription
 * @see ../test/test.js
 * @see http://developers.slashdot.org/comments.pl?sid=33602&cid=3636102
 * @see https://github.com/EnterpriseQualityCoding/FizzBuzzEnterpriseEdition
 */

'use strict';

// ================================================================
// Global Namespace
// ================================================================

/**
 * A top-level namespace for KanColle Logistics Visualizer.
 * @public
 */
var kclv; // Or, "org.gardejo.kancolle.logistics.visualizer" ?
if (!kclv) {
    kclv = {};
}

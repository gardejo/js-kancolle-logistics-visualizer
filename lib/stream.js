/**
 * @fileOverview A partical object for an I/O stream.
 * @author kclv@ermitejo.com (MORIYA Masaki, alias Gardejo)
 * @license The MIT license (See LICENSE file)
 */

'use strict';

// ================================================================
// I/O Stream
// ================================================================

/**
 * A file reader/writer.
 * @public
 * @constructor
 */
kclv.Stream = function() {
    /**
     * A default character set.
     * @private {string}
     * @const
     */
    this.defaultCharacterSet_ = 'UTF-8';

    return;
};

/**
 * Read the specified file as the optionally specified character set, and get
 *     its contents as a string.
 *     TODO: Cannot open a log file when KCRDB runs. : Avoided agonizingly.
 *     TODO: Anti anti-virus software.
 *     Note: Scripting.FileSystemObject only treats Shift JIS and UTF-16.
 * @public
 * @param {!string} path A path string to a reading file.
 * @param {string=} opt_characterSet A character set. Default to the property.
 * @returns {string} Contents of the reading file.
 * @throws {kclv.Exception.File} If a file could not opend.
 * @nosideeffects
 * @see http://d.hatena.ne.jp/language_and_engineering/20090216/p1
 */
kclv.Stream.prototype.readFile = function(path, opt_characterSet) {
    try {
        var stream, contents;

        path = this.canonizePathString_(path);

        // TODO: parameter of ADODB.Stream#Open or
        // property of ADODB.Stream#Mode
        if (opt_characterSet) {
            // Workaround.
            return new ActiveXObject('Scripting.FileSystemObject').
                   OpenTextFile(path, 1).
                   ReadAll();
        }

        stream = new ActiveXObject('ADODB.Stream');
        // stream.Mode = 0; // default ADODB.ConnectModeEnum.adModeUnknown
            // LoadFromFile: "File could not be opened." when KCRDB runs
        // stream.Mode = 1; // ADODB.ConnectModeEnum.adModeRead
            // LoadFromFile: "Operation is not allowed in this context." always
        // stream.Type = 2; // default ADODB.StreamTypeEnum.adTypeText
        stream.Charset = opt_characterSet || this.defaultCharacterSet_;

        stream.Open(); // Source, Mode, OpenOptions, UserName, Password
        stream.LoadFromFile(path);
        contents = stream.ReadText(); // default ADODB.StreamReadEnum.adReadAll

        stream.Close();

        return contents;
    } catch (e) {
        throw new kclv.Exception.File(path);
    }
};

/**
 * Write the specified string as contents to the specified file as the
 *     optionally specified character set.
 * @public
 * @param {!string} path A path string to a writing file.
 * @param {!string} contents Contents of writigin file.
 * @param {string=} opt_characterSet A character set. Default to the property.
 * @throws {kclv.Exception.File} If a file could not opend.
 * @nosideeffects
 */
kclv.Stream.prototype.writeFile = function(path, contents, opt_characterSet) {
    try {
        var stream = new ActiveXObject('ADODB.Stream');

        path = this.canonizePathString_(path);

        // stream.Mode = 0; // default ADODB.ConnectModeEnum.adModeUnknown
        // stream.Mode = 2; // ADODB.ConnectModeEnum.adModeWrite
            // WriteText: "Operation is not allowed in this context."
        // stream.Type = 2; // default ADODB.StreamTypeEnum.adTypeText
        stream.Charset = opt_characterSet || this.defaultCharacterSet_;

        stream.Open(); // Source, Mode, OpenOptions, UserName, Password
        stream.WriteText(contents);
        stream.SaveToFile(path, 2);
            // ADODB.SaveOptionsEnum.adSaveCreateOverWrite

        stream.Close();

        return;
    } catch (e) {
        throw new kclv.Exception.File(path);
    }
};

/**
 * Canonize the specified path string and get it.
 * @private
 * @param {!string} path A path string.
 * @return {string} A cannonized path string.
 * @nosideeffects
 */
kclv.Stream.prototype.canonizePathString_ = function(path) {
    return path.
        replace(/\\/g, '/').
        replace( /%.+%/g, function(match) {
            return new ActiveXObject('WScript.Shell').
                ExpandEnvironmentStrings(match);
        } );
};

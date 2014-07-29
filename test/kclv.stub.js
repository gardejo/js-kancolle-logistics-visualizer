/**
 * @fileOverview Stub Library for KanColle Logistics Visualizer.
 *     Caveat: This file is encoded as UTF-8N (with BOM).
 * @version 0.1.2
 * @author kclv@ermitejo.com (MORIYA Masaki, alias "Gardejo")
 * @license The MIT license (See LICENSE.txt)
 * @see ./kclv.test.js
 */


// ================================================================
// Script mode syntax (Whole-library)
// ================================================================

'use strict'; // Yup yup. I know that: Use the function form of "use strict".


// ================================================================
// Namespace for Test Stub
// ================================================================

var kclv;

kclv.Stub = {};


// ================================================================
// Stream (Replacement for ADODB.Stream)
// ================================================================

kclv.Stub.Stream = function() {
    this.READYSTATE = {
        UNSENT : 0,
        OPENED : 1,
        HEADERS_RECEIVED : 2,
        LOADING : 3,
        DONE : 4
    };

    this.HTTP_STATUS = {
        NOT_HTTP : 0,
        OK : 200
    };

    this.stream_ = null;

    this.buffer_ = null;

    return;
};

kclv.Stub.Stream.prototype.Open = function(opt_characterSet) {
    this.stream_ = new XMLHttpRequest();
    if (opt_characterSet) {
        this.stream_.overrideMimeType(
            'text/plain; charset=' + opt_characterSet
        );
    }

    return;
};

kclv.Stub.Stream.prototype.LoadFromFile = function(path) {
    var self = this;

    // TODO: Use jquery.load()
    this.stream_.onreadystatechange = function () {
        if (
            this.readyState === self.READYSTATE.DONE &&
            (
                this.status === self.HTTP_STATUS.OK ||
                this.status === self.HTTP_STATUS.NOT_HTTP
            )
        ) {
            self.buffer_ = this.responseText;
        }

        return;
    };

    this.stream_.open('GET', path, false);
    this.stream_.send(null);

    return;
};

// TODO
kclv.Stub.Stream.prototype.SaveToFile = function(path, option) {
    this.stream_.onreadystatechange = function () {
        // ...
        return;
    };

    /*
    this.stream_.open('POST', path);
    this.stream_.setRequestHeader('Content-Type', 'text/plain');
    this.stream_.send(this.buffer_);
    */

    return;
};

kclv.Stub.Stream.prototype.Close = function() {
    this.stream_ = null;

    this.buffer_ = null;

    return;
};

kclv.Stub.Stream.prototype.ReadText = function() {
    return this.buffer_;
};

kclv.Stub.Stream.prototype.WriteText = function(contents) {
    this.buffer_ = contents;

    return;
};


// ================================================================
// FileSystemObject (Replacement for Scripting.FileSystemObject)
// ================================================================

kclv.Stub.FileSystemObject = function() {
    kclv.Stub.Stream.call(this);

    return;
};
kclv.Stub.FileSystemObject.prototype =
    Object.create(kclv.Stub.Stream.prototype);
kclv.Stub.FileSystemObject.prototype.constructor =
    kclv.Stub.Stream;

kclv.Stub.FileSystemObject.prototype.OpenTextFile = function(path, mode) {
    kclv.Stub.Stream.prototype.Open.call(this, 'Shift-JIS');
    kclv.Stub.Stream.prototype.LoadFromFile.call(this, path);

    return this; // As a file handle object.
};

kclv.Stub.FileSystemObject.prototype.ReadAll = function() {
    return kclv.Stub.Stream.prototype.ReadText.call(this);
};

kclv.Stub.FileSystemObject.prototype.GetAbsolutePathName = function(path) {
    return path;
};


// ================================================================
// Shell (Replacement for WScript.Shell)
// ================================================================

kclv.Stub.Shell = function() {
    return;
};

kclv.Stub.Shell.prototype.ExpandEnvironmentStrings = function(environment) {
    switch (environment) {
        case '%LocalAppData%':
        case '%AppData%':
            return './'; // Workaround.
        default:
            return environment;
    }
};


// ================================================================
// ActiveXObject (Replacement for ActiveXObject)
// ================================================================

var ActiveXObject = function(objectName) {
    switch (objectName) {
        case 'ADODB.Stream':
            return new kclv.Stub.Stream();
        case 'Scripting.FileSystemObject':
            return new kclv.Stub.FileSystemObject();
        case 'WScript.Shell':
            return new kclv.Stub.Shell();
        default:
            throw new Error();
    }
};

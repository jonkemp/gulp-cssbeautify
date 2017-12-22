'use strict';

var PluginError = require('plugin-error'),
    through = require('through2'),
    cssbeautify = require('cssbeautify');

module.exports = function (options) {
    return through.obj(function (file, enc, cb) {
        var opt = options || {};

        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new PluginError('gulp-cssbeautify', 'Streaming not supported'));
            return;
        }

        try {
            file.contents = new Buffer(cssbeautify(file.contents.toString(), opt));
        } catch (err) {
            this.emit('error', new PluginError('gulp-cssbeautify', err));
        }

        this.push(file);

        cb();
    });
};

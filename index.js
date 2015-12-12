'use strict';

var gutil = require('gulp-util'),
    through = require('through2'),
    cssbeautify = require('cssbeautify');

module.exports = function (options) {
    return through.obj(function (file, enc, cb) {
        var opt = options || {};

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-cssbeautify', 'Streaming not supported'));
            return cb();
        }

        try {
            file.contents = new Buffer(cssbeautify(file.contents.toString(), opt));
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-cssbeautify', err));
        }

        this.push(file);

        cb();
    });
};

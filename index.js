'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var cssbeautify = require('cssbeautify');

module.exports = function(opt){
    return through.obj(function (file, enc, cb) {
        opt = opt || {};

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

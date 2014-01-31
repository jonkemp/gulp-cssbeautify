var map = require('map-stream');
var gutil = require('gulp-util');
var cssbeautify = require('cssbeautify');

module.exports = function(opt){
    return map(function (file, cb){
        if (!opt) {
            opt = {};
        }

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            return cb(new Error('gulp-cssbeautify: Streaming not supported'));
        }

        file.contents = new Buffer(cssbeautify(file.contents.toString(), opt));

        cb(null, file);
    });
};
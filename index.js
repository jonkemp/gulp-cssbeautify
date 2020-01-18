const PluginError = require('plugin-error');
const through = require('through2');
const cssbeautify = require('cssbeautify');

module.exports = options => through.obj(function (file, enc, cb) {
    const opt = options || {};

    if (file.isNull()) {
        cb(null, file);
        return;
    }

    if (file.isStream()) {
        cb(new PluginError('gulp-cssbeautify', 'Streaming not supported'));
        return;
    }

    try {
        file.contents = Buffer.from(cssbeautify(file.contents.toString(), opt));
    } catch (err) {
        this.emit('error', new PluginError('gulp-cssbeautify', err));
    }

    this.push(file);

    cb();
});

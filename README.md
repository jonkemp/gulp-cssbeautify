# [gulp](https://github.com/wearefractal/gulp)-cssbeautify [![Build Status](https://travis-ci.org/jonkemp/gulp-cssbeautify.png?branch=master)](https://travis-ci.org/jonkemp/gulp-cssbeautify)

> [CSS Beautify](https://github.com/senchalabs/cssbeautify) automatically formats your style to be consistent and easy to read


Given the following style:

```css
menu{color:red} navigation{background-color:#333}
```

CSS Beautify will produce:

```css
menu {
    color: red
}

navigation {
    background-color: #333
}
```


## Install

Install with [npm](https://npmjs.org/package/gulp-cssbeautify)

```
npm install --save-dev gulp-cssbeautify
```


## Example

```js
var gulp = require('gulp'),
    cssbeautify = require('gulp-cssbeautify');

gulp.task('css', function() {
    gulp.src('./styles/*.css')
        .pipe(cssbeautify())
        .pipe(gulp.dest('./styles/'));;
});
```


## API

### cssbeautify(options)


#### options.indent

Type: `String`  
Default: `'    '`

The indentation to use.


#### options.openbrace

Type: `String`  
Default: `end-of-line`  
Values: `end-of-line`, `separate-line`

Defines the placement of open curly brace.


#### options.autosemicolon

Type: `Boolean`  
Default: `false`

Always inserts a semicolon after the last ruleset.


## License

MIT © [Jonathan Kemp](http://jonkemp.com)

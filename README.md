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


## Options

You can pass an optional object to adjust the formatting. Options are:

  *  <code>indent</code> is a string used for the indentation of the declaration (default is 4 spaces)
  *  <code>openbrace</code> defines the placement of open curly brace, either *end-of-line* (default) or *separate-line*.
  *  <code>autosemicolon</code> always inserts a semicolon after the last ruleset (default is *false*)

The options object is passed directly to [cssbeautify](https://github.com/senchalabs/cssbeautify).


## License

MIT © [Jonathan Kemp](http://jonkemp.com)
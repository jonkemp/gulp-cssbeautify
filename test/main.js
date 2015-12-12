/* eslint-disable */
/* global describe, it */

var should = require('should');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var es = require('event-stream');
var beautify = require('../index');
var cssbeautify = require('cssbeautify');

function compare(input, options, done) {
    var stream = beautify(options);
    var fakeFile = new gutil.File({
        path: './test/fixture/file.css',
        cwd: './test/',
        base: './test/fixture/',
        contents: new Buffer(input.join('\n'))
    });

    var expected = cssbeautify(String(fakeFile.contents), options);

    stream.on('error', done);

    stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal('./test/fixture/file.css');
        newFile.relative.should.equal('file.css');
        String(newFile.contents).should.equal(expected);
        done();
    });

    stream.write(fakeFile);
}

describe('gulp-cssbeautify', function() {
    it('should let null files pass through', function(done) {
        var stream = beautify(),
            n = 0;

        stream.pipe(es.through(function(file) {
            should.equal(file.path, 'null.md');
            should.equal(file.contents,  null);
            n++;
        }, function() {
            should.equal(n, 1);
            done();
        }));

        stream.write(new gutil.File({
            path: 'null.md',
            contents: null
         }));

        stream.end();
    });

    it('should emit error on streamed file', function (done) {
        gulp.src(path.join('test', 'file.css'), { buffer: false })
            .pipe(beautify())
            .on('error', function (err) {
                err.message.should.equal('Streaming not supported');
                done();
            });
    });

    it('Should handle simple style', function(done) {
        var input = [
            'menu { color: blue; }',
            '',
            'box { border-radius: 4px; background-color: red }',
            '',
            'a { color: green }',
            'b { color: red }'
        ];
        var options = {};
        compare(input, options, done);
    });

    it('Should handle block comments', function(done) {
        var input = [
            '/* line comment */',
            'navigation { color: blue }',
            '',
            'menu {',
            '    /* line comment inside */',
            '    border: 2px',
            '}',
            '',
            '/* block',
            ' comment */',
            'sidebar { color: red }',
            '',
            'invisible {',
            '    /* block',
            '     * comment',
            '     * inside */',
            '    color: #eee',
            '}'
        ];
        var options = {};
        compare(input, options, done);
    });

    it('Should handle indentation', function(done) {
        var input = [
            '     navigation {',
            '    color: blue',
            '  }'
        ];
        var options = {};
        compare(input, options, done);
    });

    it('Should handle indentation with spaces', function(done) {
        var input = [
            '     navigation {',
            '    color: blue',
            '  }'
        ];
        var options = {
            indent: '  ',
        };
        compare(input, options, done);
    });

    it('Should handle indentation with tabs', function(done) {
        var input = [
            '     navigation {',
            '    color: blue',
            '  }'
        ];
        var options = {
            indent: '\t',
        };
        compare(input, options, done);
    });

    it('Should handle blank lines and spaces', function(done) {
        var input = [
            '/* only one blank line between */',
            'menu { color: red }',
            '',
            '',
            '',
            '',
            'navi { color: black }',
            '',
            '/* automatically insert a blank line */',
            'button { border: 1px } sidebar { color: #ffe }',
            '',
            '/* always whitespace before { */',
            'hidden{opacity:0%}',
            '',
            '/* no blank lines inside ruleset */',
            'imprint {',
            '  color: blue;',
            '',
            '',
            '    opacity: 0.5;',
            '',
            '   font-size: small',
            '}',
            '',
            '/* before colon: no space, after colon: one space only */',
            'footer {',
            '      font-family:     Arial;',
            '',
            '  float   :right;',
            '  }'
        ];
        var options = {};
        compare(input, options, done);
    });

    it('Should handle quoted string', function(done) {
        var input = [
            'nav:after{content:\'}\'}',
            'nav:before{content:"}"}'
        ];
        var options = {};
        compare(input, options, done);
    });

    it('Should handle selectors', function(done) {
        var input = [
            '* { border: 0px solid blue; }',
            'div[class="{}"] { color: red; }',
            'a[id=\\"foo"] { padding: 0; }',
            '[id=\\"foo"] { margin: 0; }',
            '#menu, #nav, #footer { color: royalblue; }'
        ];
        var options = {};
        compare(input, options, done);
    });

    it('Should handle empty rule', function(done) {
        var input = [
            'menu{}'
        ];
        var options = {
            autosemicolon: true
        };
        compare(input, options, done);
    });

    it('Should handle @font-face directive', function(done) {
        var input = [
            '@font-face{ color:     black; background-color:blue}'
        ];
        var options = {
            autosemicolon: true
        };
        compare(input, options, done);
    });

    it('Should handle @import directive', function(done) {
        var input = [
            'menu{background-color:red} @import url(\'foobar.css\') screen;',
            'nav{margin:0}'
        ];
        var options = {};
        compare(input, options, done);
    });

    it('Should handle @media directive', function(done) {
        var input = [
            '@import "subs.css";',
            '@import "print-main.css" print;',
            '@media print {',
            '  body { font-size: 10pt }',
            '  nav { color: blue; }',
            '}',
            'h1 {color: red; }'
        ];
        var options = {};
        compare(input, options, done);
    });

    it('Should handle @media directive (auto-semicolon)', function(done) {
        var input = [
            '@media screen {',
            '  menu { color: navy }',
            '}'
        ];
        var options = {
            autosemicolon: true
        };
        compare(input, options, done);
    });

    it('Should handle url', function(done) {
        var input = [
            'menu { background-image: url(data:image/png;base64,AAAAAAA); }'
        ];
        var options = {};
        compare(input, options, done);
    });

    it('Should handle animation keyframe', function(done) {
        var input = [
            '@-webkit-keyframes anim {',
            '0% { -webkit-transform: translate3d(0px, 0px, 0px); }',
            '100% { -webkit-transform: translate3d(150px, 0px, 0px) }}'
        ];
        var options = {};
        compare(input, options, done);
    });
});

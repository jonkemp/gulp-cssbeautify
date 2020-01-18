/* eslint-disable */
/* global describe, it */

const should = require('should');
const path = require('path');
const gulp = require('gulp');
const Vinyl = require('vinyl');
const es = require('event-stream');
const beautify = require('../index');
const cssbeautify = require('cssbeautify');

function compare(input, options, done) {
    const stream = beautify(options);
    const fakeFile = new Vinyl({
        path: '/test/fixture/file.css',
        cwd: '/test/',
        base: '/test/fixture/',
        contents: Buffer.from(input.join('\n'))
    });

    const expected = cssbeautify(String(fakeFile.contents), options);

    stream.on('error', done);

    stream.on('data', newFile => {
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);

        newFile.path.should.equal('/test/fixture/file.css');
        newFile.relative.should.equal('file.css');
        String(newFile.contents).should.equal(expected);
        done();
    });

    stream.write(fakeFile);
}

describe('gulp-cssbeautify', () => {
    it('should let null files pass through', done => {
        const stream = beautify();
        let n = 0;

        stream.pipe(es.through(file => {
            should.equal(file.path, 'null.md');
            should.equal(file.contents,  null);
            n++;
        }, () => {
            should.equal(n, 1);
            done();
        }));

        stream.write(new Vinyl({
            path: 'null.md',
            contents: null
         }));

        stream.end();
    });

    it('should emit error on streamed file', done => {
        gulp.src(path.join('test', 'file.css'), { buffer: false })
            .pipe(beautify())
            .on('error', ({message}) => {
                message.should.equal('Streaming not supported');
                done();
            });
    });

    it('Should handle simple style', done => {
        const input = [
            'menu { color: blue; }',
            '',
            'box { border-radius: 4px; background-color: red }',
            '',
            'a { color: green }',
            'b { color: red }'
        ];
        const options = {};
        compare(input, options, done);
    });

    it('Should handle block comments', done => {
        const input = [
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
        const options = {};
        compare(input, options, done);
    });

    it('Should handle indentation', done => {
        const input = [
            '     navigation {',
            '    color: blue',
            '  }'
        ];
        const options = {};
        compare(input, options, done);
    });

    it('Should handle indentation with spaces', done => {
        const input = [
            '     navigation {',
            '    color: blue',
            '  }'
        ];
        const options = {
            indent: '  ',
        };
        compare(input, options, done);
    });

    it('Should handle indentation with tabs', done => {
        const input = [
            '     navigation {',
            '    color: blue',
            '  }'
        ];
        const options = {
            indent: '\t',
        };
        compare(input, options, done);
    });

    it('Should handle blank lines and spaces', done => {
        const input = [
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
        const options = {};
        compare(input, options, done);
    });

    it('Should handle quoted string', done => {
        const input = [
            'nav:after{content:\'}\'}',
            'nav:before{content:"}"}'
        ];
        const options = {};
        compare(input, options, done);
    });

    it('Should handle selectors', done => {
        const input = [
            '* { border: 0px solid blue; }',
            'div[class="{}"] { color: red; }',
            'a[id=\\"foo"] { padding: 0; }',
            '[id=\\"foo"] { margin: 0; }',
            '#menu, #nav, #footer { color: royalblue; }'
        ];
        const options = {};
        compare(input, options, done);
    });

    it('Should handle empty rule', done => {
        const input = [
            'menu{}'
        ];
        const options = {
            autosemicolon: true
        };
        compare(input, options, done);
    });

    it('Should handle @font-face directive', done => {
        const input = [
            '@font-face{ color:     black; background-color:blue}'
        ];
        const options = {
            autosemicolon: true
        };
        compare(input, options, done);
    });

    it('Should handle @import directive', done => {
        const input = [
            'menu{background-color:red} @import url(\'foobar.css\') screen;',
            'nav{margin:0}'
        ];
        const options = {};
        compare(input, options, done);
    });

    it('Should handle @media directive', done => {
        const input = [
            '@import "subs.css";',
            '@import "print-main.css" print;',
            '@media print {',
            '  body { font-size: 10pt }',
            '  nav { color: blue; }',
            '}',
            'h1 {color: red; }'
        ];
        const options = {};
        compare(input, options, done);
    });

    it('Should handle @media directive (auto-semicolon)', done => {
        const input = [
            '@media screen {',
            '  menu { color: navy }',
            '}'
        ];
        const options = {
            autosemicolon: true
        };
        compare(input, options, done);
    });

    it('Should handle url', done => {
        const input = [
            'menu { background-image: url(data:image/png;base64,AAAAAAA); }'
        ];
        const options = {};
        compare(input, options, done);
    });

    it('Should handle animation keyframe', done => {
        const input = [
            '@-webkit-keyframes anim {',
            '0% { -webkit-transform: translate3d(0px, 0px, 0px); }',
            '100% { -webkit-transform: translate3d(150px, 0px, 0px) }}'
        ];
        const options = {};
        compare(input, options, done);
    });
});

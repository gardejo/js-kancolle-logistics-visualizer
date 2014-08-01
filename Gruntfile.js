'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        curl: {
            'extlib/qunit.js': 'http://code.jquery.com/qunit/qunit-1.14.0.js',
            'extlib/qunit.css': 'http://code.jquery.com/qunit/qunit-1.14.0.css'
        },
        markdown: {
            readme: {
                files: [
                    {
                        expand: true,
                        src: 'README.md',
                        dest: '',
                        ext: '.html'
                    }
                ]
            }
        },
        jsdoc: {
            dist: {
                src: [
                    'lib/*.js',
                    '!<%= concat.dist.dest %>',
                    '!lib/polyfill.js'
                ],
                dest: 'doc',
                options: {
                    lenient: true
                }
            }
        },
        clean: {
            dev: [
                'node_modules/',
                'npm-debug.log',
                'extlib/*',
                '!extlib/.exists',
            ],
            doc: [
                'README.html',
                'doc/*',
                '!doc/generator.bat'
            ],
            chart: [
                'chart/*',
                '!chart/.exists'
            ],
            dist: [
                '<%= concat.dist.dest %>',
                '*.zip'
            ]
        },
        concat: {
            options: {
                stripBanners: true,
                process: function(source, path) {
                    return source.replace(
                        // Remove script mode syntax and append origin.
                        /(^|\r?\n)\s*('use strict'|"use strict");?\s*/,
                        [
                            '// Source: ' + path,
                            '',
                            ''
                        ].join(grunt.util.linefeed)
                    );
                },
                banner: [
                    '/**',
                    ' * @fileOverview <%= pkg.description %>.',
                    ' *     This module added {@code <%= pkg.name %>} ' +
                        'symbol to the global namespace.',
                    ' * @version <%= pkg.version %> (Released at ' +
                        '<%= grunt.template.today("isoDateTime") %>' +
                        '<%= grunt.template.today("o") %>)',
                    ' * @author <%= pkg.author.email %> ' +
                        '(<%= pkg.author.name %>)',
                    ' * @license <%= pkg.licenses[0].type %> ' +
                        '(See LICENSE file)',
                    ' */',
                    '',
                    "'use strict'; // Script mode syntax (Whole-library)",
                    '',
                    ''
                ].join(grunt.util.linefeed)
            },
            dist: {
                src: [
                    // Note: Don't specify 'lib/*.js'! It is order-sensitive.
                    'lib/main.js', // It has script mode and global namespace.
                    'lib/inscription.js',
                    'lib/factory.js',
                    'lib/formatter.js',
                    'lib/exception.js',
                    'lib/array.js',
                    'lib/pseudo-interface.js',
                    'lib/configuration.js',
                    'lib/stream.js',
                    'lib/date.js',
                    'lib/game.js',
                    'lib/agent.js',
                    'lib/tokenizer.js',
                    'lib/selector.js',
                    'lib/projector.js',
                    'lib/relation.js',
                    'lib/table.js',
                    'lib/chart.js',
                    'lib/template.js',
                    'lib/visualizer.js'
                ],
                dest: 'lib/kclv.js',
                nonull: true
            }
        },
        compress: {
            dist: {
                options: {
                    archive: '<%= pkg.name %>-<%= pkg.version %>.zip'
                },
                files: [
                    {
                        src: [
                            'README.html',
                            'LICENSE',
                            'configuration.json',
                            'visualizer.wsf',
                            'chart/**',
                            '<%= concat.dist.dest %>',
                            'lib/polyfill.js',
                            'template/**'
                        ]
                    }
                ]
            }
        },
        jshint: {
            self: [
                'Gruntfile.js',
            ],
            test: [
                'test/*.js',
                'test/.jshintrc',
                'test/.csshintrc'
            ],
            dist: [
                // 'configuration.json',
                'lib/*.js',
                '!<%= concat.dist.dest %>',
                '!lib/polyfill.js'
            ],
            options: {
                jshintrc: 'test/.jshintrc'
            }
        },
        csslint: {
            dist: {
                src: [
                    'template/chart.css'
                ],
                options: {
                    csslintrc: 'test/.csslintrc'
                }
            }
        },
        qunit: {
            files: [
                'test/harness.html'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-curl');
    grunt.registerTask(
        'build',
        [
            'curl'
        ]
    );

    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.registerTask(
        'doc',
        [
            'clean:doc',
            'markdown',
            'jsdoc'
        ]
    );

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.registerTask(
        'dist',
        [
            'clean:dist',
            'clean:chart',
            'clean:doc',
            'markdown',
            'concat',
            'compress:dist'
        ]
    );

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.registerTask(
        'test',
        [
            'csslint',
            'jshint',
            'concat',
            'qunit'
        ]
    );
};

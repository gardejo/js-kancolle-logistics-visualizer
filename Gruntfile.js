module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        curl: {
            'extlib/qunit.js': 'http://code.jquery.com/qunit/qunit-1.14.0.js',
            'extlib/qunit.css': 'http://code.jquery.com/qunit/qunit-1.14.0.css'
        },
        markdown: {
            all: {
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
                    'lib/kclv.js'
                ],
                dest: 'doc',
                options: {
                    lenient: true
                }
            }
        },
        clean: {
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
                '*.zip'
            ]
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
                            'lib/**',
                            'template/**'
                        ]
                    }
                ]
            }
        },
        jshint: {
            files: [
                // 'configuration.json',
                'lib/kclv.js',
                'test/*.js',
                'test/.jshintrc'
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
            'markdown',
            'jsdoc'
        ]
    );

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.registerTask(
        'dist',
        [
            'clean',
            'markdown',
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
            'qunit'
        ]
    );
};

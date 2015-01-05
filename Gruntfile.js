module.exports = function (grunt) {
  grunt.initConfig({
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist: {
        // the files to concatenate
        src: ['lib/ng-cordova-oauth.js', 'lib/jsOAuth-1.3.7.js', 'src/*.js'],
        // the location of the resulting JS file
        dest: 'dist/twitter-oauth-lib.js'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            'dist/*.js'
          ]
        }]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
};
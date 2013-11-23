module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: require('home-dir').directory + '/.jshintrc'
      },
      all: ['public/javascripts/app/**/*.js', 'routes/**/*.js', 'models/**/*.js', 'sockets/**/*.js', 'lib/**/*.js', '*.js']
    },

    watch: {
      editing: {
        files: ['public/javascripts/app/**/*.js', 'routes/**/*.js', 'models/**/*.js', 'sockets/**/*.js', 'lib/**/*.js', '*.js'],
        tasks: ['jshint']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');

  grunt.registerTask('default', ['watch']);
};

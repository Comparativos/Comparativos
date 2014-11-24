/**
* Export jade template files to html
*/

module.exports = function(grunt) {

	grunt.config.set('jade', {
		compile: {
	    	options: {
	      		data: {
	        		debug: false
	      		}
	    	},
	    	// files: {
	     //  		"assets/js/app/**/*.html": ['assets/js/app/**/*.jade']
	    	// },
	    	files: grunt.file.expandMapping('**/*.jade', 'assets/js', {
	            cwd: 'assets/js',
	            // flatten: true,
	            ext: '.html'
       		})
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jade');
};
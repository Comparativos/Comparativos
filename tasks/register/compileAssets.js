module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		// 'jst:dev',
		'jade:compile',
		'html2js:dev',
		'less:dev',
		'copy:dev',
		'coffee:dev'
	]);
};

export default {
	input: 'fetcho.es.js',
	output: {
		file: 'fetcho.js',
		format: 'cjs',
		exports: 'named'
	},
	name: 'fetcho',
	plugins: [
		{
			transformBundle: code => `${code
	.replace(/window\.fetch/, `require('fetch-cookie/node-fetch')(require('node-fetch'))`)
	.replace(/^exports\['default'\] = (\w+);?$/m, (_, name) => `module.exports = Object.assign(${name}, exports);`)}`
		}
	]
}

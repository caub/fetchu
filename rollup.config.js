import resolve from 'rollup-plugin-node-resolve';

export default {
	name: 'fetcho',
	input: 'index.js',
	output: {
		file: 'fetcho.js',
		format: 'umd'
	},
	plugins: [
		resolve({
			browser: true
		})
	]
}

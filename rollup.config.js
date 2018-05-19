import babel from 'rollup-plugin-babel';

const tweakDefault = {
	transformBundle: source =>
		source.replace(/^exports\.default = (.*);$/m, (_, x) => `module.exports = exports = ${x};`),
};

export default {
	input: 'index.js',
	output: [{
		format: 'cjs',
		file: 'fetcho.cjs.js',
		exports: 'named',
		plugins: [tweakDefault, babel()]
	}, {
		format: 'cjs',
		file: 'fetcho.node.js',
		exports: 'named',
		intro: `const fetch = require('fetch-cookie/node-fetch')(require('node-fetch'));\n`,
		plugins: [tweakDefault, babel()]
	}, {
		format: 'es',
		file: 'fetcho.mjs',
		intro: `const fetch = require('fetch-cookie/node-fetch')(require('node-fetch'));\n`,
		plugins: [babel()]
	}, {
		format: 'umd',
		file: 'fetcho.umd.js',
		name: 'fetcho',
		plugins: [babel()]
	}]
}

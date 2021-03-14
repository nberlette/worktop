const { parse, format } = require('path');
const { copyFileSync, existsSync } = require('fs');
const pkg = require('../package.json');
const esbuild = require('./esbuild');

const externals = [
	'worktop',
	'worktop/cache',
	...Object.keys(pkg.dependencies)
];

/**
 * @param {string} input
 * @param {string} output
 */
async function bundle(input, output) {
	await esbuild.build(input, output, externals);

	let dts = input.replace(/\.[mc]?[tj]s$/, '.d.ts');
	if (!existsSync(dts)) return console.warn('Missing "%s" file!', dts);

	let info = parse(input);
	info.base = 'index.d.ts';
	info.dir = info.name;

	copyFileSync(dts, format(info));
}

/**
 * init
 */
bundle('src/index.js', pkg.exports['.']);
bundle('src/cache.js', pkg.exports['./cache']);

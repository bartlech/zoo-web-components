import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import sass from 'node-sass';

const production = !process.env.ROLLUP_WATCH;
const shared = {
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			preprocess: {
				style: ({ content, attributes }) => {
					if (attributes.type !== 'text/scss') return;

					return new Promise((fulfil, reject) => {
						sass.render({
							data: content,
							includePaths: ['zoo-modules/shared-module', 'src/common'],
							sourceMap: true,
							outFile: 'x' // this is necessary, but is ignored
						}, (err, result) => {
							if (err) return reject(err);

							fulfil({
								code: result.css.toString(),
								map: result.map.toString()
							});
						});
					});
				}
			},
			customElement: true
		}),
		resolve(),
		production && terser()
	]
}

export default [
	{
		plugins: [
			svelte({
				preprocess: {
					style: ({ content, attributes }) => {
						if (attributes.type !== 'text/scss') return;
	
						return new Promise((fulfil, reject) => {
							sass.render({
								data: content,
								includePaths: ['zoo-modules/shared-module', 'src/common'],
								sourceMap: true,
								outFile: 'x' // this is necessary, but is ignored
							}, (err, result) => {
								if (err) return reject(err);
	
								fulfil({
									code: result.css.toString(),
									map: result.map.toString()
								});
							});
						});
					}
				},
				dev: !production
			}),
			resolve(),
			production && terser()
		],
		input: 'src/app.js',
		output: {
			sourcemap: false,
			format: 'iife',
			file: 'docs/app.js',
			name: 'app'
		}
	},
	Object.assign({}, shared, {
		input: 'src/docs.js',
		output: {
			sourcemap: false,
			format: 'iife',
			file: 'docs/bundle-docs.js',
			name: 'iife'
		}
	}),
	Object.assign({}, shared, {
		input: 'src/components.js',
		output: {
			sourcemap: false,
			format: 'iife',
			file: 'docs/bundle-iife.js',
			name: 'iife'
		}
	})
];

import path from 'node:path';

import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			formats: ['es'],
			fileName: () => 'piper.mjs',
		},
	},
	plugins: [
		dts(),
	],
	test: {
		coverage: {
			provider: 'v8',
			reporter: [ 'text', 'json', 'html' ],
		},
		environment: 'jsdom',
	},
});

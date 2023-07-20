import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'html-walker',
			fileName: (format) => `html-walker.${format}.js`,
		},
	},
	plugins: [
		dts(),
	],
});

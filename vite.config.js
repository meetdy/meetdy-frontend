import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
// import runtimeEnv from 'vite-plugin-runtime-env';
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        // runtimeEnv({
        //   variableName: 'window.env',
        //   substitutionSyntax: 'dollar-curly',
        // }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        host: true,
        port: 9000,
    },
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: true,
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
});

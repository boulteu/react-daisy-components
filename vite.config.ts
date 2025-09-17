import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgLoader from 'vite-svg-loader'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    svgLoader(),
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.tsx'],
      rollupTypes: true
    })
  ] as any,
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ReactDaisyComponents',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: { 
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})

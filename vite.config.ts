import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  return {
    base: command === 'serve' ? '/' : '/croatian/',
  };
});

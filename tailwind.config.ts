import { Config } from 'tailwindcss';
import twTypography from '@tailwindcss/typography';

export default <Partial<Config>>{
  mode: 'jit',
  content: [
    './src/**/*.{html,ts,js,jsx,tsx}',
    // './src/app/pages/**/*.{vue,js,ts,jsx,tsx}',
    // '../plugins/**/*.{js,ts}',
    // '../layouts/**/*.{vue,js,ts,jsx,tsx}',
    // '../composables/**/*.{js,ts}',
    // '../utils/**/*.{js,ts}',
    // '../app.{vue,js,ts,jsx,tsx}',
    // '../App.{vue,js,ts,jsx,tsx}',
    // '../error.{vue,js,ts,jsx,tsx}',
    // '../Error.{vue,js,ts,jsx,tsx}',
    // '../static/**/*.html',
    // '../content/**/*.md',
    // '../docs/**/*.html',
    // '../app/**/*.html',
    // '../nuxt.config.{js,ts}',
    // '../app.config.{js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [twTypography],
};

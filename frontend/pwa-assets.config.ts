import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Generates PWA icons (64, 192, 512, maskable 512, apple-touch 180) from the SVG logo.
// Run `pnpm icons` after changing public/logo.svg and commit the output.
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#0F5C57' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#0F5C57' } },
  },
  images: ['public/logo.svg'],
});

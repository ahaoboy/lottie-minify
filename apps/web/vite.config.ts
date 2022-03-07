import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { lottieMinify } from "lottie-minify-plugin/vite";

console.log("lottieMinify", lottieMinify);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    lottieMinify({
      inline: true,
    }),
  ],
});

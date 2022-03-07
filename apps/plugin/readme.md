## vite
```ts
import { defineConfig } from "vite";
import { lottieMinify } from "lottie-minify-plugin/vite";
export default defineConfig({
  plugins: [
    lottieMinify({
      inline: true,
    }),
  ],
});
```

```ts
import { lottie } from "../lottie/v1/lottie.json?lottie";
```
## config
```ts
export type Option = {
  stringify: (data: LottieJSON) => string;
  numberFixLength: number;
  dropKeyList: string[];
  exportDefault: boolean;
  exportName: string;
  inline: boolean;
};
```
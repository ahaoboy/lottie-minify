import { createUnplugin } from "unplugin";
import { readFileSync } from "fs";
import { lottieMinify } from "lottie-minify";
import type { ILottieJSON } from "lottie-minify";

type Option = {
  stringify: (data: ILottieJSON) => string;
  numberFixLength: number;
  dropKeyList: string[];
};

const getCode = (url: string, option: Option): string => {
  const path = url.split("?")[0];
  const text = readFileSync(path, "utf-8");
  const json = lottieMinify(JSON.parse(text), {
    copy: false,
    numberFixLength: option.numberFixLength,
  });
  const assets = json.assets;
  const assetsMap: Record<string, string> = {};

  for (const item of assets) {
    const { id, p = "", u = "" } = item;
    if (p.startsWith("data:image")) continue;
    if (u || p) {
      const imgPath = "./" + [u, p].join("/");
      assetsMap[id] = imgPath;
    }
  }
  const importBlock = assets
    .filter((i) => assetsMap[i.id])
    .map((i) => `import _${i.id} from "${assetsMap[i.id]}"`)
    .join("\n");

  const pathBlock = assets
    .filter((i) => assetsMap[i.id])
    .map(
      (i, k) => `data.assets[${k}] = {...data.assets[${k}], u:'', p: _${i.id} }`
    )
    .join("\n");

  const dataStr = `${JSON.stringify(json)}`;
  const code = `
    ${importBlock}
    const data = ${dataStr};
    ${pathBlock}
    export default data;
  `;
  return code;
};
const defaultOption: Option = {
  stringify: JSON.stringify,
  numberFixLength: 3,
  dropKeyList: ["nm", "tyName", "n", "mn", "cl", "ln"],
};
const NAME = "lottie-minify-plugin";
export const unplugin = createUnplugin((option: Partial<Option> = {}) => {
  const opt = { ...defaultOption, ...option };
  return {
    name: NAME,
    // just like rollup transform
    transform(code, id) {
      if (!id.includes(".json?lottie")) {
        return code;
      }
      return getCode(id, opt);
    },
  };
});

export const vitePlugin = unplugin.vite;
export const rollupPlugin = unplugin.rollup;
export const webpackPlugin = unplugin.webpack;
export const esbuildPlugin = unplugin.esbuild;

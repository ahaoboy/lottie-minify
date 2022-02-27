var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/index.ts
import { createUnplugin } from "unplugin";
import { readFileSync, writeFileSync } from "fs";
import { join, sep } from "path";
import { lottieMinify } from "lottie-minify";
var getCode = (url, option) => {
  const path = url.split("?")[0];
  const text = readFileSync(path, "utf-8");
  const json = lottieMinify(JSON.parse(text), {
    copy: false,
    numberFixLength: option.numberFixLength
  });
  const assets = json.assets;
  const assetsMap = {};
  for (const item of assets) {
    const { id, p = "", u = "" } = item;
    if (p.startsWith("data:image"))
      continue;
    if (u || p) {
      const imgPath = "." + sep + join(u, p);
      assetsMap[id] = imgPath;
    }
  }
  const importBlock = assets.filter((i) => assetsMap[i.id]).map((i) => `import _${i.id} from "${assetsMap[i.id]}"`).join("\n");
  const pathBlock = assets.filter((i) => assetsMap[i.id]).map((i, k) => `data.assets[${k}] = {...data.assets[${k}], u:'', p: _${i.id} }`).join("\n");
  const dataStr = `${JSON.stringify(json)}`;
  const code = `
    ${importBlock}
    const data = ${dataStr};
    ${pathBlock}
    export default data;
  `;
  writeFileSync("c.txt", code);
  return code;
};
var defaultOption = {
  stringify: JSON.stringify,
  numberFixLength: 3,
  dropKeyList: ["nm", "tyName", "n", "mn", "cl", "ln"]
};
var NAME = "lottie-minify-plugin";
var unplugin = createUnplugin((option = {}) => {
  const opt = __spreadValues(__spreadValues({}, defaultOption), option);
  return {
    name: NAME,
    transform(code, id) {
      if (!id.includes(".json?lottie")) {
        return code;
      }
      writeFileSync("code.txt", code);
      return getCode(id, opt);
    }
  };
});
var vitePlugin = unplugin.vite;
var rollupPlugin = unplugin.rollup;
var webpackPlugin = unplugin.webpack;
var esbuildPlugin = unplugin.esbuild;
export {
  rollupPlugin as lottieMinify
};
//# sourceMappingURL=rollup.mjs.map
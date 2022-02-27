var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// src/vite.ts
var vite_exports = {};
__export(vite_exports, {
  lottieMinify: () => vitePlugin
});

// src/index.ts
var import_unplugin = require("unplugin");
var import_fs = require("fs");
var import_path = require("path");
var import_lottie_minify = require("lottie-minify");
var getCode = (url, option) => {
  const path = url.split("?")[0];
  const text = (0, import_fs.readFileSync)(path, "utf-8");
  const json = (0, import_lottie_minify.lottieMinify)(JSON.parse(text), {
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
      const imgPath = "." + import_path.sep + (0, import_path.join)(u, p);
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
  (0, import_fs.writeFileSync)("c.txt", code);
  return code;
};
var defaultOption = {
  stringify: JSON.stringify,
  numberFixLength: 3,
  dropKeyList: ["nm", "tyName", "n", "mn", "cl", "ln"]
};
var NAME = "lottie-minify-plugin";
var unplugin = (0, import_unplugin.createUnplugin)((option = {}) => {
  const opt = __spreadValues(__spreadValues({}, defaultOption), option);
  return {
    name: NAME,
    transform(code, id) {
      if (!id.includes(".json?lottie")) {
        return code;
      }
      (0, import_fs.writeFileSync)("code.txt", code);
      return getCode(id, opt);
    }
  };
});
var vitePlugin = unplugin.vite;
var rollupPlugin = unplugin.rollup;
var webpackPlugin = unplugin.webpack;
var esbuildPlugin = unplugin.esbuild;
module.exports = __toCommonJS(vite_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  lottieMinify
});
//# sourceMappingURL=vite.js.map
import { createUnplugin } from "unplugin";
import { readFileSync } from "fs";
import { lottieMinify } from "lottie-minify";
import type { LottieJSON } from "lottie-type";
import { resolve, dirname } from "path";
export type Option = {
  stringify: (data: LottieJSON) => string;
  numberFixLength: number;
  dropKeyList: string[];
  exportDefault: boolean;
  exportName: string;
  inline: boolean;
  filter: (id: string) => boolean;
};

const getCode = (url: string, option: Option): string => {
  const path = url.split("?")[0];
  const text = readFileSync(path, "utf-8");
  const { numberFixLength, exportName, exportDefault, inline } = option;
  const json = lottieMinify(JSON.parse(text), {
    copy: false,
    numberFixLength,
  });

  const jsonName = exportName ?? "lottie";
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
    .map((i) => {
      const id = `_${i.id}`;
      if (inline) {
        const imgPath = resolve(dirname(path), assetsMap[i.id]);
        const base64 =
          "data:image/png;base64," + readFileSync(imgPath, "base64");
        return `const ${id} = "${base64}"`;
      }
      return `import ${id} from "${assetsMap[i.id]}"`;
    })
    .join("\n");

  const replacePathBlock = assets
    .filter((i) => assetsMap[i.id])
    .map(
      (i, k) =>
        `${jsonName}.assets[${k}] = {...${jsonName}.assets[${k}], u:'', p: _${i.id} }`
    )
    .join("\n");

  const dataStr = `${JSON.stringify(json)}`;
  const exportList: string[] = [];
  if (exportDefault) {
    exportList.push(`export default ${jsonName};`);
  }
  if (exportName) {
    exportList.push(`export { ${jsonName} };`);
  }
  const code = `
    ${importBlock}
    const ${jsonName} = ${dataStr};
    ${replacePathBlock}
    ${exportList.join("\n")}
  `;
  return code;
};
const defaultFilter = (id: string): boolean => {
  return id.includes(".json?lottie");
};
const defaultOption: Option = {
  stringify: JSON.stringify,
  numberFixLength: 3,
  dropKeyList: ["nm", "tyName", "n", "mn", "cl", "ln"],
  exportDefault: true,
  exportName: "lottie",
  inline: false,
  filter: defaultFilter,
};
const NAME = "lottie-minify-plugin";
export const unplugin = createUnplugin((option: Partial<Option> = {}) => {
  const opt = { ...defaultOption, ...option };
  return {
    name: NAME,
    transform(code, id) {
      const filter = option.filter ?? defaultFilter;
      if (filter(id)) {
        return getCode(id, opt);
      }
      return code;
    },
  };
});

export const vitePlugin = unplugin.vite;
export const rollupPlugin = unplugin.rollup;
export const webpackPlugin = unplugin.webpack;
export const esbuildPlugin = unplugin.esbuild;

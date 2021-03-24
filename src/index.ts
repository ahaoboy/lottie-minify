import { clone, merge } from './common';
import { Config, ILottieJSON } from './type';
import { defaultConfig } from './common';

export const miniLottie = (data: ILottieJSON, config: Config = {}) => {
  config = merge(defaultConfig, config);
  const { copy, dropKeyList } = config;
  if (copy) {
    data = clone(data);
  }
  dropKey(data, dropKeyList);
  fixAttrIndIsUndefined(data);
  return data;
};

export const dropKey = (data: any, dropKeyList: string[] = []) => {
  if (Array.isArray(data)) {
    data.forEach(item => dropKey(item, dropKeyList));
  } else if (typeof data === 'object') {
    for (const k of dropKeyList) {
      if (k in data && data[k]) {
        delete data[k];
      }
    }
    for (let k in data) {
      dropKey(data[k], dropKeyList);
    }
  }
};

// from https://github1s.com/fancy-lottie/lottie-compress/blob/HEAD/src/main.ts
const fixAttrIndIsUndefined = (data: any) => {
  data.layers.forEach((layer: any, index: number) => {
    if (layer.ind === undefined) {
      layer.ind = index + 1;
    }
  });
  data.assets.forEach((asset: any) => {
    if (asset.layers) {
      asset.layers.forEach((layer: any, index: number) => {
        if (layer.ind === undefined) {
          layer.ind = index + 1;
        }
      });
    }
  });
  return data;
};

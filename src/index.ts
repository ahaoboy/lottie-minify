import { clone, merge, defaultConfig, isNil, fixed, isNumber } from './common';
import { Config, ILottieJSON } from './type';
export * from './type';

export const minify = (data: ILottieJSON | string, config: Config = {}) => {
  if (
    isNil(data) ||
    (typeof data !== 'string' && typeof data !== 'object') ||
    Array.isArray(data)
  )
    throw new Error('lottie data must be String or Object');

  config = merge(defaultConfig, config);
  const { copy } = config;
  if (copy) {
    data = clone(data);
  }

  walk(data, config);
  fixAttrIndIsUndefined(data);
  return data;
};

const walk = (_data: any, config: Config) => {
  const { dropKeyList = [], numberFixLength = 3 } = config;
  const numberFixFun = fixed(numberFixLength);
  const refIdList: string[] = [];
  const getRefId = (id: string) => {
    let i = refIdList.indexOf(id);
    if (i === -1) {
      refIdList.push(id);
      i = refIdList.length - 1;
    }
    return i;
  };
  const dfs = (data: any) => {
    if (isNil(data)) throw new Error('lottie value is null or undefined');
    if (typeof data === 'string' || typeof data === 'number') return;
    if (Array.isArray(data)) {
      data.forEach((item, k) => {
        if (isNumber(item)) {
          data[k] = numberFixFun(item);
        } else {
          dfs(item);
        }
      });
    } else if (typeof data === 'object') {
      for (const k of dropKeyList) {
        if (k in data && data[k]) {
          delete data[k];
        }
      }
      for (let k in data) {
        if (isNumber(data[k])) {
          data[k] = numberFixFun(data[k]);
        } else if (k === 'refId') {
          data['refId'] = getRefId(data[k]);
        } else if (k === 'id') {
          data['id'] = getRefId(data[k]);
        } else {
          dfs(data[k]);
        }
      }
    }
  };
  dfs(_data);
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

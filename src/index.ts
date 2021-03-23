import { clone, merge } from './common';
import { Config } from './type';
import { LottieData } from './type';
import { defaultConfig } from './common';

export const miniLottie = (data: LottieData, config: Config = {}) => {
  config = merge(defaultConfig, config);
  const { copy, dropKeyList } = config;
  if (copy) {
    data = clone(data);
  }
  dropKey(data, dropKeyList);

  return data;
};

export const dropKey = (data: any, dropKeyList: string[] = []) => {
  for (const k of dropKeyList) {
    if (k in data && data.k) delete data[k];
  }
  if (Array.isArray(data)) {
    data.forEach(item => dropKey(item, dropKeyList));
  }
  if (typeof data === 'object') {
    data.assets && dropKey(data.assets, dropKeyList);
    data.layers && dropKey(data.layers, dropKeyList);
  }
};

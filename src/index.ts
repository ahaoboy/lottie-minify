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
  console.log('dropKeyList', dropKeyList, data);
  dropKey(data, dropKeyList);

  return data;
};

export const dropKey = (data: any, dropKeyList: string[] = []) => {
  if (Array.isArray(data)) {
    data.forEach(item => dropKey(item, dropKeyList));
  } else if (typeof data === 'object') {
    for (const k of dropKeyList) {
      if (k in data && data[k]) {
        console.log('k', k);
        delete data[k];
      }
    }
    data.assets && dropKey(data.assets, dropKeyList);
    data.layers && dropKey(data.layers, dropKeyList);
  }
};

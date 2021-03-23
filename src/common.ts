import { Config } from './type';
import { LottieData } from 'type';

export const clone = (data: LottieData): LottieData => {
  if (typeof data !== 'object') throw new Error('lottie data type error!');
  return JSON.parse(JSON.stringify(data));
};

export const merge = <T>(left: T, right: T) => {
  return { ...left, ...right };
};
export const defaultDropKeyList = ['nm', 'tyName', 'n', 'mn'];

export const defaultConfig: Config = {
  copy: false,
  dropKeyList: defaultDropKeyList,
};

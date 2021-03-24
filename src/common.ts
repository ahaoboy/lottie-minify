import { Config } from './type';

export const clone = <T>(data: T): T => {
  if (typeof data !== 'object') throw new Error('lottie data type error!');
  return JSON.parse(JSON.stringify(data));
};

export const merge = <T>(left: T, right: T) => {
  return { ...left, ...right };
};
export const defaultDropKeyList = ['nm', 'tyName', 'n', 'mn', 'cl', 'ln'];

export const defaultConfig: Config = {
  copy: false,
  dropKeyList: defaultDropKeyList,
};

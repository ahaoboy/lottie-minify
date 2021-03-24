export type LottieValue = string | number | Array<string | number>;
export interface LottieData {
  [k: string]: LottieValue | LottieData;
  [k: number]: LottieValue | LottieData;
}

export type Config = {
  copy?: boolean;
  dropKeyList?: string[];
};

// lottie layer
interface ILottieJSONLayer {
  id: string | number;
  [k: string]: LottieValue | LottieData;
  [k: number]: LottieValue | LottieData;
}

// lottie asset
interface ILottieJSONAsset {
  id: string | number;
  u?: string;
  p?: string;
  e?: number;
  w?: number;
  h?: number;
  layers?: ILottieJSONLayer[];
}

export interface ILottieJSON {
  // 帧率
  fr: number;
  // 起始关键帧
  ip: number;
  // 结束关键帧
  op: number;
  // 资源信息
  assets: ILottieJSONAsset[];
  // 图层信息
  layers: ILottieJSONLayer[];
  markers: LottieData[];
}

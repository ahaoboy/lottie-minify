export type LottieValue = string | number | Array<string | number>;
export interface LottieData {
  [k: string]: LottieValue | LottieData;
  [k: number]: LottieValue | LottieData;
}

// lottie layer
interface LottieJSONLayer {
  id: string | number;
  [k: string]: LottieValue | LottieData;
  [k: number]: LottieValue | LottieData;
}

// lottie asset
interface LottieJSONAsset {
  id: string | number;
  u?: string;
  p?: string;
  e?: number;
  w?: number;
  h?: number;
  layers?: LottieJSONLayer[];
}

export interface LottieJSON {
  // 帧率
  fr: number;
  // 起始关键帧
  ip: number;
  // 结束关键帧
  op: number;
  // 资源信息
  assets: LottieJSONAsset[];
  // 图层信息
  layers: LottieJSONLayer[];
  markers: LottieData[];
}

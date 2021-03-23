export type LottieValue = string | number | Array<string | number>;
export interface LottieData {
  [k: string]: LottieValue | LottieData;
  [k: number]: LottieValue | LottieData;
}

export type Config = {
  copy?: boolean;
  dropKeyList?: string[];
};

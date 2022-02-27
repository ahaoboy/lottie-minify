import { ILottieJSON } from 'lottie-minify';

declare type Option = {
    stringify: (data: ILottieJSON) => string;
    numberFixLength: number;
    dropKeyList: string[];
};
declare const webpackPlugin: (options?: Partial<Option> | undefined) => WebpackPluginInstance;

export { webpackPlugin as lottieMinify };

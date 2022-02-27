import * as _unplugin from 'unplugin';
import { ILottieJSON } from 'lottie-minify';

declare type Option = {
    stringify: (data: ILottieJSON) => string;
    numberFixLength: number;
    dropKeyList: string[];
};
declare const rollupPlugin: (options?: Partial<Option> | undefined) => _unplugin.RollupPlugin;

export { rollupPlugin as lottieMinify };

import * as _unplugin from 'unplugin';
import { ILottieJSON } from 'lottie-minify';

declare type Option = {
    stringify: (data: ILottieJSON) => string;
    numberFixLength: number;
    dropKeyList: string[];
};
declare const unplugin: _unplugin.UnpluginInstance<Partial<Option>>;
declare const vitePlugin: (options?: Partial<Option> | undefined) => _unplugin.VitePlugin;
declare const rollupPlugin: (options?: Partial<Option> | undefined) => _unplugin.RollupPlugin;
declare const webpackPlugin: (options?: Partial<Option> | undefined) => WebpackPluginInstance;
declare const esbuildPlugin: (options?: Partial<Option> | undefined) => _unplugin.EsbuildPlugin;

export { esbuildPlugin, rollupPlugin, unplugin, vitePlugin, webpackPlugin };

import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { miniLottie } from '../src/index';
describe('mini', () => {
  it('compress', () => {
    const fileList = ['lottie'];
    for (const name of fileList) {
      const inPath = resolve('./test', 'in', `${name}.json`);
      const outPath = resolve('./test', 'out', `${name}.json`);
      const oldStr = readFileSync(inPath, { encoding: 'utf8' });
      const oldData = JSON.parse(oldStr);
      const newData = miniLottie(oldData, { copy: true });
      const newStr = JSON.stringify(newData);
      writeFileSync(outPath, newStr, { encoding: 'utf8' });
      console.log(`${name}: old: ${oldStr.length}, mini:${newStr.length}`);
    }
  });
});

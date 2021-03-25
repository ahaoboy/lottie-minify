import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { minify } from '../src/index';
describe('mini', () => {
  it('compress', () => {
    const fileList = ['lottie'];
    for (const name of fileList) {
      const inPath = resolve('./test', 'in', `${name}.json`);
      const outPath = resolve('./test', 'out', `${name}.json`);
      const oldStr = readFileSync(inPath, { encoding: 'utf8' });
      const oldData = JSON.parse(oldStr);
      const newData = minify(oldData, { copy: true });
      const newStr = JSON.stringify(newData);
      writeFileSync(outPath, newStr, { encoding: 'utf8' });

      const oldSize = oldStr.length;
      const newSize = newStr.length;
      const rate = (((newSize / oldSize) * 10000) | 0) / 100;
      // lottie: old: 246900, mini:66822, del:180078, rate:27.06%
      console.log(
        `${name}: old: ${oldSize}, mini:${newSize}, del:${oldSize -
          newSize}, rate:${rate}%`
      );
    }
  });


  it('fixed', () => {
    const fileList = ['lottie'];
    for (const name of fileList) {
      const inPath = resolve('./test', 'in', `${name}.json`);
      const outPath = resolve('./test', 'out', `${name}.json`);
      const oldStr = readFileSync(inPath, { encoding: 'utf8' });
      const oldData = JSON.parse(oldStr);
      const newData = minify(oldData, { copy: true });
      const newStr = JSON.stringify(newData);
      writeFileSync(outPath, newStr, { encoding: 'utf8' });

      const oldSize = oldStr.length;
      const newSize = newStr.length;
      const rate = (((newSize / oldSize) * 10000) | 0) / 100;
      // lottie: old: 246900, mini:66822, del:180078, rate:27.06%
      console.log(
        `${name}: old: ${oldSize}, mini:${newSize}, del:${oldSize -
          newSize}, rate:${rate}%`
      );
    }
  });
});

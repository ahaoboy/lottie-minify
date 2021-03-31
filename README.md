## install

```
npm i lottie-minify
```

## use

```
import { minify } from 'lottie-minify';

const miniData = minify(jsonData, {copy: false});
miniData === jsonData // true

minify(string)


```

## config

| key             | type     | default                                 | desc             |
| --------------- | -------- | --------------------------------------- | ---------------- |
| copy            | boolean  | false                                   | copy source data |
| dropList        | string[] | ['nm', 'tyName', 'n', 'mn', 'cl', 'ln'] | dropKeyList      |
| numberFixLength | number   | 3                                       | number precision |

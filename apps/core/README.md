## install

```
npm i lottie-minify
```

## use

```
import { lottieMinify } from 'lottie-minify';

const miniData = lottieMinify(jsonData, {copy: false});
miniData === jsonData // true

lottieMinify(string)

```

## config

| key             | type     | default                                 | desc             |
| --------------- | -------- | --------------------------------------- | ---------------- |
| copy            | boolean  | false                                   | copy source data |
| dropList        | string[] | ['nm', 'tyName', 'n', 'mn', 'cl', 'ln'] | dropKeyList      |
| numberFixLength | number   | 3                                       | number precision |

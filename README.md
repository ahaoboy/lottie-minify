## install

```
npm i lottie-minify
```

## use

```
import { minify } from 'lottie-minify';
const miniData = minify(data, config);
```

## config

| key      | type     | default                                 | desc             |
| -------- | -------- | --------------------------------------- | ---------------- |
| copy     | boolean  | false                                   | copy source data |
| dropList | string[] | ['nm', 'tyName', 'n', 'mn', 'cl', 'ln'] | dropKeyList      |

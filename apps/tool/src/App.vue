<template>
  <div class="main-wrap">
    <div class="header-wrap">
      <div class="header-left-wrap">
        <div class="info-wrap">
          <div class="info-download">
            资源下载站点:
            <a
              class="site-link"
              target="_blank"
              href="https://design.alipay.com/lolita"
              >lolita</a
            >
            <a class="site-link" target="_blank" href="https://lottiefiles.com/"
              >lottiefiles</a
            >
            <a
              class="site-link"
              target="_blank"
              href="https://design.alipay.com/emotion"
              >emotion</a
            >
          </div>
        </div>
        <div class="type-wrap">
          渲染格式:
          <el-radio-group v-model="state.renderType">
            <el-radio :label="'svg'">svg</el-radio>
            <el-radio :label="'canvas'">canvas</el-radio>
          </el-radio-group>
        </div>
        <div class="button-wrap">
          <el-button @click="upload">上传</el-button>
          <el-button :icon="CaretLeft"></el-button>
          <el-button @click="playLottie(0)" :icon="Refresh"></el-button>
          <el-button
            @click="clickStart"
            v-if="!state.lottiePlaying"
            :icon="VideoPlay"
          ></el-button>
          <el-button
            @click="pauseLottie"
            v-if="state.lottiePlaying"
            :icon="VideoPause"
          ></el-button>
          <el-button :icon="CaretRight"></el-button>
          <el-button @click="downloadSingle">下载</el-button>
        </div>
      </div>
      <div class="header-right-wrap" v-if="false">
        <div class="option-wrap">
          <el-checkbox v-model="miniConfig.copy">体积优化</el-checkbox>
        </div>
        <div class="option-wrap">
          <el-checkbox v-model="miniConfig.copy">图片重命名</el-checkbox>
        </div>
        <div class="option-wrap">
          <el-checkbox v-model="state.numberFixLength">精度</el-checkbox>
          <el-input-number v-model="state.numberFixLength" :min="1" :max="10" />
        </div>
      </div>
    </div>

    <el-slider
      v-model="state.lottieProgress"
      :min="minFrame"
      :max="maxFrame"
      show-input
      style="width: 70%; margin: 20px;"
    ></el-slider>
    <div id="lottie"></div>
  </div>
</template>

<script setup lang="ts">
import {
  CaretLeft,
  CaretRight,
  Refresh,
  VideoPause,
  VideoPlay,
} from "@element-plus/icons-vue";
import JSZip from "jszip";
import path from "path-browserify";
import LottieWeb from "lottie-web";
import type { AnimationItem } from "lottie-web";
import { computed, reactive, toRaw, watch } from "vue";
import { throttle, cloneDeep, isNil } from "lodash-es";
import { readFile, stringToUrl, downloadUrl, getBase64 } from "./util";
import { ILottieJSON, lottieMinify } from "lottie-minify";

const miniConfig = reactive({
  copy: true,
});
type State = {
  lottieProgress: number;
  lottiePlaying: boolean;
  lottieJson: ILottieJSON;
  ins: AnimationItem;
  renderType: "svg" | "canvas";
  numberFixLength: number;
};
const state: State = reactive({
  lottieProgress: 0,
  lottiePlaying: false,
  lottieJson: {} as ILottieJSON,
  ins: {} as AnimationItem,
  renderType: "svg",
  numberFixLength: 3,
});
watch(
  () => state.renderType,
  () => {
    initLottie();
    playLottie(1, true);
  }
);
const maxFrame = computed(() => state.ins?.totalFrames || 1);
const minFrame = computed(() => state.ins?.firstFrame || 0);
const frameRange = computed(() => maxFrame.value - minFrame.value + 1 || 1);

const clickStart = () => {
  playLottie(state.lottieProgress / frameRange.value);
};
const initLottie = () => {
  state.ins?.destroy?.();
  const data = lottieMinify(cloneDeep(toRaw(state.lottieJson)), miniConfig);
  const dom = document.getElementById("lottie")!;
  dom.innerHTML = "";
  const config = {
    container: dom, // the dom element that will contain the animation
    renderer: state.renderType, // the dom element that will contain the animation
    loop: false,
    autoplay: false,
    animationData: data,
  } as const;
  const ins = LottieWeb.loadAnimation(config as any);
  state.ins = ins;
};

const watchFun = throttle((value) => {
  if (state.lottiePlaying) return;
  playLottie(value / frameRange.value, true);
}, 100);
watch(() => state.lottieProgress, watchFun);
const playLottie = (p = 0, stop = false) => {
  if (!state.ins) return;
  console.log(
    "playLottie",
    p,
    stop,
    maxFrame.value,
    minFrame.value,
    frameRange.value,
    state
  );
  const isFrame = true;
  const f = Math.round(p * frameRange.value + minFrame.value - 1);
  if (stop) {
    state.ins.goToAndStop(f, isFrame);
    state.lottieProgress = Math.round(p * frameRange.value);
    state.lottiePlaying = false;
    return;
  }
  state.lottiePlaying = true;
  state.ins.goToAndPlay(f, isFrame);
  state.ins.addEventListener("complete", () => {
    state.lottiePlaying = false;
  });
  state.ins.addEventListener("enterFrame", (e) => {
    state.lottieProgress = Math.round(
      (e.currentTime / e.totalTime) * frameRange.value
    );
  });
};
const pauseLottie = () => {
  state.ins?.pause();
  state.lottiePlaying = false;
};
const uploadFile = (options: Record<string, string>): Promise<File[]> => {
  const input = document.createElement("input");
  for (const k in options) {
    input.setAttribute(k, options[k]);
  }
  return new Promise((r) => {
    input.addEventListener("change", async () => {
      const files = Array.from(input.files || []);
      r(files);
    });
    input.click();
  });
};

const upload = async () => {
  console.log("upload");
  const file = (
    await uploadFile({
      type: "file",
    })
  )[0];
  console.log("file", file);
  let lottieJson;
  let lottieJsonRoot = "";
  let zip;
  if (file.name.endsWith(".json")) {
    const s = await readFile(file);
    state.lottieJson = JSON.parse(s);
    lottieJson = JSON.parse(s);
  } else {
    const new_zip = new JSZip();
    // more files !
    zip = await new_zip.loadAsync(file);
    for (const k in zip.files) {
      if (k.startsWith(".") || k.includes("__MACOSX")) continue;
      const f = zip.files[k];
      console.log("fff", f);
      if (f.dir) {
        //  文件夹
      } else {
        // 文件
        if (k.endsWith(".json")) {
          const s = await f.async("string");
          lottieJson = JSON.parse(s);
          lottieJsonRoot = path.dirname(k);
        }
      }
    }
  }
  for (const item of lottieJson.assets) {
    console.log("===item", item);
    const p = item.p || "";
    const u = item.u || "";
    if (Boolean(u) || Boolean(p)) {
      const _p = u + p;
      console.log("===p", _p, p, u);
      if (_p.startsWith?.("http") || _p.startsWith?.("//")) {
        const url = "data:image/jpeg;base64," + (await getBase64(_p));
        item.p = url;
      } else if (zip) {
        const newPath = path.join(lottieJsonRoot, item.u ?? "", item.p ?? "");
      console.log("===newPath", newPath);
        if (!zip.files[newPath]) continue;
        item.u = "";

        const url =
          "data:image/jpeg;base64," +
          (await zip.files[newPath].async("base64"));
        item.p = url;
      }
    }
    state.lottieJson = lottieJson;
    initLottie();
    playLottie(1, true);
  }
};

const downloadZip = () => {
  const s = JSON.stringify(lottieMinify(toRaw(state.lottieJson), miniConfig));
  const url = stringToUrl(s);
  downloadUrl(url, "miniData.json");
};
const downloadSingle = () => {
  const s = JSON.stringify(lottieMinify(toRaw(state.lottieJson), miniConfig));
  const url = stringToUrl(s);
  downloadUrl(url, "miniData.json");
};
</script>

<style lang="less">
body,
html {
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
}
.main-wrap {
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  align-items: center;

  .header-wrap {
    display: flex;
    align-items: center;
    width: 60%;
    justify-content: space-around;
    .header-left-wrap {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      .type-wrap {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 300px;
      }
      .info-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin: 20px;
        .info-download {
          display: flex;
          justify-content: space-around;
          width: 400px;
        }
      }
      .button-wrap {
        display: flex;
        margin: 20px;
      }
      #lottie {
        width: 80%;
        height: 80%;
        display: flex;
        justify-self: center;
      }
    }
    .header-right-wrap {
      flex-direction: column;
      justify-self: center;
      align-items: center;
      display: flex;

      .option-wrap {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
</style>

import { encode } from "base64-arraybuffer";
export const stringToUrl = (s: string, type = "text/plain") => {
  const blob = new Blob([s], { type });
  return URL.createObjectURL(blob);
};
export const downloadUrl = (url: string, name: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
};

export const bitToString = (size: number) => {
  if (size < 1024) return size + "B";
  if (size < 1024 * 1024)
    return (size / 1024).toFixed(2).replace(/0+$/, "") + "KB";
  if (size < 1024 * 1024 * 1024)
    return (size / 1024 / 1024).toFixed(2).replace(/0+$/, "") + "MB";
  return "0B";
};
export const uploadFileInput = (options: Record<string, string> = {}) => {
  const input = document.createElement("input");
  input.type = "file";
  for (const k in options) {
    input.setAttribute(k, options[k]);
  }
  return new Promise<File[]>((r) => {
    input.addEventListener("change", async () => {
      const files: File[] = Array.from(input.files || []);
      r(files);
    });
    input.click();
  });
};
export const fileToBuffer = (file: Blob) => {
  return new Promise<Uint8Array | null>((r) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content: any = reader.result;
      if (!content) {
        r(null);
        return;
      }
      r(new Uint8Array(content || []));
    };
    reader.readAsArrayBuffer(file);
  });
};

export const readFile = (file: File): Promise<string> => {
  return new Promise((r) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content: any = reader.result;
      r(content || "");
    };
    reader.readAsText(file);
  });
};

export const imgToImageData = (img: HTMLImageElement | HTMLCanvasElement) => {
  if (img.nodeName === "CANVAS") {
    return (img as HTMLCanvasElement)
      .getContext("2d")!
      .getImageData(0, 0, img.width, img.height);
  }
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
};

export const cloneImageData = (data: ImageData) => {
  return new ImageData(
    new Uint8ClampedArray(data.data),
    data.width,
    data.height
  );
};
export const getBase64 = async (url: string): Promise<string> => {
  const resp = await fetch(url);
  const buf = await resp.arrayBuffer();
  return encode(buf);
};

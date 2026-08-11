import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSolidColor() {
  // Hue: 0 to 360 degrees (Full color spectrum)
  const hue = Math.floor(Math.random() * 360);

  // Saturation: 75% to 95% (Keeps the color vivid and intense)
  const saturation = Math.floor(Math.random() * 21) + 75;

  // Lightness: 35% to 45% (Slightly lighter, readable, but still deep)
  const lightness = Math.floor(Math.random() * 11) + 35;

  return {
    h: hue,
    s: saturation,
    l: lightness,
  };
}

export function randomColorGenerator() {
  let { h, l, s } = getSolidColor();

  l /= 100;

  const a = (s * Math.min(l, 1 - l)) / 100;

  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}

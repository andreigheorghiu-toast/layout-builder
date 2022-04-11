import { camelCase, startCase } from "lodash-es";

import { MEvent, PageSizeInterval, ScreenSize } from "@/types";

export const titleCase = (s: string) => startCase(camelCase(s));

interface GenericItem {
  id: string;
  title?: string;
}

export const getItemTitle = (m: GenericItem) =>
  "title" in m ? m.title : titleCase(m.id);

export const screenSizes: ScreenSize[] = [
  {
    id: "xs",
    from: 0,
    to: 540,
  },
  {
    id: "sm",
    from: 540,
    to: 768,
  },
  {
    id: "md",
    from: 768,
    to: 992,
  },
  {
    id: "lg",
    from: 992,
    to: 1200,
  },
  {
    id: "xl",
    from: 1200,
    to: 1540,
  },
  {
    id: "xxl",
    from: 1540,
    to: 1920,
  },
];

export const pageSizes: PageSizeInterval[] = [
  {
    label: "wide",
    size: "L",
  },
  {
    label: "medium",
    size: "M",
  },
  {
    label: "narrow",
    size: "S",
  },
];

export const minMax = (val: number, [min, max]: number[]) =>
  Math.max(min, Math.min(isFinite(val) ? val : 0, max));

export function patchScrollBlockingListeners(): void {
  let supportsPassive = false;
  const x = document.createElement("x");
  x.addEventListener("cut", () => 1, {
    get passive() {
      supportsPassive = true;
      return !!1;
    },
  });
  x.remove();
  if (supportsPassive) {
    const originalFn = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (...args) {
      if (
        ["scroll", "touchmove", "touchstart"].includes(args[0]) &&
        (typeof args[2] !== "object" || args[2].passive === undefined)
      ) {
        args[2] = {
          ...(typeof args[2] === "object" ? args[2] : {}),
          passive: typeof args[2] === "boolean" ? args[2] : true,
        };
      }
      originalFn.call(this, ...args);
    };
  }
}

export const prevent = (e: MEvent): MEvent => {
  e.preventDefault();
  return e;
};

export const stop = (e: MEvent): MEvent => {
  e.stopPropagation();
  return e;
};

export const preventStop = (e: MEvent) => prevent(stop(e));

export * from "./useJsonEditor";
export * from "./usePageSizeSwitch";

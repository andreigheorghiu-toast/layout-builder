import { makeAutoObservable, reaction } from "mobx";

import { modules } from "@/config";
import { ILayoutModule, PageSize, TrackSide, Widget } from "@/types";

export class Layout {
  location = "";
  modules = modules;
  activeModuleId = "";
  isLeftTrackOpen = true;
  darkMode = false;
  allWidgets = [] as Widget[];
  tracks: Record<TrackSide, string[]> = {
    left: [],
    right: [],
  };
  activeWidget = "";
  getsFocus = "";
  isDragging = false;
  pageSize: PageSize = "M";

  constructor() {
    makeAutoObservable(this);
    this.modules.forEach((module) => {
      (module.widgets || []).forEach((widget) => {
        const index = this.allWidgets.findIndex(({ id }) => id === widget.id);
        if (index === -1) {
          const newWidget = new Widget({
            ...widget,
            module,
          });
          this.addWidget(newWidget);
        }
      });
      const getsFocus = (module.widgets || []).find((w) => w.getsFocus)?.id;
      if (getsFocus) {
        this.getsFocus = getsFocus;
      }
    });
  }

  get activeModule() {
    return this.modules.find((m) => m.id === this.activeModuleId);
  }

  get isRightTrackOpen(): boolean {
    return (
      this.isLeftTrackOpen && (this.isDragging || !!this.tracks.right.length)
    );
  }

  get makePageClassName(): (id?: string) => string {
    return (id = "") =>
      [id, "page-container"]
        .concat(
          this.pageSize === "L"
            ? ["page-wide"]
            : this.pageSize === "S"
            ? ["page-narrow"]
            : []
        )
        .join(" ");
  }

  addWidget(widget: Widget, side: TrackSide = "left") {
    const index = this.allWidgets.findIndex((w) => w.id === widget.id);
    if (index === -1) {
      this.allWidgets.push(widget);
      this.tracks[side] = [...new Set([...this.tracks[side], widget.id])];
    } else {
      this.allWidgets.splice(index, 1, widget);
    }
  }

  updateWidget(widget: Widget) {
    this.addWidget(widget);
  }

  removeWidget(id: string) {
    this.allWidgets = this.allWidgets.filter((w) => w.id !== id);
    (["left", "right"] as TrackSide[]).forEach((side) => {
      this.tracks[side] = this.tracks[side].filter((x) => x !== id);
    });
  }
}

export const layout: Layout = new Layout();

const addModuleWidgets = (module: ILayoutModule, l: Layout = layout) => {
  (module.widgets || []).forEach((widget) => {
    const index = l.allWidgets.findIndex(({ id }) => id === widget.id);
    if (index === -1) {
      const newWidget = new Widget({
        ...widget,
        module,
      });
      l.addWidget(newWidget);
    }
    const getsFocus =
      !layout.activeWidget &&
      (module.widgets || []).find((w) => w.getsFocus)?.id;
    if (getsFocus) {
      l.getsFocus = getsFocus;
    }
  });
};

reaction(
  () => layout.activeModuleId,
  () => {
    if (layout.activeModule) {
      addModuleWidgets(layout.activeModule);
    }
  }
);

reaction(
  () => layout.getsFocus,
  (val) => {
    if (val && layout.allWidgets.map((w) => w.id).includes(val)) {
      layout.activeWidget = val;
    }
  },
  { fireImmediately: true }
);

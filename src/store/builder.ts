import { defaults, defaultsDeep, get, map, pick, times } from "lodash-es";
import { makeAutoObservable } from "mobx";
import { CSSProperties } from "react";
import { v4 } from "uuid";

import {
  ComponentPosition,
  Dashboard,
  GridSize,
  ScreenSizeType,
  Section,
  SectionComponent,
} from "@/types";
import { minMax, screenSizes } from "@/util";

const dragReset = {
  x: 1,
  y: 1,
  c: {
    x: 1,
    y: 1,
    w: 1,
    h: 1,
  },
};

export class Builder {
  dashboard: Dashboard = { sections: [] };
  containerWidth = 1920;
  containerHeight = 0;
  activeSectionId = "";
  draggedComponentId = "";
  indicatorStyle = {};
  isResizing = false;
  dragStart = dragReset;

  constructor() {
    makeAutoObservable(this);
  }

  get section(): Section | undefined {
    return this.activeSectionId
      ? (this.dashboard.sections || []).find(
          (s: Section) => s.id === this.activeSectionId
        )
      : undefined;
  }

  get sectionComponents(): SectionComponent[] {
    return this.section?.components || [];
  }
  get sectionComponentsIds(): string[] {
    return this.sectionComponents.map((c) => c.id);
  }

  get gridSize(): GridSize {
    return (
      this.section?.grid[this.gridSourceInterval] || {
        h: this.sectionComponents.length || 1,
        w: 1,
      }
    );
  }

  get availableScreenSizes(): ScreenSizeType[] {
    return [...screenSizes.filter((i) => i.from < this.containerWidth)]
      .map((s) => s.id)
      .reverse();
  }

  get currentScreenSize(): ScreenSizeType {
    return (
      screenSizes.find(
        (interval) =>
          interval.from < this.containerWidth &&
          interval.to >= this.containerWidth
      )?.id || "xs"
    );
  }

  get activeSectionInterval(): ScreenSizeType {
    const intervals = [
      ...screenSizes.filter((i) => i.from < builder.containerWidth),
    ].reverse();
    const grid = get(this.section, ["grid"]) || {};
    return intervals.find((i) => i.id in grid)?.id || "xs";
  }

  get gridSourceInterval(): ScreenSizeType {
    return this.section
      ? this.availableScreenSizes.find(
          (size: ScreenSizeType) =>
            this.sectionComponents.some(
              (c: SectionComponent) => c.grid[size]
            ) || this.section?.grid[size]
        ) || "xs"
      : "xs";
  }

  get cellMap(): { x: number; y: number }[] {
    return [
      ...times(builder.gridSize.h || 1, (y) => [
        ...times(builder.gridSize.w || 1, (x) => ({ x: x + 1, y: y + 1 })),
      ]),
    ].flat();
  }

  get componentStyle(): (id: string) => CSSProperties {
    return (id) => {
      const c = this.sectionComponents.find((c) => c.id === id);
      const interval = c?.grid[this.gridSourceInterval];
      return interval
        ? {
            gridColumn: `${interval.x}/${interval.x + interval.w}`,
            gridRow: `${interval.y}/${interval.y + interval.h}`,
          }
        : {};
    };
  }

  get componentsGridMap(): ComponentPosition[] {
    return this.cellMap.reduce(
      (acc, cell) => {
        if (acc.result.find((r) => r.x === cell.x && r.y === cell.y)) {
          return acc;
        }
        let isFixed = false;
        let interval: ScreenSizeType = "xs";
        let component = (get(builder.section, ["components"]) || []).find(
          (c) => {
            const grid = c.grid[builder.gridSourceInterval] || false;
            return (
              grid &&
              grid.x &&
              grid.y &&
              cell.x >= grid.x &&
              cell.x < grid.x + (grid.w || 1) &&
              cell.y >= grid.y &&
              cell.y < grid.y + (grid.h || 1)
            );
          }
        );
        if (component) {
          isFixed = true;
        } else {
          component = builder.sectionComponents.find(
            (c) =>
              !acc.result.map((e) => e.id).includes(c.id) &&
              !c.grid[builder.gridSourceInterval]
          );
        }
        const { w, h } = defaults(
          component?.grid[builder.gridSourceInterval] || {},
          { w: 1, h: 1 }
        );
        times(w, (ix) => {
          times(h, (iy) => {
            acc.result.push({
              x: minMax(cell.x + ix, [1, builder.gridSize.w]),
              y: minMax(cell.y + iy, [1, builder.gridSize.h]),
              isFixed,
              interval,
              id: component?.id || null,
            } as ComponentPosition);
          });
        });
        return acc;
      },
      { result: [] } as { result: ComponentPosition[] }
    ).result;
  }

  get dashboardClassName(): string {
    return ["dashboard-section"]
      .concat([
        "grid-w" + (this.section?.grid[this.gridSourceInterval]?.w || 1),
      ])
      .concat([
        "grid-h" +
          (this.section?.grid[this.gridSourceInterval]?.h ||
            this.section?.components.length ||
            1),
      ])
      .join(" ");
  }

  get isComponentFixed(): (id: string) => boolean {
    return (id: string) => {
      const component = this.sectionComponents.find((c) => c.id === id);
      return !!(
        get(component, ["grid", builder.currentScreenSize]) ||
        get(component, ["grid", builder.activeSectionInterval])
      );
    };
  }

  get componentClassName(): (id: string) => string {
    return (id) => {
      const isDragging = this.draggedComponentId === id;
      const isFixed = this.isComponentFixed(id);
      return ["component-handle"]
        .concat(isDragging ? ["drag-indicator"] : [])
        .concat(isFixed ? ["is-fixed"] : [])
        .join(" ");
    };
  }

  get boxes(): ComponentPosition[] {
    return this.sectionComponentsIds.map((id) => this.getComponentCell(id));
  }

  get getComponentCells(): (id: string) => ComponentPosition[] {
    return (id) => this.componentsGridMap.filter((g) => g.id === id);
  }

  get getComponentCell(): (id: string) => ComponentPosition {
    return (id) => {
      const cells = this.getComponentCells(id);
      const x = minMax(Math.min(...map(cells, "x")), [1, builder.gridSize.w]);
      const w = minMax(Math.max(...map(cells, "x")) - x + 1, [
        1,
        builder.gridSize.w - x + 1,
      ]);
      const y = minMax(Math.min(...map(cells, "y")), [1, builder.gridSize.h]);
      const h = minMax(Math.max(...map(cells, "y")) - y + 1, [
        1,
        builder.gridSize.h - y + 1,
      ]);
      return { ...pick(cells[0], ["isFixed", "interval", "id"]), x, y, w, h };
    };
  }

  // actions
  addSection(data: Partial<Section> = {}) {
    const section = defaults(data, {
      id: v4(),
      grid: {
        xs: { w: 1, h: 1 },
      },
      components: [],
      gap: [0],
    });
    this.dashboard.sections = [...this.dashboard.sections, section];
    this.activeSectionId = section.id;
  }
  updateSection(id: string, update: Partial<Section> = {}) {
    const dash = { ...this.dashboard };
    const index = dash.sections.findIndex((s: Section) => s.id === id);
    if (index > -1) {
      dash.sections.splice(
        index,
        1,
        defaultsDeep(update, dash.sections[index])
      );
    } else {
      this.addSection({ id, ...update });
    }
    this.dashboard = { ...dash };
  }
  replaceSection(id: string, section: Section) {
    const dash = { ...this.dashboard };
    const index = dash.sections.findIndex((s: Section) => s.id === id);
    if (index > -1) {
      dash.sections.splice(index, 1, section);
      this.dashboard = dash;
    }
  }
  removeSection(id: string) {
    this.dashboard.sections = this.dashboard.sections.filter(
      (s) => s.id !== id
    );
  }
  addComponent(data: Partial<SectionComponent> = {}) {
    if (this.section) {
      this.updateSection(this.activeSectionId, {
        components: [
          ...this.sectionComponents,
          defaults(data, {
            id: v4(),
            grid: {},
          }),
        ],
      });
      Object.entries((this.section as Section).grid).forEach(([key, grid]) => {
        if (
          grid.w &&
          grid.h &&
          grid.w * grid.h < this.sectionComponents.length
        ) {
          this.updateSection(this.activeSectionId, {
            grid: {
              [key]: {
                h: Math.ceil(this.sectionComponents.length / grid.w),
                w: grid.w,
              },
            },
          });
        }
      });
    }
  }
  updateComponent(id: string, update: Partial<SectionComponent>) {
    if (this.section) {
      const section = { ...this.section };
      const index = (section.components as SectionComponent[]).findIndex(
        (c) => c.id === id
      );
      if (index > -1) {
        section.components.splice(
          index,
          1,
          defaultsDeep(update, section.components[index])
        );
        this.updateSection(this.section.id, section);
      }
    }
  }
  startResize(id: string) {
    this.draggedComponentId = id;
    this.isResizing = true;
    const c = this.getComponentCell(id);
    this.dragStart = {
      x: c.x + c.w - 1,
      y: c.y + c.h - 1,
      c,
    };
  }
}

export const builder: Builder = new Builder();

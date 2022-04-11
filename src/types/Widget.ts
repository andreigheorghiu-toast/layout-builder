import { LazyExoticComponent } from "react";

import { layout } from "@/store";
import { ILayoutModule, IWidget } from "@/types";
import { getItemTitle, titleCase } from "@/util";

export class Widget implements IWidget {
  component?: LazyExoticComponent<any>;
  module!: ILayoutModule;
  id!: string;
  isOpen = false;
  stores: string[] = [];
  props: Record<string, unknown> = {};
  _title = "";
  constructor(data: Partial<IWidget>) {
    Object.assign(this, data);
  }

  get title() {
    return `${getItemTitle(this.module)} - ${
      this._title || titleCase(this.id)
    }`;
  }

  set title(val) {
    this._title = val;
  }

  get icon(): LazyExoticComponent<any> {
    return this.module.icon;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  update() {
    layout.updateWidget(this);
  }
}

import React, { ExoticComponent, LazyExoticComponent, SVGProps } from "react";

import { Builder, Layout } from "@/store";

export type TrackSide = "left" | "right";
export type PageSize = "S" | "M" | "L";

export interface ILayoutModule {
  id: string;
  icon:
    | LazyExoticComponent<ExoticComponent>
    | LazyExoticComponent<(props: SVGProps<SVGSVGElement>) => JSX.Element>;
  widgets?: IWidget[];
  page?: string;
  title?: string;
}
export interface IWidget {
  module?: ILayoutModule;
  id: string;
  title?: string;
  isOpen?: boolean;
  component?: unknown;
  getsFocus?: boolean;
  stores?: string[];
  props?: Record<string, unknown>;
}

export interface RoutePage {
  component: LazyExoticComponent<any>;
  path: string;
  stores?: ("layout" | "builder")[];
  props?: Record<string, string>;
}

export interface GridPosition {
  x: number;
  y: number;
}

export interface GridSize {
  w: number;
  h: number;
}

export interface PageSizeInterval {
  label: string;
  size: PageSize;
}

export type GridSizePosition = GridSize & GridPosition;

export interface ComponentPosition extends GridSizePosition {
  id: string | null;
  isFixed?: boolean;
  interval: ScreenSizeType;
}

export type GridDefinition = Partial<Record<ScreenSizeType, GridSizePosition>>;

export type ScreenSizeType = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export interface SectionComponent {
  id: string;
  grid: GridDefinition;
}

export interface Section {
  id: string;
  grid: GridDefinition;
  gap: [number] | [number, number];
  components: SectionComponent[];
}
export interface Dashboard {
  sections: Section[];
}

export interface ScreenSize {
  id: ScreenSizeType;
  from: number;
  to: number;
}

export interface LazyComponentProps {
  layout: Layout;
  builder: Builder;
}

export type LazyComponent = LazyExoticComponent<
  (props?: Partial<LazyComponentProps>) => JSX.Element
>;

export interface TableField {
  id: string;
  title?: string;
}

export interface CellPayload {
  field: TableField;
  gridKey: ScreenSizeType;
  value?: GridSize & GridPosition;
  gridIndex: number;
  section: Section;
  sectionIndex: number;
}

export type MEvent = React.MouseEvent | MouseEvent;
export * from "./Widget";

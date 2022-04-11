import { lazy } from "react";

import { LazyComponent } from "@/types";

//pages
export const DashboardBuilder = lazy(() => import("@/pages/DashboardBuilder"));
export const EmptyPage = lazy(() => import("@/pages/EmptyPage"));
export const TheMap = lazy(
  () => import("@/components/TheMap")
) as LazyComponent;

//widgets
export const Logger = lazy(() => import("@/components/Logger"));
export const PageSizeSwitch = lazy(() => import("@/components/PageSizeSwitch"));
export const SectionBuilder = lazy(() => import("@/components/SectionBuilder"));
export const TreeView = lazy(() => import("@/components/TreeView"));
export const ResponsivenessSwitch = lazy(
  () => import("@/components/ResponsivenessSwitch")
);
//layout
export const TheNavbar = lazy(
  () => import("@/components/TheNavbar")
) as LazyComponent;
export const TheTopbar = lazy(() => import("@/components/TheTopbar"));

//icons
export const DocumentIcon = lazy(
  () => import("@heroicons/react/outline/DocumentIcon")
);
export const XIcon = lazy(() => import("@heroicons/react/outline/XIcon"));
export const PencilIcon = lazy(
  () => import("@heroicons/react/outline/PencilIcon")
);
export const SelectorIcon = lazy(
  () => import("@heroicons/react/outline/SelectorIcon")
);
export const ArrowsExpandIcon = lazy(
  () => import("@heroicons/react/outline/ArrowsExpandIcon")
);
export const CursorClickIcon = lazy(
  () => import("@heroicons/react/outline/CursorClickIcon")
);
export const LocationMarkerIcon = lazy(
  () => import("@heroicons/react/solid/LocationMarkerIcon")
);
export const ChevronDownIcon = lazy(
  () => import("@heroicons/react/outline/ChevronDownIcon")
);
export const HomeIcon = lazy(() => import("@heroicons/react/outline/HomeIcon"));

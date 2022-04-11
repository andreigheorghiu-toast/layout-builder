import {
  DocumentIcon,
  HomeIcon,
  /*LocationMarkerIcon,*/
  Logger,
  PageSizeSwitch,
  ResponsivenessSwitch,
  SectionBuilder,
  TreeView,
} from "@/components/async";
import { ILayoutModule } from "@/types";

export const modules: ILayoutModule[] = [
  /*{
    id: "map",
    title: "Map",
    icon: LocationMarkerIcon,
    page: "/",
  },
  */ {
    id: "home",
    icon: HomeIcon,
    page: "/",
  },
  {
    id: "dashboard-builder",
    title: "Builder",
    icon: DocumentIcon,
    page: "builder",
    widgets: [
      {
        id: "responsiveness",
        component: ResponsivenessSwitch,
        stores: ["builder"],
      },
      {
        id: "page-size",
        component: PageSizeSwitch,
        stores: ["layout"],
      },
      {
        id: "section-builder",
        title: "Sections",
        component: SectionBuilder,
      },
      {
        id: "tree-view",
        component: TreeView,
        getsFocus: true,
      },
      {
        id: "logger",
        component: Logger,
      },
    ],
  },
];

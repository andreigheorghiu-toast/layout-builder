import { DashboardBuilder, EmptyPage } from "@/components/async";
import { RoutePage } from "@/types";
export const routes: RoutePage[] = [
  {
    path: "/",
    component: EmptyPage,
  },
  {
    path: "/builder",
    component: DashboardBuilder,
  },
];

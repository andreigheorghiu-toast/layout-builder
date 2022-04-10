import { RoutePage } from "@/types";
import { DashboardBuilder, EmptyPage } from "@/components/async";
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

import { autorun } from "mobx";
import { useEffect } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

import { modules } from "@/config";
import { layout } from "@/store";

export const usePageSwitch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    layout.location = location.pathname;
  }, [location]);

  useEffect(() => {
    autorun(() => {
      let module = layout.activeModule;
      if (!module) {
        module = modules.find(
          (m) => m.page === (layout.location?.substring(1) || "/")
        );
        layout.activeModuleId = module?.id || modules[0]?.id || "";
        return;
      }
      if (module && "page" in module && module?.page) {
        const modulePath = module.page.startsWith("/")
          ? module.page
          : `/${module.page}`;
        if (!matchPath(location.pathname, modulePath)) {
          navigate(modulePath);
        }
      }
    });
  });
};

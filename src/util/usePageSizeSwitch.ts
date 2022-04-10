import {matchPath, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {autorun} from "mobx";
import {layout} from "@/store";

export const usePageSwitch = () => {
    const navigate = useNavigate();
    useEffect(() => {
        autorun(() => {
            const module = layout.activeModule;
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
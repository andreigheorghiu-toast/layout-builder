import { observer } from "mobx-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Layout, layout } from "@/store";
interface Props {
  layout: Layout;
}
const TheTopbar = () => {
  const InnerTopbar = observer(({ layout }: Props) => {
    useEffect(() => {
      const rootDiv = document.querySelector(".App");
      if (rootDiv) {
        rootDiv.classList[layout.darkMode ? "add" : "remove"]("dark-mode");
      }
    }, [layout.darkMode]);
    return (
      <div className="flex">
        <label>
          <input
            defaultChecked={layout.darkMode}
            onChange={(e) => {
              layout.darkMode = e.target.checked;
            }}
            type="checkbox"
          />
          Dark mode
        </label>
      </div>
    );
  });

  const navigate = useNavigate();

  const goHome = () => {
    const module = layout.modules.find((m) => "page" in m);
    if (module) {
      layout.activeModuleId = module.id;
    } else {
      layout.activeModuleId = "";
      navigate("/");
    }
  };

  return (
    <div className="top-bar" role="region" aria-label="Title bar">
      <h3 className="go-home" onClick={() => goHome()}>
        <div className="router-link">Layout Builder</div>
      </h3>
      <InnerTopbar layout={layout} />
    </div>
  );
};

export default TheTopbar;

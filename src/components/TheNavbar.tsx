import { observer } from "mobx-react";

import GenericIcon from "@/components/GenericIcon";
import { Layout, layout } from "@/store";
import { getItemTitle } from "@/util";
interface Props {
  layout: Layout;
}
const TheNavbar = () => {
  const ModuleIcons = observer(({ layout }: Props) => {
    return (
      <>
        {(layout.modules || []).map((module) => (
          <div
            key={module.id}
            className={
              "menu-item" +
              (layout.activeModuleId === module.id ? " active" : "")
            }
            onClick={() => {
              layout.activeModuleId = module.id;
            }}
            title={getItemTitle(module)}
          >
            <GenericIcon icon={module.icon} />
          </div>
        ))}
      </>
    );
  });

  return (
    <div className="lb-navbar" role="menu">
      <ModuleIcons layout={layout} />
    </div>
  );
};
export default TheNavbar;

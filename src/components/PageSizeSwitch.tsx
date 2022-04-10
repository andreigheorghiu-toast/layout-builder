import { Layout } from "@/store";
import { observer } from "mobx-react";
import { pageSizes } from "@/util";

interface Props {
  layout: Layout;
}
const PageSizeSwitch = observer(({ layout }: Props) => (
  <div>
    <div className="toggle-switch">
      {pageSizes.map((size) => (
        <div
          key={size.label}
          className={layout.pageSize === size.size ? "active" : ""}
          onClick={() => (layout.pageSize = size.size)}
        >
          {size.label}
        </div>
      ))}
    </div>
  </div>
));
export default PageSizeSwitch;
